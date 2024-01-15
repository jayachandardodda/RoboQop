
from django.http import HttpResponse, JsonResponse

from rest_framework.views import APIView

from rest_framework import status, generics , mixins , permissions, authentication
import requests
import pandas as pd
from portfolio.models import PortfolioDetails
from portfolio.serializers import PortfolioDetailsSerializers,PortfolioListSerializer, ModelPortfolioListSerializer,ModelDetailsSerializer
import simplejson as json
from portfolio.metrics import get_returns_ticker, get_risk_ticker , get_sharpe_ratio, get_list, merge_portfolios, get_stock_data, EfficientFrontier,list_to_gcharts
# from portfolio.metrics.EfficientFrontier import get_portfolio_performance
from portfolio.model_data import get_model_data1, get_model_data2
from dateutil.relativedelta import *
from decimal import Decimal
from signals.models import BuySellSignals
import  pandas as pd
 


class ModelPorfolioDetails(mixins.CreateModelMixin, generics.GenericAPIView):
    queryset =PortfolioDetails.objects.all()
    serializer_class = ModelDetailsSerializer
    lookup_field = 'pk'

    def post(self, request, *args, **kwargs):
        # print('investment amount', request.data.get('investmentAmount'))
        return self.create(request, *args, **kwargs)

    


class PorfolioMixinView(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    generics.GenericAPIView,
    mixins.UpdateModelMixin,
    ):

    queryset =PortfolioDetails.objects.all()
    serializer_class = PortfolioDetailsSerializers
    lookup_field = 'pk'
    # authentication_classes = [authentication.SessionAuthentication]
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    
    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        if pk is not None:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        # queryset = PortfolioDetails.objects.get(id = request.data.get("portfolio_id"))
        return self.partial_update(request, *args, **kwargs)


class UpdatePortfolioView(generics.GenericAPIView):

    queryset =PortfolioDetails.objects.all()
    serializer_class = PortfolioDetailsSerializers

    def patch(self, request, *args,**kwargs):
        portfolio_id = request.query_params.get('id')
        # print('portfolio id', portfolio_id)
        # print('request data', request.data)
        # print('filter',PortfolioDetails.objects.filter(pk = portfolio_id))
        PortfolioDetails.objects.filter(pk = portfolio_id).update(**request.data)
        return JsonResponse({"portfolio_id":portfolio_id})


class HoldingDetailsView(generics.GenericAPIView):

    queryset =PortfolioDetails.objects.all()
    serializer_class = PortfolioDetailsSerializers
    lookup_field ='pk'

    def get(self, request, pk, *args, **kwargs):

        try:
            portfolio_data = PortfolioDetails.objects.get(pk=pk)
        except PortfolioDetails.DoesNotExist:
            return JsonResponse({"error": "Portfolio not found"}, status=404)
        
        print('portfolio data', portfolio_data.stock_data, type(portfolio_data.investment_amount))
        holding_table_data_list = [{
        "StockTicker": stock_data.get("StockTicker"),
        "CurrentPrice": round(Decimal(stock_data.get("CurrentPrice")),2),
        "holding": round((stock_data.get("Amount")/sum(s["Amount"] for s in portfolio_data.stock_data))*100,2),
        "annual_returns": round((get_returns_ticker(stock_data.get("StockTicker"), start_date='2018-05-01', end_date='2021-12-21'))*100,2),
        "annual_volatility": round((get_risk_ticker(stock_data.get("StockTicker"), start_date='2018-05-01', end_date='2021-12-21'))*100,2),
        "investment_amount": round(Decimal(stock_data.get("CurrentPrice"))*stock_data.get("Volume"),2),
        } for stock_data in portfolio_data.stock_data]
        
       
        
        holding_details = {
        "initial_amount": portfolio_data.investment_amount,
        "sharpe_ratio": "N/A",
        "cagr": "N/A",
        "final_balance": "N/A",
        "max_drawdown": "N/A",
        "annual_return": "N/A",
        "annual_volatility": "N/A",
        "maximum_loss": "N/A",
        "best_month": "N/A",
        "worst_month": "N/A",
        "data_list": holding_table_data_list,
    }
        
        return JsonResponse(holding_details, safe=False)


class MergePortfolioView(APIView):
    
    serializer_class = PortfolioDetails

    def post(self, request,*args, **kwargs):
        portfolio_list = []
        input_primary_portfolio_id = request.data.get('primary_portfolio_id')
        input_secondary_portfolio_id = request.data.get('secondary_portfolio_id')
        # print('portfolio id', input_primary_portfolio_id, input_secondary_portfolio_id)
        PortfolioDetails.objects.filter(pk=input_primary_portfolio_id).update(is_merged=True)
        portfolio_list.append(PortfolioDetails.objects.filter(pk=input_primary_portfolio_id).values().first())
        for id in input_secondary_portfolio_id:
            # print('id',id)
            portfolio = PortfolioDetails.objects.filter(pk=id).values().first()
            portfolio["is_merged"] = True
            # print("is merged flag", portfolio.get("is_merged"))
            # print('secondary portfolio', portfolio)
            PortfolioDetails.objects.filter(pk=id).update(is_merged=True)
            # portfolio.save(update_fields = ["is_merged"])
            portfolio_list.append(portfolio)
            # print('portfolio',portfolio)
        # print('portfolio list', len(portfolio_list))
        merged_portfolio = merge_portfolios(portfolio_list)
        
        # obj = MergedPortfolio(merged_portfolio)
        user_id = request.data.get('user')
        # print('user id', user_id, PortfolioDetails.objects.filter(pk = input_primary_portfolio_id).values("fullName").first().get("fullName"))
        merged_portfolio["user"] = user_id
        merged_portfolio["fullName"] = PortfolioDetails.objects.filter(pk = input_primary_portfolio_id).values("fullName").first().get("fullName")
        merged_portfolio["familyName"] = PortfolioDetails.objects.filter(pk = input_primary_portfolio_id).values("familyName").first().get("familyName")
        merged_portfolio["emailId"] = PortfolioDetails.objects.filter(pk = input_primary_portfolio_id).values("portfolioName").first().get("portfolioName")
        merged_portfolio["city"] = PortfolioDetails.objects.filter(pk = input_primary_portfolio_id).values("city").first().get("city")
        merged_portfolio["state"] = PortfolioDetails.objects.filter(pk = input_primary_portfolio_id).values("state").first().get("state")
        merged_portfolio["pincode"] = PortfolioDetails.objects.filter(pk = input_primary_portfolio_id).values("pincode").first().get("pincode")
        merged_portfolio["address"] = PortfolioDetails.objects.filter(pk = input_primary_portfolio_id).values("address").first().get("address")
        merged_portfolio["portfolioName"] = PortfolioDetails.objects.filter(pk = input_primary_portfolio_id).values("portfolioName").first().get("portfolioName")
        merged_portfolio["tenure"] = PortfolioDetails.objects.filter(pk = input_primary_portfolio_id).values("tenure").first().get("tenure")
        # print('merged portfolios', merged_portfolio)

        PortfolioDetails.objects.filter(pk=input_primary_portfolio_id).update(**merged_portfolio)
        serializer = PortfolioDetailsSerializers(data = merged_portfolio)
        
        # if not serializer.is_valid():
        #     # print('serializer type', type(serializer),serializer.data)
            # print(serializer.errors)
        if serializer.is_valid():
            # print('serializer data',serializer.validated_data)
            serializer.save()
        return JsonResponse(merged_portfolio)
    
    def get(self, request, *args, **kwargs):

        merged_postfolio = PortfolioDetails.objects.filter(is_merged = False)
        serializer = PortfolioDetailsSerializers(merged_postfolio, many = True)
        return JsonResponse(serializer.data, safe = False)


class DeactivateView(generics.GenericAPIView):

    def post(self,request):
        portfolio_id = request.data.get("portfolio_id")
        for id in portfolio_id:
            PortfolioDetails.objects.filter(pk = id).update(is_active =False)
        return JsonResponse({"portfolio_id":portfolio_id})

class GraphView(APIView):

    def post(self, request, *args, **kwargs):
      
        date ="2010-01-01"
        portfolio_id = request.query_params.get("id")
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        portfolio = PortfolioDetails.objects.filter(id=portfolio_id).values(
            "stock_data", "investment_amount", "is_scratch", "stable_weights", "risky_weights","model_type"
        ).first()

        portfolio_data = portfolio.get("stock_data")
        investment_amount = portfolio.get("investment_amount")
        is_scratch = portfolio.get("is_scratch")
        
        weights_dict = {}
        weights_dict.update(portfolio.get("stable_weights"))
        weights_dict.update(portfolio.get("risky_weights"))
        print(weights_dict)
        model_type = portfolio.get("model_type")
        print("data", portfolio_data, investment_amount, is_scratch, weights_dict, model_type)
        # portfolio_data = PortfolioDetails.objects.filter(id= portfolio_id).values("stock_data").first()
        # investment_amount = PortfolioDetails.objects.filter(id=portfolio_id).values("investment_amount").first()
        # is_scratch =PortfolioDetails.objects.filter(id=portfolio_id).values("is_scratch").first().get('is_scratch')
        # weights_dict = PortfolioDetails.objects.filter(id= portfolio_id).values("weights").first().get("weights")
        # model_type = PortfolioDetails.objects.filter(id= portfolio_id).values("model_type").first().get("model_type")
        stock_list =[]
        weight_list =[]
        print('weight dict', weights_dict,type(weights_dict))
       
        if is_scratch:
            
            efficient_frontier = EfficientFrontier()
            stocks = [data.get("StockTicker") for data in portfolio_data]
            weights = [float(round(Decimal(data.get("Amount")) / investment_amount,2)) for data in portfolio_data]
            # stocks, weights = list(weights_dict.keys()), list(weights_dict.values())
            weights_dict = dict(zip(stocks, weights))
            print("before opt:", weights_dict)
            graph_details = get_list(portfolio_data, investment_amount, start_date, end_date)
            stock_total = graph_details["stock_total"]
            date = graph_details["date"]
            graph_data = {
                "efficient_frontier": efficient_frontier.get_efficient_graph(weights_dict, stocks),
                "graph": list_to_gcharts(date, stock_total),
                "weights": list_to_gcharts(stocks, weights),
            }
        else:
            factor = investment_amount/10000
            stock_list = []
            weight_list = []
            efficient_frontier = EfficientFrontier()
            for stock, vol in weights_dict.items():
                if vol > 0:
                    vol *= 100
                    stock_list.append(stock)
                    weight_list.append(vol)
            if model_type == "Model Portfolio 1":
                date, values = get_model_data1()
            else:
                date, values = get_model_data2()
            data_list = [round(Decimal(value) * Decimal(factor),2) for value in values]
            graph_data = {
                "efficient_frontier": efficient_frontier.get_efficient_graph(weights_dict, stock_list),
                "graph": list_to_gcharts(date, data_list),
                "weights": list_to_gcharts(stock_list, weight_list),
            }
        return JsonResponse(graph_data, safe=False)

       
       
       


class ListPortfolioMixinView(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    generics.GenericAPIView
    ):

    queryset = PortfolioDetails.objects.all()
    serializer_class = PortfolioListSerializer
    lookup_field = 'pk'
    # authentication_classes = [authentication.SessionAuthentication]
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, *args, **kwargs):
        # pk = kwargs.get('pk')
        user_id = request.query_params.get("user_id")
        portfolio_list = PortfolioDetails.objects.filter(user_id = user_id, is_model =False,is_merged = False, is_active =True)
        # print("portfolio lis", portfolio_list.values("fullName"))
        serializer = PortfolioListSerializer(portfolio_list, many = True)
        # print('serilizer', serializer.data)
        return JsonResponse(serializer.data, safe=False)
        # if pk is not None:
        #     return self.retrieve(request, *args, **kwargs)
        # return self.list(request, *args, **kwargs)

    def get_queryset(self, *args, **kwargs):
        request = self.request
        return super().get_queryset(*args, **kwargs)


class ModelPortfolioList(generics.GenericAPIView):

    def get(self, request):
        model_portfolio = PortfolioDetails.objects.filter(is_model = True)
        serializer = ModelPortfolioListSerializer(model_portfolio, many = True)
        # print("serializer data", serializer.data)
        return JsonResponse(serializer.data, safe =False)


    

class ModelPortfolioView(generics.GenericAPIView):

   def post(self,request,*args, **kwargs):
        modelportfolio = request.data.get("model_name")
        
        model_id=0
        if modelportfolio=="Model Portfolio 1":
            model_id=1
        else:
            model_id=2
        portfolio_id = request.data.get("portfolio_id")
        investment_amount = PortfolioDetails.objects.filter(id = portfolio_id).values("investment_amount").first().get('investment_amount')
        # print('investment amount', portfolio_id,investment_amount)
        
        
        URL = "http://54.183.235.251:8001/optimization/"
        #URL = "http://54.176.47.208:8001/optimization/"


        payload = json.dumps({
            "strategy" : "MPT",
            "backend" : "classical",
            "modelportfolio" : model_id,
            "weights" : {},
            "lb" :  0,
            "ub" :  1,
            "lam" :  1,
            "problem" :  "Risk Returns",
            "start_date" : "2010-01-01",
            "end_date":"2016-02-03",
            "investors_views": {}


        })

        print("r pay",payload)
        r = requests.post(url = URL, data = payload)
        print("r bug :",r.json())
        stable_weights_allocation, risky_weights_allocation = r.json()
        stable_weights_allocation = pd.DataFrame(stable_weights_allocation).to_dict("records")[0]
        if modelportfolio==2:
            risky_weights_allocation = pd.DataFrame(risky_weights_allocation).to_dict("records")[0]
        else:
            risky_weights_allocation={}
        
        
        portfolio_data = {}
        portfolio_data["investment_amount"] = investment_amount
        portfolio_data["tenure"] = 5
        
        
        
        stable_data_list = get_stock_data(stable_weights_allocation,investment_amount)
        risky_data_list = get_stock_data(risky_weights_allocation,investment_amount)
        print("stable ",stable_data_list)
        print("risky ",risky_data_list)

        data_list=[]

        for i in stable_data_list :
            data_list.append(i)
        for i in risky_data_list :
            data_list.append(i)

        print("data-list",data_list)

        portfolio_data["stock_data"] = data_list
        portfolio_id = request.data.get("portfolio_id")
        PortfolioDetails.objects.filter(pk=portfolio_id).update(**portfolio_data)
        PortfolioDetails.objects.filter(pk = portfolio_id).update(is_scratch =False)
        PortfolioDetails.objects.filter(pk=portfolio_id).update(stable_weights =stable_weights_allocation)
        PortfolioDetails.objects.filter(pk=portfolio_id).update(risky_weights =risky_weights_allocation)
        PortfolioDetails.objects.filter(pk=portfolio_id).update(model_type = modelportfolio)
        # created = PortfolioDetails.objects.update(investment_amount = portfolio_data.get('investment_amount'), tenure= portfolio_data.get('tenure'), stock_data = data_list)
        # print("created", created.id)
        # serializer = PortfolioDetailsSerializers(data = portfolio_data)
        # if not serializer.is_valid():
        #     print('serializer type', type(serializer),serializer.data)
        #     print(serializer.errors)
        # if serializer.is_valid():
        #     print('data saved',serializer.validated_data)
        #     serializer.save()
        #     print('serializer id', PortfolioDetails.id)
        # # except requests.exceptions.ConnectionError:
        # graph_details = get_list(portfolio_data,portfolio_data.get("investment_amount"),start_date,end_date)
        #     print("Connection error")
        return JsonResponse({"portfolio_id":portfolio_id,"stock_data":stable_data_list}, safe =False)


class CompareIndex(generics.GenericAPIView):
    
    def post(self, request):
        
        index = request.data.get("index")
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")
        portfolio_id = request.data.get("portfolio_id")
        investment_amount = PortfolioDetails.objects.filter(id = portfolio_id).values("investment_amount").first().get('investment_amount')
        # print('investment',investment_amount)
        gspc = pd.read_csv('/code/portfolio/twelve_years_gspc.csv')
        dates = list(gspc['Date'])
        start_index = (gspc[gspc['Date'] == (start_date)]).index
        end_index = (gspc[gspc['Date'] == (end_date)]).index
        date = gspc['Date'].iloc[int(start_index[0]):int(end_index[0])+1].to_list()
        
        norm_stock = (gspc['GSPC'].iloc[int(start_index[0]):int(end_index[0])+1].pct_change()+1).cumprod()*float(investment_amount)
        norm_stock.iloc[0]=investment_amount
        
        # stock_list = gspc['GSPC'].iloc[int(start_index[0]):int(end_index[0])+1].to_list()
        stock_list = norm_stock.to_list()
        
        
        # print('date', date)
        graph =[]
        graph = list_to_gcharts(date,stock_list)
        # for i in range(len(date)):
        #     lis = []
        #     lis.append(date[i])
        #     lis.append(stock_list[i])
        #     graph.append(lis)
            
        return JsonResponse(graph, safe=False)

##########################################################################################
