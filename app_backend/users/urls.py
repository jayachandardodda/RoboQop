from django.urls import path
from .views import SignupPageView
from users import views

urlpatterns = [
    path('signup/', SignupPageView.as_view(), name= 'signup')
]
