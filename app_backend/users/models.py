from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
# Create your models here.

class CustomUser(AbstractUser):
    # uuid = models.UUIDField(default=uuid.uuid4, primary_key=True)
    pass

    