import json

import requests
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import generics

# Create your views here.


class IndexTracking(generics.GenericAPIView):

    def post(self, request):
        """_summary_

        Args:
            request (_type_): _description_

        Returns:
            _type_: _description_
        """

        # url = "http://54.183.235.251:8000/enhanced_index_tracking_url/"
        URL = "http://65.1.13.72:8001/index_tracking/"
        backends = request.data.get("backends")
        strategy = request.data.get("strategy")
        start_date =  request.data.get("start_date")
        end_date = request.data.get("end_date")
        assets =  request.data.get("assets")
        benchmark =  request.data.get("benchmark")
        lam = request.data.get("lam")
        lb=request.data.get("lb")
        ub=request.data.get("ub")
        min_assets= request.data.get("min_assets")
        max_assets = request.data.get("max_assets")
        token=request.data.get("token")
        
        payload = json.dumps({"strategy":strategy,
                     "start_date" : start_date,
                     "end_date" : end_date,
                     "assets" : assets,
                     "benchmark" : benchmark,
                      "lam":lam,
                     "lb":lb,
                     "ub":ub,
                     "min_assets" : min_assets,
                     "max_assets" : max_assets,
                      "backends":backends,
                      "token":token
                    })
       
        r = requests.post(url = URL, data = payload)
        print("response ",r.json())
        weights = r.json()
        
        payload = json.dumps({
            "benchmark" : benchmark,
            "investment_amount" : 1000,
            "start_date": start_date,
            "end_date": end_date,
            "optimized_weights": weights,
            "strategy" : "index_tracking",
            "historical": True 
        })
        
        print("index payload",payload)
        
        URL = "http://65.1.13.72:8001/portfolio_analysis/"
        
        
        r = requests.post(url=URL, data=payload)
        
        print("portfolio analysis ",r.json())
        
        #TODO: Need to process output 

        # print(data["comparison_details"].get("Portfolio").keys())
        # dates = list(graph.index)
        # portfolio_classical = list(graph["classical"].values())
        # index = list(graph["benchmark"].values())
        # graph_data = []
        
        # for i in range(len(dates)):
        #     lis = []
        #     lis.append(dates[i])
        #     lis.append(portfolio_classical[i])
        #     lis.append(index[i])
        #     graph_data.append(lis)
        
            
        # graph, output = {},{}
        # # graph["dates"] =dates
        # # graph["portfolio"] = portfolio
        # # graph["index"] = index
        # graph["data"] = graph_data
        # output["weights"] = data["weights"]
        # output["tracking_error"] = data["tracking_error"]
        # output["graph"] = graph
        
        return JsonResponse(r.json(), safe= False)