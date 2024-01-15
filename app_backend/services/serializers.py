from rest_framework import serializers
from services. models import Services

class ServicesSerializer(serializers.ModelSerializer):

    class Meta:
        models = Services
        fields = "__all__"