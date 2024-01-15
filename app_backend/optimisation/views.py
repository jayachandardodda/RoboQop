import logging
from decimal import Decimal

import pandas as pd
import requests
import simplejson as json
from django.http import JsonResponse
from portfolio.metrics import (EfficientFrontier, get_list, get_returns_ticker,
                               get_risk_ticker, list_to_gcharts)
from rest_framework import status, generics , mixins , permissions, authentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger('main')

class Optimise(generics.GenericAPIView):


    def post(self, request):

        ### if user sends portfolio_id then save to Db    
        portfolio_id = request.data.get("portfolio_id") 
        print(portfolio_id)

        ## asset table 
        """{
            "Ticker":{
                "lb"   :value
                "ub"   :value
                "group":value
                "expected_return":value
                "expected_volatility":value
            }
        }
        """
        asset_data  = request.data.get("asset_data")
        group_data = request.data.get("group_data")
        weights_dict = {}
        stable_lb_dict = {}
        stable_ub_dict = {}
        group_dict  = {}
        group_lb_dict = {}
        group_ub_dict = {}
        mu = {}
        volatilities = {}
        
        print("asset",asset_data.items())
        
        for  key , value in asset_data.items():
            # key is stock ticker 
            lb = value.get("lb")
            ub = value.get("ub")
            group = value.get("group")
            expected_return = value.get("expectedReturn")
            expected_volatility = value.get("expectedVolatility")

            if lb is not None:
                stable_lb_dict[key] = lb

            if ub is not None:
                stable_ub_dict[key] = ub

            if group is not None:
                group_dict[key] = group

            if expected_return is not None and expected_return != '':
                mu[key] = expected_return

            if expected_volatility is not None and expected_volatility != '':
                volatilities[key] = expected_volatility

            weights_dict[key] = value.get("allocation", 0.0)

    
        if group_data!=None: 
            for key , value in group_data.items():
                # key is group name
                group_lb_dict[key] = value["lb"]
                group_ub_dict[key] = value["ub"]
                
        print(request.data.get("lam"))
    

        payload = {
            "strategy" : request.data.get("strategy"),
            "backends" : request.data.get("backends"),
            "modelportfolio" :1,
            "weights" : weights_dict,
            "stable_lb_dict" :  stable_lb_dict,
            "stable_ub_dict" :  stable_ub_dict,
            "group_dict":group_dict,
            "group_lb_dict":group_lb_dict,
            "group_ub_dict":group_ub_dict,
            "lam" :  request.data.get("lam") if request.data.get("lam") is not None else None,
            "problem" :  request.data.get("goal") or None,
            "beta": request.data.get("beta") or None,
            "mu": mu or None,
            "sigma": None,
            "volatilities":volatilities or None,
            "target_risk" : request.data.get("target_risk"),
            "target_returns" : request.data.get("target_returns"),
            "min_stable_cardinality": request.data.get("min_assets"),
            "max_stable_cardinality": request.data.get("max_assets"),
            "start_date" : request.data.get("start_date"),
            "end_date": request.data.get("end_date"),
            "investors_views":request.data.get("investors_views"),
            "transaction_limit":request.data.get("transaction_limit"),
            "initial_weights": request.data.get("transactional_weights")
        }
        
        
        
        print("payload:", payload)
        print(type(payload["min_stable_cardinality"]))
        filtered_data = {k: v for k, v in payload.items() if v is not None}
        payload = json.dumps(filtered_data)
        print("payload:", payload)

        response = {}
        response['weights']={}
        
        URL = 'http://65.1.13.72:8001/optimization/'

        try:
            r = requests.post(url=URL, data=payload)
            print('rjson', r.json(), requests.codes.ok)
            if r.status_code == requests.codes.ok:
                # weights 
                stable_weights_allocation, risky_weights_allocation,historical_flag = r.json()
                print(stable_weights_allocation, risky_weights_allocation,historical_flag)
                print("r.json.............", stable_weights_allocation)
                pass

            else:
                # Handle other non-successful status codes
                error_message = f"Request failed with status code: {r.status_code}"
                return JsonResponse({"error": error_message}, status=r.status_code)

        except requests.exceptions.RequestException as e:
            error_message = str(e)
            return JsonResponse({"error": error_message}, status=500)  # Internal Server Error
        except Exception as e:
            error_message = "An error occurred during the request."
            return JsonResponse({"error": error_message}, status=500)  # Internal Server Error
        
        
        ##  Portfolio Optimisation Weights
        response["weights"]["given"]= weights_dict

        if request.data.get("backends")==["classical"]:
            response["weights"]["classical_optimised"] = stable_weights_allocation["weights_classical"]
            response["weights"]["quantum_optimised"] = {}
            
        elif request.data.get("backends")==["quantum"]:
            response["weights"]["quantum_optimised"] = stable_weights_allocation["weights_quantum"]
            response["weights"]["classical_optimised"] = {}
           
        else:
            response["weights"]["classical_optimised"] = stable_weights_allocation["weights_classical"]
            response["weights"]["quantum_optimised"] = stable_weights_allocation["weights_quantum"]
            
        
        ###Efficient Frontier , health metrics and value overtime

        new_weights_classical = {}
        print("bug weights ",stable_weights_allocation["weights_classical"])
        for key, value in stable_weights_allocation["weights_classical"].items():
            # print(list(value.items()),list(value.items())[0][1],key)
            ticker=key
            weight_value = list(value.items())[0][1]
            new_weights_classical[ticker] = weight_value
        
        new_weights_quantum = {}
        for key, value in stable_weights_allocation["weights_quantum"].items():
            ticker=key
            weight_value = list(value.items())[0][1]
            new_weights_quantum[ticker] = weight_value

        
        start_date = request.data.get("start_date")
        end_date = request.data.get("end_date")
        benchmark = 'nasdaq100'
        # benchmark = request.data.get("benchmark")
        weights = weights_dict
        money = 1000
        opt_weights = {"weights_classical":new_weights_classical,
                       "weights_quantum": new_weights_quantum }
        
        if request.data.get("strategy") in ['L2', 'TE']:
            strategy= 'index_tracking'
        else :
            strategy= "optimization"
        payload = json.dumps({
            "benchmark" : request.data.get("benchmark"),
            "weights" :weights,
            "investment_amount" : money,
            "start_date": start_date,
            "end_date": end_date,
            "optimized_weights": opt_weights,
            "strategy" : strategy,
            "historical": historical_flag
            # "sip":100
        })
        
        print("bug payload",payload)
        
        URL = "http://65.1.13.72:8001/portfolio_analysis/"
        
        try:
            r = requests.post(url=URL, data=payload)
            if r.status_code == requests.codes.ok:
                # print(len(r.json()))
                chart, health_metrics, efficient_frontier = r.json()
                print('chart', chart)
                response["health_metrics"] = health_metrics
                df = pd.DataFrame(chart)
                data_dict = {}
                # Iterate over each column starting from the second column
                for col in df.columns[0:]:
                    # Get the column header
                    key = col.strip()
                    # Get the values from the index and current column and convert them to a list of pairs
                    values = [[index, df.loc[index, col]] for index in df.index]
                    # Add the list of pairs to the dictionary
                    data_dict[key] = values
                # Print the resulting dictionary
                # print('data dict', data_dict)
                response["chart"]=data_dict
                # print('chart',response["chart"])
                weights_random , risks_rets_random , risks_rets_optimized_classical, risks_rets_optimized_quantum ,risks_rets_provided = efficient_frontier
                risks_rets_random = [[float(key), value] for key, value in risks_rets_random.items()]
                risks_rets_optimized_classical = [[float(key), value] for key, value in risks_rets_optimized_classical.items()]
                risks_rets_optimized_quantum = [[float(key), value] for key, value in risks_rets_optimized_quantum.items()]
                risks_rets_provided = [[float(key), value] for key, value in risks_rets_provided.items()]
                
                response["efficient_frontier"]={}
                response["efficient_frontier"]["random"] = risks_rets_random
                response["efficient_frontier"]["provided"] = risks_rets_provided
                response["efficient_frontier"]["classical"]=risks_rets_optimized_classical
                response["efficient_frontier"]["quantum"] = risks_rets_optimized_quantum
                response["efficient_frontier"]["random_weights"]=weights_random
                # pass
                # print('response', response)
                return JsonResponse(response)

            else:
                # Handle other non-successful status codes
                error_message = f"Request failed with status code: {r.status_code}"
                return JsonResponse({"error": error_message}, status=r.status_code)

        except requests.exceptions.RequestException as e:
            error_message = str(e)
            return JsonResponse({"error": error_message}, status=500)
        
        except Exception as e:
            error_message = "An error occurred during the request."
            return JsonResponse({"error": error_message}, status=500)  # Internal Server Error

       
        # return JsonResponse(response)


        

 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
    # def get(self, request):
    #     """_summary_

    #     Args:
    #         request (_type_): _description_

    #     Returns:
    #         _type_: _description_
    #     """
    #     # logging.info('I told you so')
    #     # logging.warning('Watch out!')
       
    #     stock_weights = {}
    #     portfolio_id = request.query_params.get("portfolio_id")
    #     backend = request.query_params.get('backend')
    #     portfolio_data = PortfolioDetails.objects.filter(pk=portfolio_id).values().first()
    #     investment_amount = PortfolioDetails.objects.filter(pk = portfolio_id).values("investment_amount").first()
    #     stock_data = PortfolioDetails.objects.filter(pk = portfolio_id).values("stock_data").first()
    #     logger.debug(portfolio_id)
    #     # print('stock_data', stock_data)
    #     for stocks in stock_data.get("stock_data"):
    #         # print('stocks', stocks)
    #         stock_weights[stocks.get("StockTicker")] = (Decimal((stocks.get("Amount")))/Decimal(investment_amount.get("investment_amount")))
       
    #     # print('stock weights', stock_weights)
    #     payload = json.dumps({
    #     "backend" : backend, 
    #     "weights" : stock_weights
    #     }, use_decimal =True)
    #     r = requests.get('http://54.176.47.208/optimization/', data = payload,verify=False, timeout=5)
    #     # print(r.json())
    #     weights = r.json()
    #     # print('weights',weights)
    #     holding_table_list = []
    #     holding_details ={}
    #     # print('portfolio data', portfolio_data.get("stock_data"))
    #     for i,stock_data in enumerate(portfolio_data.get("stock_data")):
    #         holding_table_data = {}
    #         # print('Stock data', stock_data)
    #         # stock_data.get("Volume") >0:
    #         holding_table_data["StockTicker"] = stock_data.get("StockTicker")
    #         holding_table_data["CurrentPrice"] = stock_data.get("CurrentPrice")
    #         holding_table_data["holding"] = (stock_data.get("Amount")/sum(stock_data["Amount"] for stock_data in portfolio_data.get("stock_data")))*100
    #         # holding_table_data["CurrentPrice"] = stock_data.get("CurrentPrice")
    #         holding_table_data["annual_returns"] = (get_returns_ticker(stock_data.get("StockTicker"), start_date='2018-05-01',end_date = '2021-12-21'))*100
    #         holding_table_data["annual_volatility"] = (get_risk_ticker(stock_data.get("StockTicker"), start_date='2018-05-01',end_date = '2021-12-21'))*100
    #         holding_table_data["investment_amount"] = stock_data.get("CurrentPrice")*stock_data.get("Volume")
    #         holding_table_list.append(holding_table_data)
    #     # print('Holding table data', holding_table_list)
    #     holding_details["initial_amount"] = portfolio_data.get("investment_amount")
    #     holding_details['sharpe_ratio'] = 'N/A'
    #     holding_details['cagr'] = 'N/A'
    #     holding_details['final_balance'] = 'N/A'
    #     holding_details['max_drowdown'] = 'N/A'
    #     holding_details['annual_return'] = 'N/A'
    #     holding_details['annual_volatility'] = 'N/A' 
    #     holding_details['maximum_loss'] = 'N/A'
    #     holding_details['best_month'] = 'N/A'
    #     holding_details['worst_month'] = 'N/A'
    #     holding_details['data_list'] = holding_table_list
        
    #     start_date= '2019-01-02'
    #     end_date = '2020-06-01'
    #     # print('portfolio data', portfolio_data["stock_data"])
    #     for i,stock in enumerate(portfolio_data["stock_data"]):
    #         # print(stock)
    #         # print('weights', weights)
    #         stock_weight = weights.get(stock["StockTicker"])
    #         # print('stock weight', type(stock["CurrentPrice"]),stock_weight, stock["StockTicker"])
    #         # print('volume',stock["Volume"])
    #         stock["Volume"] = int((stock_weight* float(investment_amount.get("investment_amount")))//float(stock["CurrentPrice"]))
    #         # print('volume',stock["Volume"])
    #         stock["Amount"] = stock["Volume"] * float(stock["CurrentPrice"])
    #     # print('portfolio_data2', portfolio_data)
    #     graph_details = get_list(portfolio_data,investment_amount,start_date,end_date)
    #     weight_list = list(r.json().values())
    #     stocks = list(r.json().keys())
    #     # print("weights", weights)
    #     # graph_details["weights"] = weights
    #     # print('graph', graph_details)
    #     # print('weights', weights, stocks)
    #     st_wt  = graph_details.get("stock_total")
    #     dt = graph_details.get("date")
    #     graph, weight = [],[]
    #     graph = list_to_gcharts(dt,st_wt)
    #     weight = list_to_gcharts(stocks, weight_list)
    #     # for i in range(len(dt)):
    #     #     lis =[]
    #     #     lis.append(dt[i])
    #     #     lis.append(st_wt[i])
    #     #     graph.append(lis)
    #     # for i in range(len(stocks)):
    #     #     lis = []
    #     #     lis.append(stocks[i])
    #     #     lis.append(weight_list[i])
    #     #     weight.append(lis)
            
    #     graph_data = {}
    #     efficient_frontier = EfficientFrontier()
    #     graph_data["efficient_frontier"] = efficient_frontier.get_efficient_graph(weights,stocks)
    #     graph_data["graph"] = graph
    #     graph_data["weights"] = weight
    
    #     # vol = (weightA * investment_amount)/currentprice
    #     # print('graph details', graph_details.get('weights'),len(graph_details.get('stock_total')), len(graph_details.get('date')))
    #     # print('graph', graph_details)
    #     holding_details['graph_data'] = graph_data
    #     logger.debug(f"holding details, {holding_details}")
    #     logger.info(f'Holding details updated for {portfolio_id}')

    #     return JsonResponse(holding_details)

    # def post(self,request):

    #     weights = request.data.get("weights")
    #     portfolio_id = request.data.get("portfolio_id")
    #     investment_amount = PortfolioDetails.objects.filter(pk = portfolio_id).values("investment_amount").first().get("investment_amount")
    #     stocks = PortfolioDetails.objects.filter(pk = portfolio_id).values("stock_data").first().get("stock_data")
    #     print('investment amount', investment_amount, weights, stocks)
        
    #     PortfolioDetails.objects.filter(pk=portfolio_id).update(weights = weights)
    #     # PortfolioDetails.objects.filter(pk=portfolio_id).update(weights = weights)
    #     stock_list =[]
    #     for stock in stocks:
    #         stock_data = {}
    #         print('stocks', stock)
    #         stock_data["Ticker"] = stock["StockTicker"]
    #         stock_data["Volume"] = stock["Volume"]
    #         stock_data["CurrentPrice"] = stock["CurrentPrice"]

    #         stock_list.append(stock_data)
    #         # for key,value in stock.items():
    #         #     print('ticker, weight', key,value)
    #         #     stock_data["Ticker"] = ti
    #         #     stock_data["CurrentPrice"]

    #         # stock_data['CurrentPrice'] = 
    #     return JsonResponse(stock_list, safe=False)
    
    