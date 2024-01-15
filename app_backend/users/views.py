from http.client import HTTPResponse
from re import template
from xml.dom.domreg import registered
from django.http import HttpResponse
from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.urls import reverse_lazy
from django.views import generic
from .forms import CustomUserCreationForm
from rest_framework.views import APIView
from users.models import CustomUser
from users.serializers import UserDetailsSerializers
from rest_framework.response import Response
from rest_framework import status,generics , mixins
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.contrib.auth import authenticate
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

# Create your views here.
# def home_page_view(request):
#     return HttpResponse('Hello World!')

class SignupPageView(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'signup.html'


class UserSignup(APIView):

    permission_classes = []
    authentication_classes =[]
    def post(self, request):
        serilizer = UserDetailsSerializers(data = request.data)
        if serilizer.is_valid():
            serilizer.create(serilizer.validated_data)
            return JsonResponse(serilizer.validated_data)

class UserDetails(APIView):

    authentication_classes = [SessionAuthentication, BasicAuthentication]
    # permission_classes = [IsAuthenticated,]

    def get(self, request, format = None):
        data= CustomUser.objects.all()    
        serializer = UserDetailsSerializers(data, many=True)
        return JsonResponse(serializer.data, safe = False)

    def post(self, request, format=None):
        # request = 
        serializer = UserDetailsSerializers(data=request.data)
        if serializer.is_valid(raise_exception=True):
            instance=serializer.save()
            response_data=serializer.validated_data
            response_data['id']=instance.id

            user=CustomUser.objects.get(id = instance.id)
            print('user',user)
            token, created = Token.objects.get_or_create(user=user)
            print('token',token,created)
            # response_data['user_id']=instance.user_id
            # print('serilizer portfolio details', response_data)
            # serializer.save()
            return Response(response_data, status=status.HTTP_201_CREATED)
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)


  

class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        print('serilizer', serializer.validated_data.get('user'))
        user = serializer.validated_data.get('user')
        token, created = Token.objects.get_or_create(user=user)
        user_id = CustomUser.objects.get(username = serializer.validated_data.get('username'))
        print('user_id', user_id.id)
        print('token created', token)
        return Response({
            'token': token.key,
            'user_id' : user_id.id
        })

class UserTestView( APIView
    ):

    serializer_class = UserDetailsSerializers

    def get(self, request, *args, **kwargs):
        data = CustomUser.objects.all().first()
        # serializer = PortfolioHoldingsSerializer(data, many=True)
        # for items in data.iterator():
        
        print('user data', request.GET.get['email'],data.email)
    
    def post(self, request, *args, **kwargs):
        print('request',request.POST['email'], request.data.get('password'))
        input_email = request.data.get('email')
        input_password = request.data.get('password')
        user = authenticate(email=input_email, password =input_password)
        print('user', user)
        if user is not None:
            return JsonResponse({'response':True,'id':registered.id})
        else:
            return JsonResponse({'response':False})



        
        # # registered = CustomUser.objects.get(email=input_email)
        # registered = CustomUser.objects.get(email=input_email)
        # try:
        #     registered = CustomUser.objects.get(email=input_email)
        #     print('password',registered.password, input_password)
        #     if input_email == registered.email and input_password == registered.password:
                
        #         print('email',input_email, registered.email,registered.id)
        #         return JsonResponse({'response':True,'id':registered.id})
        #     else:
        #         return JsonResponse({'response':False})
        # except CustomUser.DoesNotExist:
        #     # raise Http404("No MyModel matches the given query.")
        #     # print('Doesnt exist')
        #     return JsonResponse({'response':False})




