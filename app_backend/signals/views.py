from django.shortcuts import render
from django.http import JsonResponse
import pandas as pd
import json
import requests
from rest_framework import generics
from signals.models import BuySellSignals
# Create your views here.


class PortfolioRebalancingView(generics.GenericAPIView):

    def post(self, request, *args, **kwargs):
        
        URL ="http://54.183.235.251/buy_and_sell_signals/"
        # end_date = request.session.get('end_date')
        portfolio_id = request.data.get('portfolio_id')
        
        universe = pd.read_csv('/code/portfolio/twelve_years.csv',index_col=0)
        for date in universe.loc["2015-01-05":"2020-01-06"].index:
            payload = json.dumps({
                "new_stock_prices" : date,
                                })

            r = requests.get(url = URL, data = payload)
            data = r.json()
            ser_data ={}
            if data[0] != []:
                # print('data',data)
                # print("data buy",data[0][1])
                # print('data sell',data[0][0])
                # print('date',data[1])
                sigs = BuySellSignals.objects.create(portfolio_id=portfolio_id,date=data[1],buy_signals=data[0][1],sell_signal=data[0][0])
                sigs.save()
            #     ser_data["date"].append(data[1])
            #     ser_data["signals"].append(data[0])
            # print('serdata',ser_data)
            # BuySellSignals.objects.filter(id = portfolio_id).update(**data)

        # print('end date', end_date)
        # r = requests.get(url = URL, data = json.dumps(payload))
        # universe = '/code/portfolio/daily_universe.csv'
        # universe = pd.read_csv('/code/portfolio/daily_universe.csv',index_col=0)
        # # print('lll', universe.loc[str(end_date):])
        # for i in range(2,250):
        #     # print('universe', universe)
        #     date = universe.loc[str(end_date):].index[i]
        #     first_day = "False"
        #     # print('date',date)
        #     if i == 2:
        #         first_day = "True"
        #     payload = json.dumps({
        #         "new_stock_prices" :date,
        #         "first_day" : first_day
        #     })

        #     r = requests.get(url = URL, data = payload)
        #     data,date =r.json()
        #     print('rebalance result', r, data, date)
        # # data,date = r.json()
        # # # print("data output", json.dumps(r))
        # # data = r.json()
        # print("data type", type(json.dumps(data)))
        return JsonResponse(data,safe=False)


    def get(self,request,*args,**kwargs):

        portfolio_id = request.query_params.get("portfolio_id")
        # date = request.data.get("date")
        date="2021-04-01"
        universe = pd.read_csv('/code/portfolio/daily_universe.csv',index_col=0)
        # universe[""].iloc[]
        data = BuySellSignals.objects.filter(portfolio_id = portfolio_id,date = date)
        # print("data", data)
        res_list =[]
        for items in data:
            # print("item", items.buy_signals)
            
            for stock,vol in items.buy_signals.items():
                res_data={}
                # print('stock vol', stock,vol)
                res_data["date"]=items.date
                res_data["stock"]=stock
                # print('kkk',universe[stock].loc[date])
                res_data["currrent_price"]=universe[stock].loc[date]
                res_data["signal"]="BUY"
                res_data["volume"]=abs(vol)
                res_data["orderprice"]=universe[stock].loc[date]
                res_list.append(res_data)
            for stock,vol in items.sell_signal.items():
                res_data={}
                # print('stock vol', stock,vol)
                res_data["date"]=items.date
                res_data["stock"]=stock
                res_data["currrent_price"]=universe[stock].loc[date]
                res_data["signal"]="SELL"
                res_data["volume"]=abs(vol)
                res_data["orderprice"]=universe[stock].loc[date]
                res_list.append(res_data)
        return JsonResponse(res_list, safe =False)
