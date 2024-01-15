from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from rest_framework.views import APIView

from rest_framework import status, generics , mixins , permissions, authentication
from services.models import Services, ServicePrice
from services. serializers import ServicesSerializer

# Create your views here.
class ServiceList( mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    generics.GenericAPIView,
    mixins.UpdateModelMixin):

    queryset =Services.objects.all()
    serializer_class = ServicesSerializer
    lookup_field = 'pk'
    # authentication_classes = [authentication.SessionAuthentication]
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    
    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        if pk is not None:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def patch(self, request, *args, **kwargs):
        # queryset = PortfolioDetails.objects.get(id = request.data.get("portfolio_id"))
        return self.partial_update(request, *args, **kwargs)


class ServicePage(generics.GenericAPIView):

    def get(self, request):
        services_list = ServicePrice.objects.all().values()
        # serilizer = ServicesSerializer(data = services_list)
        # print('services', serilizer.initial_data)
        # return JsonResponse({"list":list(services_list)}, safe = False)
        return JsonResponse(list(services_list), safe = False)

    def post(self, request):
        # print('request data', request.data)
        portfolio_id = request.data.get("portfolio_id")
        duration = request.data.get("duration")
        # price = request.data.get("price")
        print(' portfolioid', portfolio_id,duration,request.data.get("service_id"))
        for i,id in enumerate(request.data.get("service_id")):
            print(id)
            price = ServicePrice.objects.filter(id = id).values("price").first()
            print('price', price, i,duration[i])
            Services.objects.create(portfolio_id=portfolio_id,service_id=id,duration=duration[i])
        
        # print('serializer', serilizer)
        return JsonResponse({"status":"ok"})