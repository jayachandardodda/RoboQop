from dataclasses import field
from email.policy import default
from unicodedata import decimal
from rest_framework import serializers
from portfolio.models import PortfolioDetails
from users.models import CustomUser


class PortfolioDetailsSerializers(serializers.ModelSerializer):
    # id=serializers.IntegerField()
    # user_id = serializers.ReadOnlyField(source='CustomUser.id')
    class Meta:
        model = PortfolioDetails
        fields = "__all__"

class ModelDetailsSerializer(serializers.ModelSerializer):

    class Meta:
        model = PortfolioDetails
        fields = "__all__"



class JSONSerializerField(serializers.Field):
    """ Serializer for JSONField -- required to make field writable"""
    def to_internal_value(self, data):
        return data
    def to_representation(self, value):
        return value


# class PortfolioHoldingsSerializer(serializers.ModelSerializer):
#     # data = JSONSerializerField()
#     annual_returns = serializers.SerializerMethodField(read_only = True)
#     annual_volume = serializers.SerializerMethodField(read_only = True)
#     holding = serializers.SerializerMethodField(read_only = True)
#     investment_amount = serializers.SerializerMethodField(read_only = True)

#     class Meta:
#         model = HoldingDetails
#         fields =( 'StockTicker','holding','investment_amount','annual_returns','annual_volume')

#         def get_investment_amount(self, obj):
#             investment_amount= PortfolioDetails.investment_amount(obj)
#             return investment_amount

# class PortfolioHoldingsSerializer(serializers.ModelSerializer):
#     # data = JSONSerializerField()
#     # annual_returns = serializers.SerializerMethodField(read_only = True)
#     # annual_volume = serializers.SerializerMethodField(read_only = True)
#     # holding = serializers.SerializerMethodField(read_only = True)
#     # investment_amount = serializers.SerializerMethodField(read_only = True)

#     class Meta:
#         model = HoldingDetails
#         fields ='__all__'

class PortfolioListSerializer(serializers.ModelSerializer):

    class Meta:
        model=PortfolioDetails
        # portfolioname=
        fields=('id','fullName','familyName','portfolioName','created_at','is_active','is_scratch','model_type','stock_data')


class ModelPortfolioListSerializer(serializers.ModelSerializer):

    class Meta:
        model = PortfolioDetails

        fields = ('id','portfolioName','description','avg_returns','avg_risk','sharpe_ratio','min_aum','price')
# class MergedPortfolioSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = MergedPortfolio
#         fields = ('investment_amount','tenure','stock_data','user')