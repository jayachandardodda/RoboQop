
import numpy as np
import pandas as pd
import datetime
import csv
from decimal import Decimal

df_equity = pd.read_csv('/code/portfolio/twelve_years.csv',index_col=0)
# df_equity['Date'] = pd.to_datetime(df_equity['Date'])
df_equity.head()
start_date = '2021-05-01'
end_date = '2022-04-22'
# Create your views here.


#TODO: 

def get_returns_ticker(ticker,start_date,end_date):
    """ 
    Get target returns for a stock for a start and end date.
    if end_data is None, annual returns is calculated.
    Args:
        ticker (_type_) : ticker of which returns to be found
        start_date (_type_): start date
        end_date (_type_): end date

    Returns:
        float: target returns 
    """
   
    temp_df = df_equity.loc[start_date:end_date][ticker]
    ret = temp_df.pct_change().mean() * 252
    return float(ret)


def get_risk_ticker(ticker,start_date,end_date=None):
    """ 
    Get target returns for a stock for a start and end date.
    if end_data is None, annual returns is calculated.
    Args:
        ticker (_type_) : ticker of which returns to be found
        start_date (_type_): start date
        end_date (_type_): end date

    Returns:
        float: target returns 
    """
    
    temp_df = df_equity.loc[start_date:end_date][ticker]
    risk = temp_df.pct_change().std() * np.sqrt(252)
    return(float(risk))



def get_sharpe_ratio(portfolio,rf=0.02):
    """
    Get Shapre Ratio for a portfolio.

    Args:
        portfolio (dict): Portfolio dictionary with data and dates
        rf (float, optional): risk free rate. Defaults to 0.02.
    Returns:
        float : Sharpe Ratio for the stock
    """
    
    temp_df = pd.DataFrame(portfolio,index=portfolio['Date']).drop(['Date'],axis = 1)
    ret = temp_df.pct_change().mean() * 252
    risk = temp_df.pct_change().std()* np.sqrt(252)
    return(float((ret-rf)/risk))

def get_cagr(portfolio):
    """
    Get CAGR values of a portfolio.

    Args:
        portfolio (dict):  Portfolio dictionary with data and dates

    Returns:
        float : CAGR value for the stock
    """

    temp_df = pd.DataFrame(portfolio,index=portfolio['Date']).drop(['Date'],axis = 1)
    start_date = portfolio['Date'][0]
    end_date = portfolio['Date'][-1]
    sd = datetime.datetime(int(start_date[0:4]),int(start_date[6:7]),int(start_date[9:10]))
    ed = datetime.datetime(int(end_date[0:4]),int(end_date[6:7]),int(end_date[9:10]))
    tenure = (ed-sd).days/365
    cagr = (temp_df[-1]/temp_df[0])**(1/tenure)-1
    return float(cagr)



def get_list(stock_data, investment_amount,start_date, end_date):
    """
    Returns a list of stock valuation from a start and end date.

    Args:
        stock_data (list): a list of dictionary for stocks 
        investment_amount (decimal): Investment amount
        start_date (date): Start date
        end_date (date): End date

    Returns:
        dict: List of portfolio valuation and dates.
    """
    
    return_data ={}
    dataset = pd.read_csv('/code/portfolio/twelve_years.csv')

    date_list,stock_list,stock_total,stocks,weights = [],[],[],[],[]
    for data in stock_data.get("stock_data"):
        
        stock_list =[]
        new_list =[]        # print("stock ticker", data.get("StockTicker"))
        ticker = data.get("StockTicker")
        # printrent price',dataset.loc[start_date][ticker])
        # date_index = dataset[start_date].index
        start_index = (dataset[dataset['Date'] == (start_date)]).index
        end_index = (dataset[dataset['Date'] == (end_date)]).index
        stocks.append(ticker)
        # print("start end index", start_index, end_index)
        # print("amount investment", type(Decimal(data.get("Amount"))),type(investment_amount.get("investment_amount")))
        weight = ((data.get("Amount")))/float(investment_amount.get("investment_amount"))*100
        weights.append(weight)
        stock_list = dataset[ticker].iloc[int(start_index[0]):int(end_index[0])+1].to_list()
        # print('stock list', stock_list)
        # print('volume', data.get("Volume"))
        # stock_list = stock_list*data.get("Volume")
        new_list = [i * data.get("Volume") for i in stock_list]
        # print('data',data)
        # print("len", len(stock_list),len(new_list))
        # print('stocklis2', new_list)
        if data.get("Volume")!=0:
            stock_total.append(new_list)
           
    
    date_list = dataset['Date'].iloc[int(start_index[0]):int(end_index[0])+1].to_list()
    total = list(map(sum, zip(*stock_total)))
    # print('length1', len(new_list), len(stock_total), len(total), len(date_list))
    # print("stock total",total)
    # print("stocktotal", len(stock_total),len(total))
    return_data["stock_total"]=total
    return_data["date"] = date_list
    return_data["stocks"] = stocks
    return_data["weights"] =weights
    return return_data




def merge_portfolios(list_portfolios):
    """

    Args:
    Merges one or more portfolios.
        list_portfolios (list): list of portfolios to be merged
    
    Returns:
        dict: merged portfolio
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
    """
    Create stock data from weights and investment amount.

    Args:
        stock_weights (dict): stock ticker and their weights
        investment_amount (decimal): total amount invested

    Returns:
        list : list of stocks and their details. 
    """
    
    # print("stock_weights",type(stock_weights))
    # with open('/code/portfolio/daily_universe.csv') as f:
    #     reader = csv.DictReader(f)
        # print('reader',reader)
    daily_universe = pd.read_csv('/code/portfolio/daily_universe.csv',index_col=0)
    # print("date",daily_universe.loc["2020-04-29"]["AAL"])
        # phrases = [line[ticker] for line in reader]
    data_list =[]
    
    for stocks,weights in stock_weights.items():
        if weights > 0:
            stock_data ={}
            # print('stock, weights,current price', stocks,type(Decimal(weights)),type(investment_amount),daily_universe.loc["2020-04-29"][stocks])
            stock_data["StockTicker"] = stocks
            stock_data["CurrentPrice"] = daily_universe.loc["2020-06-01"][stocks]
            volume = int((investment_amount*(Decimal(weights)))//Decimal(daily_universe.loc["2020-06-01"][stocks]))
            # print('volume',volume)
            stock_data["Volume"] = volume
            stock_data["Amount"] = volume*daily_universe.loc["2020-04-29"][stocks]
            data_list.append(stock_data)
    # print('stock_data', data_list)
    return data_list




def graph(request):
    
    
    
    
    """
    graph_data = {}
        graph_details = get_list(portfolio_data,investment_amount,start_date,end_date)
        print("graph detials", graph_details.get("weights"))
        for i,stock_data in enumerate(portfolio_data.get("stock_data")):
            holding_table_data = {}
            # print('Stock data', stock_data)
            # stock_data.get("Volume") >0:
            holding_table_data["StockTicker"] = stock_data.get("StockTicker")
            holding_table_data["CurrentPrice"] = stock_data.get("CurrentPrice")
            holding_table_data["holding"] = (stock_data.get("Amount")/sum(stock_data["Amount"] for stock_data in portfolio_data.get("stock_data")))*100
            # holding_table_data["CurrentPrice"] = stock_data.get("CurrentPrice")
            holding_table_data["annual_returns"] = (get_returns_ticker(stock_data.get("StockTicker"), start_date='2018-05-01',end_date = '2021-12-21'))*100
            holding_table_data["annual_volatility"] = (get_risk_ticker(stock_data.get("StockTicker"), start_date='2018-05-01',end_date = '2021-12-21'))*100
            holding_table_data["investment_amount"] = stock_data.get("CurrentPrice")*stock_data.get("Volume")
            holding_table_list.append(holding_table_data)
        # print('Holding table data', holding_table_list)
        graph_data["weights"] = graph_details.get("weights")
        graph_data["stocks"] = graph_details.get("stocks")
        graph_data["backtest"] = r.json()
        holding_details["initial_amount"] = portfolio_data.get("investment_amount")
        holding_details['sharpe_ratio'] = 'N/A'
        holding_details['cagr'] = 'N/A'
        holding_details['final_balance'] = 'N/A'
        holding_details['max_drowdown'] = 'N/A'
        holding_details['annual_return'] = 'N/A'
        holding_details['annual_volatility'] = 'N/A' 
        holding_details['maximum_loss'] = 'N/A'
        holding_details['best_month'] = 'N/A'
        holding_details['worst_month'] = 'N/A'
        holding_details['data_list'] = holding_table_list
        holding_details['graph_data'] = graph_data
    """