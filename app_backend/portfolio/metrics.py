from tracemalloc import start
from unicodedata import decimal
import numpy as np
import pandas as pd
import datetime
import random
# import matplotlib.pyplot as plt
from math import ceil
import csv
from decimal import Decimal
import itertools

df_equity = pd.read_csv('/code/portfolio/twelve_years.csv',index_col=0)
# df_equity['Date'] = pd.to_datetime(df_equity['Date'])
df_equity.head()
start_date = '2021-05-01'
end_date = '2022-04-22'
# start_index = (df_equity[df_equity['Date'] == (start_date)]).index
# end_index = (df_equity[df_equity['Date'] == (end_date)]).index


def get_holding(stock_data):
    pass

def get_returns_ticker(ticker,start_date,end_date):
    '''
    ticker: ticker of which returns to be found
    start_date: start date
    end_date: end date
    If end date is None, Annual returns are calculated
    '''
    temp_df = df_equity.loc[start_date:end_date][ticker]
    ret = temp_df.pct_change().mean() * 252
    return float(ret)


def get_risk_ticker(ticker,start_date,end_date=None):
    '''
    ticker: ticker of which risk to be found
    start_date: start date  
    end_date: end date
    If end date is None, Annual returns are calculated    
    '''    
    temp_df = df_equity.loc[start_date:end_date][ticker]
    risk = temp_df.pct_change().std() * np.sqrt(252)
    return(float(risk))

# start_date = '2015-01-05'
# get_returns('MSFT',start_date)
# get_risk('MSFT',start_date)

def get_sharpe_ratio(portfolio,rf=0.02):
    '''
    portfolio: Dictionary with keys as values and date
    rf: risk free rate
    '''
    # sd = portfolio['Dates'][0]
    # ed = portfolio['Dates'][-1]
    temp_df = pd.DataFrame(portfolio,index=portfolio['Date']).drop(['Date'],axis = 1)
    ret = temp_df.pct_change().mean() * 252
    risk = temp_df.pct_change().std()* np.sqrt(252)
    return(float((ret-rf)/risk))

def get_cagr(portfolio):

    temp_df = pd.DataFrame(portfolio,index=portfolio['Date']).drop(['Date'],axis = 1)
    start_date = portfolio['Date'][0]
    end_date = portfolio['Date'][-1]
    sd = datetime.datetime(int(start_date[0:4]),int(start_date[6:7]),int(start_date[9:10]))
    ed = datetime.datetime(int(end_date[0:4]),int(end_date[6:7]),int(end_date[9:10]))
    tenure = (ed-sd).days/365
    cagr = (temp_df[-1]/temp_df[0])**(1/tenure)-1
    return float(cagr)



def get_list(stock_data, investment_amount,start_date, end_date):
    """AI is creating summary for get_list

    Args:
        stock_data ([type]): [description]
        investment_amount ([type]): [description]
        start_date ([type]): [description]
        end_date ([type]): [description]

    Returns:
        [type]: [description]
    """
    # df = pd.read_csv('/code/portfolio/DOW30_data(1).csv')
    # print('get list ticker',ticker, volume)
    # # column_sum = df[ticker].sum
    # print('coumn sum',df.ticker.tolist())
    return_data ={}
    dataset = pd.read_csv('/code/portfolio/twelve_years.csv')
    tickers = [data.get("StockTicker") for data in stock_data]
    df = dataset.loc[(dataset['Date'] >= start_date) & (dataset['Date'] <= end_date), ['Date'] + tickers]

    # Multiply the stock prices with the corresponding volume for each stock and calculate the total value of the investment
    volumes = [data.get("Volume") for data in stock_data]
    prices = round(df[tickers].mul(volumes, axis=1),2)
    total = prices.sum(axis=1)

    # Calculate the weight of each stock
    # investment_amount = round(Decimal(investment_amount),2)
    weights = [round(Decimal(data.get("Amount")) / investment_amount * 100,2) for data in stock_data]

    # Convert the data to the desired format and return it as a dictionary
    date_list = df['Date'].tolist()
    stocks = tickers
    return_data = {"stock_total": total.tolist(), "date": date_list, "stocks": stocks, "weights": weights}
    return return_data
    # # print('start end', dataset)
    # date_list,stock_list,stock_total,stocks,weights = [],[],[],[],[]
    # for data in stock_data:
        
    #     stock_list =[]
    #     new_list =[]
    #     # print('data', data)
    #     # print("stock ticker", data.get("StockTicker"))
    #     ticker = data.get("StockTicker")
    #     # print('current price',dataset.loc[start_date][ticker])
    #     # date_index = dataset[start_date].index
    #     start_index = (dataset[dataset['Date'] == (start_date)]).index
    #     end_index = (dataset[dataset['Date'] == (end_date)]).index
    #     stocks.append(ticker)
    #     # print("start end index", start_index, end_index)
    #     # print("amount investment", type(Decimal(data.get("Amount"))),type(investment_amount.get("investment_amount")))
    #     weight = ((data.get("Amount")))/float(investment_amount.get("investment_amount"))*100
    #     weights.append(weight)
    #     stock_list = dataset[ticker].iloc[int(start_index[0]):int(end_index[0])+1].to_list()
    #     # print('stock list', stock_list)
    #     # print('volume', data.get("Volume"))
    #     # stock_list = stock_list*data.get("Volume")
    #     new_list = [i * data.get("Volume") for i in stock_list]
    #     print('data',data)
    #     print("len", len(stock_list),len(new_list))
    #     # print('stocklis2', new_list)
    #     if data.get("Volume")!=0:
    #         stock_total.append(new_list)
    #         # total = list(map(sum, zip(*stock_total)))
    #     # print("dataframe",start_date, start_index, end_index)
    #     # print("query",dataset['Date'].iloc[int(start_index[0]):int(end_index[0])+1].to_list())
    #     # print("query",dataset[ticker].iloc[int(start_index[0]):int(end_index[0])+1].to_list())
    #     # print("index", dataset.index(dataset['Date']== start_date))
    #     # print("query",dataset['Date'].between(start_date,end_date).to_list())
    # # stock_list = dataset[ticker].iloc[int(start_index[0]):int(end_index[0])+1].to_list()
    
    # date_list = dataset['Date'].iloc[int(start_index[0]):int(end_index[0])+1].to_list()
    # total = list(map(sum, zip(*stock_total)))
    # print('length1', len(new_list), len(stock_total), len(total), len(date_list))
    # # print("stock total",total)
    # # print("stocktotal", len(stock_total),len(total))
    # return_data["stock_total"]=total
    # return_data["date"] = date_list
    # return_data["stocks"] = stocks
    # return_data["weights"] =weights
    # return return_data
# [sum(x) for x in zip(*my_list)]
    # add_list = []
    # with open('/code/portfolio/DOW30_data(1).csv') as f:
    #     reader = csv.DictReader(f)
    #     print('reader',reader,ticker,volume)
    #     phrases = [line[ticker] for line in reader]
    #     # print('phrases',phrases)
    # for data in phrases:
    #     print('data',float(data)*volume)
    #     add_list.append(float(data)*volume)
    # print('addlist',add_list)
    # return add_list



def merge_portfolios(list_portfolios):
    
    """
    This function merges the selected portfolios
    
    Inputs:
    list_portfolio: List of selected portfolios to be merged
    type list_portfolio: list
    
    Outputs:
    merged_portfolio: Merged portfolio
    type merged_portfolio: dict
    """
    
    
    merged_portfolio = {}
    
    #------------------------------------------------------------------------------------------------
    # merging investment amount
    merged_investment_amount = 0
    for portfolio in list_portfolios:
        merged_investment_amount += portfolio['investment_amount']
    merged_portfolio['investment_amount'] = merged_investment_amount
    
    #------------------------------------------------------------------------------------------------
    # merging tenure
    merged_tenure = 'N/A'
    merged_portfolio['tenure'] = merged_tenure
    
    #------------------------------------------------------------------------------------------------
    # merging stock data
    assets = []
    for portfolio in list_portfolios:
        for i in range(len(portfolio['stock_data'])):
            assets.append(portfolio['stock_data'][i]['StockTicker'])
    assets = list(set(assets))
    
    merged_stock_data = []
    for asset in assets:
        asset_price = 0
        asset_volume = 0
        asset_amount = 0
        for portfolio in list_portfolios:
            for i in range(len(portfolio['stock_data'])):
                if asset in portfolio['stock_data'][i]['StockTicker']:
                    asset_price = float(portfolio['stock_data'][i]['CurrentPrice'])
                    asset_volume += portfolio['stock_data'][i]['Volume']
                    asset_amount += float(portfolio['stock_data'][i]['Amount'])
                    continue
                
        temp_dict = {}
        temp_dict['StockTicker'] = asset
        temp_dict['CurrentPrice'] = asset_price
        temp_dict['Volume'] = asset_volume
        temp_dict['Amount'] = asset_amount
        merged_stock_data.append(temp_dict)
        
        
        
    merged_portfolio['stock_data'] = merged_stock_data
    return(merged_portfolio)


def get_stock_data(stock_weights,investment_amount):
    print("stock_weights",type(stock_weights))
    with open('/code/portfolio/daily_universe.csv') as f:
        reader = csv.DictReader(f)
        print('reader',reader)
    daily_universe = pd.read_csv('/code/portfolio/daily_universe.csv',index_col=0)
    print("date",daily_universe.loc["2020-04-29"]["AAL"])
        # phrases = [line[ticker] for line in reader]
    data_list =[]
    
    for stocks,weights in stock_weights.items():
        if weights > 0:
            stock_data ={}
            print('stock, weights,current price', stocks,type(Decimal(weights)),type(investment_amount),daily_universe.loc["2020-04-29"][stocks])
            stock_data["StockTicker"] = stocks
            stock_data["CurrentPrice"] = daily_universe.loc["2020-06-01"][stocks]
            volume = int((investment_amount*(Decimal(weights)))//Decimal(daily_universe.loc["2020-06-01"][stocks]))
            print('volume',volume)
            stock_data["Volume"] = volume
            stock_data["Amount"] = volume*daily_universe.loc["2020-04-29"][stocks]
            data_list.append(stock_data)
    print('stock_data', data_list)
    return data_list



def list_to_gcharts(list1,list2):
    
    
    return [[a, b] for a, b in zip(list1, list2)]
    
    # gchart =[]
    # for i in range(len(list1)):
    #     lis = []
    #     lis.append(list1[i])
    #     lis.append(list2[i])
    #     gchart.append(lis)
    # return gchart



class EfficientFrontier():
    
    
    def __init__(self) -> None:
    
        # self.assets = ['AAPL','MSFT','GOOG','AMZN','UNH','JNJ','V','XOM','WMT','NVDA','JPM','PG','MA',
        #     'CVX','HD','LLY','BAC','KO','PFE','PEP','COST','MRK','TMO','DIS','AVGO','ORCL','DHR','MCD',
        #     'CSCO','ACN','ABT','VZ','ADBE','UPS','NEE','NKE','WFC','CMCSA','CRM','TXN','MS','PM',
        #     'BMY','QCOM','COP','UNP']
        self.universe = pd.read_csv("/code/portfolio/twelve_years.csv", index_col=0)
        self.assets = list(self.universe.columns)
        # print('usi shape',self.universe.shape)
        self.mu = self.universe.pct_change().mean()*252
        self.sigma = self.universe.pct_change().cov()*252
        # self.porfolio_performance = None

        
        
    def get_portfolio_performance(self,weights,chosen_assets):
        
        print(weights)
       
        print(chosen_assets)
        
        ret = 0
        print("chosen_assets:", chosen_assets)
        print("weights", weights)
        print("len of mu", len(self.mu))
        chosen_assets = list(weights.keys())
        for s in chosen_assets:
            
            ret += Decimal(weights[s])*Decimal(self.mu[s])
            
        risk = 0
        for s1,s2 in itertools.product(chosen_assets,chosen_assets):
            risk += Decimal(weights[s1])*Decimal(weights[s2])*Decimal(self.sigma[s1][s2])
        risk = np.sqrt(risk)
        
        return float(round(risk,4))*100 ,float(round(ret,4))*100
        
        
    def rand_portfolios(self,num_portfolios,chosen_assets):
        
       
        rets =[]
        risks =[]
        l = len(chosen_assets)
        for n in range(num_portfolios):
            
            weights = np.random.uniform(0.0,1.0,size = [l,])
            norm_weights = (weights/(weights.sum())).tolist()
            
            # print('ca',chosen_assets,'rw',norm_weights)
            
            # stocks  = np.random.choice(np.arange(0,len(chosen_assets)),size = cardinality, replace = False)
            # weights = [(random.random()) if i in stocks else 0 for i,x in enumerate(np.zeros(len(chosen_assets)))]
            # print('weights',stocks,weights,chosen_assets,cardinality)
            # norm = sum(weights)
            # norm_weights = [i/norm for i in weights]
            portfolio_weights = dict(zip(chosen_assets, norm_weights))
            # print("portfolio_weights",portfolio_weights)
            
            
            # portfolio_weights = {}
            # norm = 0
            # for asset in self.universe.columns:
            #     portfolio_weights[asset] = random.uniform(0,1)
            #     norm+=portfolio_weights[asset]
                
            
            # for asset in self.universe.columns:
            #     portfolio_weights[asset] = portfolio_weights[asset]/norm
            #     if asset not in weights:
            #         portfolio_weights[asset] = 0
            # print('portfolio_weights', portfolio_weights)
            risk,ret = self.get_portfolio_performance(portfolio_weights,chosen_assets)
            rets.append(ret)
            risks.append(risk)
        graph =[]
        graph = list_to_gcharts(risks,rets)
        # for i in range(len(risks)):
        #     lis = []
        #     lis.append(rets[i])
        #     lis.append(risks[i])
        #     graph.append(lis)
        # print(graph)
        return graph
            
    def get_efficient_graph(self,weights,chosen_assets):
        
        efficient_frontier = {}
        # print('weights',weights)
        

        # actual_weights = {}
        # for s in chosen_assets:
        efficient_frontier["portfolio"] = list(self.get_portfolio_performance(weights,chosen_assets))
        efficient_frontier["other_portfolio"] = self.rand_portfolios(100,chosen_assets)
       
        
        return efficient_frontier
                    
    
# assets = ['AAPL','MSFT','GOOG','AMZN','UNH','JNJ','V','XOM','WMT','NVDA','JPM','PG','MA',
#         'CVX','HD','LLY','BAC','KO','PFE','PEP','COST','MRK','TMO','DIS','AVGO','ORCL','DHR','MCD',
#         'CSCO','ACN','ABT','VZ','ADBE','UPS','NEE','NKE','WFC','CMCSA','CRM','TXN','MS','PM',
#         'BMY','QCOM','COP','UNP']

# universe = pd.read_csv("/code/portfolio/twelve_years.csv", index_col=0)[assets]
# mu = universe.pct_change().mean()*252
# sigma = universe.pct_change().cov()*252

# def get_portfolio_performance(weights):
#     ret = 0
#     for s in assets:
#         ret += weights[s]*mu[s]
        
#     risk = 0
#     for s1,s2 in itertools.product(assets,assets):
#         risk += weights[s1]*weights[s2]*sigma[s1][s2]
#     risk = np.sqrt(risk)
    
#     return ret,risk

'''
"StockTicker": "AAPL",
            "CurrentPrice": 2,
            "Volume": 2,
            "Amount": 40
'''
