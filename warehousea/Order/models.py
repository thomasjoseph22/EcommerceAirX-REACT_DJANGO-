import random
from django.conf import settings
from django.db import models
from products.models import Product
from Carts.models import Cart
from datetime import timedelta
from django.utils import timezone
from accounts.models import DeliveryBoy

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='orders', on_delete=models.CASCADE)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    address = models.TextField()
    delivery_method = models.CharField(max_length=10)
    email = models.EmailField()
    delivery_boy = models.ForeignKey(DeliveryBoy, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    delivery_location = models.TextField(blank=True, null=True)
    is_delivered = models.BooleanField(default=False)
    is_received = models.BooleanField(default=False)
    is_dispatched = models.BooleanField(default=False)
    arrival_date = models.DateTimeField(blank=True, null=True)
    is_in_transit = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
     if not self.arrival_date:
        if self.is_dispatched and not self.is_in_transit:
            self.is_in_transit = True
        # Set a random arrival date between 0 and 6 days from now
        self.arrival_date = timezone.now() + timedelta(days=random.randint(0, 6))
     super().save(*args, **kwargs)


    def __str__(self):
        return f'Order {self.id} by {self.user.username}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # Corrected reference
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} of {self.product.name}"
