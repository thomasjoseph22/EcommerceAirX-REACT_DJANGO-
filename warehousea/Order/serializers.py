# serializers.py
from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['product_name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    delivery_boy = serializers.StringRelatedField()  

    class Meta:
        model = Order
        fields = ['id', 'address','email','is_in_transit','delivery_boy','delivery_method', 'items', 'delivery_location', 'created_at', 'is_received','is_delivered','is_dispatched', 'arrival_date']
