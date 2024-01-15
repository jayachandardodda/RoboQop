from email.policy import default
from pickle import TRUE
from tkinter import CASCADE
import uuid
from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from users.models import CustomUser


class PortfolioDetails(models.Model):
    user=models.ForeignKey(CustomUser, on_delete=models.CASCADE,null =False)
    fullName = models.CharField(max_length=40,null=True, blank=True)
    familyName = models.CharField(max_length=40,null=True,blank=True)
    portfolioName = models.CharField(max_length=40,null=True,blank=True)
    emailId = models.CharField(max_length=40,null=True,blank=True)
    city = models.CharField(max_length=40,null=True,blank=True)
    state = models.CharField(max_length=40,null=True,blank=True)
    pincode = models.IntegerField(null=True,blank=True)
    address = models.CharField(max_length=200,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True,blank=True)
    investment_amount=models.DecimalField(max_digits=15, decimal_places=2, default = 0.0)
    tenure=models.IntegerField(default = 0)
    stock_data = models.JSONField(default = list,blank=True)
    is_merged = models.BooleanField(default= False)
    description = models.CharField(max_length=1000, default="Portfolio")
    avg_returns = models.DecimalField(max_digits=5, decimal_places=2,default = 0.0)
    avg_risk = models.DecimalField(max_digits=5, decimal_places=2,default = 0.0)
    sharpe_ratio = models.DecimalField(max_digits=5, decimal_places=2,default = 0.0)
    min_aum = models.DecimalField(max_digits=15, decimal_places=2,default = 0.0)
    price = models.DecimalField(max_digits=5, decimal_places=2,default = 0.0)
    is_model = models.BooleanField(default= False)
    is_scratch = models.BooleanField(default = True)
    #weights = models.JSONField(default =list, blank =True)
    stable_weights = models.JSONField(default =list, blank =True)
    risky_weights = models.JSONField(default =list, blank =True)
    model_type = models.CharField(max_length=40,null=True,blank=True)





    
