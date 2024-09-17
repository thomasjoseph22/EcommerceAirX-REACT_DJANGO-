from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    pan_card = models.CharField(max_length=12, unique=True, null=True)
    is_delivery_boy = models.BooleanField(default=False)


    class Meta:
        permissions = [
            ("can_add_product", "Can add product"),
            ("can_edit_product", "Can edit product"),
        ]



# models.py
class DeliveryBoy(CustomUser):
    Pan_card = models.CharField(max_length=12, unique=True, null=True)
    is_delivery = models.BooleanField(default=True)

    class Meta:
        permissions = [
            ("can_deliver_product", "Can deliver product"),
        ]

