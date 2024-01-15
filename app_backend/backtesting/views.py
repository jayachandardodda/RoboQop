import pandas as pd
import requests
import simplejson as json
from django.http import JsonResponse
from helper.views import get_list, get_returns_ticker, get_risk_ticker
from portfolio.models import PortfolioDetails
from rest_framework import generics


class Backtest(generics.GenericAPIView):

    def post(self, request):
         
        ### if user sends portfolio_id then save to Db    
        portfolio_id = request.data.get("portfolio_id") 
        print(portfolio_id)

        ## asset table 
        """{
            "Ticker":{
                "portfolio1"   :value
                "portfolio2"   :value
            }
        }
        """
        asset_data  = request.data.get("asset_data")
        weights1 = {}
        weights2 = {}
        response = {}
        
        for  key , value in asset_data.items():
            # key is stock ticker 
            if value["Portfolio1"]!= None and value["Portfolio1"]!='':
                weights1[key] = value["Portfolio1"]
            
            if value["Portfolio2"]!= None and value["Portfolio2"]!='':
                weights2[key] = value["Portfolio2"]

        URL = "http://65.1.13.72:8001/portfolio_analysis/"    
    
        if len(weights1)!=0:
            payload1 = json.dumps({
                "benchmark" : request.data.get("benchmark"),
                "weights" :weights1,
                "investment_amount" : request.data.get("money"),
                "start_date" : request.data.get("start_date"),
                "end_date": request.data.get("end_date"),
                "strategy" : "backtesting",
                "optimized_weights": {"weights_classical":{},"weights_quantum": {}},
                "sip_amount":request.data.get("sip_amount"),
                "sip_frequency" : request.data.get("sip_frequency"),
                "rebalance_frequency" :request.data.get("rebalance_frequency"),
                "historical":True
            })
            print("backtest 1",payload1)
            
            try:
                r = requests.post(url=URL, data=payload1)
                if r.status_code == requests.codes.ok:
                    # weights
                    response["weights"]={}
                    response["chart"]={}
                    response["health_metrics"]={}
                    response["weights"]["portfolio1"]=weights1
        
                    chart,final_health_metrics,ef_result= r.json() 
                    
                    response["health_metrics"]["portfolio1"]= final_health_metrics
                    # print("response 1 ",response,r.json())
                    df = pd.DataFrame(chart)
                    data_dict = {}
                    for col in df.columns[0:]:
                        # Get the column header
                        key = col.strip()
                        # Get the values from the index and current column and convert them to a list of pairs
                        values = [[index, df.loc[index, col]] for index in df.index]
                        data_dict[key] = values
                    
                    response["chart"]["portfolio1"]=data_dict
                    print("response 1 ",response)
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
        
        if len(weights2)!=0:
            payload2 = json.dumps({
                "benchmark" : request.data.get("benchmark"),
                "weights" :weights2,
                "investment_amount" : request.data.get("money"),
                "start_date" : request.data.get("start_date"),
                "end_date": request.data.get("end_date"),
                "strategy" : "backtesting",
                "optimized_weights": {"weights_classical":{},"weights_quantum": {}},
                "sip_amount":request.data.get("sip_amount"),
                "sip_frequency" : request.data.get("sip_frequency"),
                "rebalancing_frequency" :request.data.get("rebalancing_frequency"),
                "historical":True
            })
            print("backtest 2",payload2)
                
            try:
                r = requests.post(url=URL, data=payload2)
                if r.status_code == requests.codes.ok:
                    # weights 
                    
                    response["weights"]["portfolio2"]= weights2
                    chart,final_health_metrics,ef_result = r.json()
                    
                    df = pd.DataFrame(chart)
                    data_dict = {}
                    for col in df.columns[0:]:
                        # Get the column header
                        key = col.strip()
                        # Get the values from the index and current column and convert them to a list of pairs
                        values = [[index, df.loc[index, col]] for index in df.index]
                        data_dict[key] = values
                    
                    response["chart"]["portfolio2"]=data_dict
                    response["health_metrics"]["portfolio2"]= final_health_metrics
                    print("r.json.............", response)
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
        
        return JsonResponse(response)



    
