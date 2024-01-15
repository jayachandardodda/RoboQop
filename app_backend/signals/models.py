from django.db import models
from portfolio.models import PortfolioDetails
# Create your models here.


class BuySellSignals(models.Model):
    portfolio = models.ForeignKey(PortfolioDetails, on_delete=models.CASCADE, null=False)
    buy_signals = models.JSONField(default = list,blank=True)
    sell_signal = models.JSONField(default = list,blank=True)
    date = models.CharField(max_length=200,blank=True)
