from django.urls import path
from optimisation.views import Optimise

urlpatterns = [
   path('optimise/', Optimise.as_view()),
]