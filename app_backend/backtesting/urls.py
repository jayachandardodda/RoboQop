from django.urls import path
from backtesting.views import Backtest

urlpatterns = [
   path('backtest/', Backtest.as_view())
]