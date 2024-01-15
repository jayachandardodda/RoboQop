from django.db import models
from portfolio.models import PortfolioDetails
# Create your models here.


class ServicePrice(models.Model):

    service_name = models.CharField(max_length = 500)
    # user = models.ForeignKey(CustomUser, on_delete = models.CASCADE, null = False)
    price = models.DecimalField(max_digits=5, decimal_places=2,default = 0.0)
    def __str__(self) -> str:
        return self.service_name

class Services(models.Model):
    
    # service_name = models.CharField(max_length = 500)
    portfolio = models.ForeignKey(PortfolioDetails, on_delete = models.CASCADE, blank =True, null =True, related_name = 'portfolio_service')
    service = models.ForeignKey(ServicePrice, on_delete = models.CASCADE, null = True, blank =True, related_name = 'portfolio_price')
    # price = models.DecimalField(max_digits=5, decimal_places=2,default = 0.0)
    duration = models.IntegerField(blank =True, null =True)
    