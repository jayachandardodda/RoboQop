"""roboqop URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from portfolio.views import PorfolioMixinView, HoldingDetailsView, MergePortfolioView, ModelPortfolioView, ListPortfolioMixinView,GraphView,ModelPortfolioList,UpdatePortfolioView,ModelPorfolioDetails,DeactivateView,CompareIndex
from services.views import ServicePage
from users.views import UserDetails, UserTestView, CustomAuthToken
from index.views import IndexTracking
from signals.views import PortfolioRebalancingView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth_token/', CustomAuthToken.as_view()),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include('optimisation.urls')),
    path('', include('backtesting.urls')),
    path('update_portfolio/', UpdatePortfolioView.as_view()),
    path('deactivate/', DeactivateView.as_view()),
    path('model_portfolio_details/',ModelPorfolioDetails.as_view() ),
    path('portfolio_details/',PorfolioMixinView.as_view()),
    path('portfolio_details/<int:pk>',PorfolioMixinView.as_view()),
    path('holding_detail/<int:pk>',HoldingDetailsView.as_view()),
    path('model_portfolio/', ModelPortfolioView.as_view()),
    path('rebalance_portfolio/', PortfolioRebalancingView.as_view()),
    path('model_portfolio_list/', ModelPortfolioList.as_view()),
    path('service_list/',ServicePage.as_view()),
    path('portfolio_list/',ListPortfolioMixinView.as_view()),
    path('user_details/',UserDetails.as_view()),
    path('user_test/',UserTestView.as_view()),
    path('merge_portfolio/',MergePortfolioView.as_view()),
    path('graph_datails/', GraphView.as_view()),
    path('track_index/', IndexTracking.as_view()),
    path('compare_index/', CompareIndex.as_view()),
 ]
 