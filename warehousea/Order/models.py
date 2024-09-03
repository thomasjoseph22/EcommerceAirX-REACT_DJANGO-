# Order/models.py
from django.conf import settings
from django.db import models
from products.models import Product
from Carts.models import Cart  # Correct import

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)   
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    address = models.TextField()
    delivery_method = models.CharField(max_length=10)
    email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)
    delivery_location = models.TextField(blank=True, null=True)
    is_delivered = models.BooleanField(default=False)
    is_received = models.BooleanField(default=False)

    def __str__(self):
        return f'Order {self.id} by {self.user.username}'

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # Corrected reference
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} of {self.product.name}"
