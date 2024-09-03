import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from products.models import Product
from .serializers import CartSerializer
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Cart

@api_view(['DELETE'])
def clear_cart(request):
    cart = get_object_or_404(Cart, user=request.user)
    cart.items.all().delete()
    return Response({'message': 'Cart cleared successfully'}, status=status.HTTP_204_NO_CONTENT)

# Set up logger
logger = logging.getLogger(__name__)

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('productId')
        quantity = request.data.get('quantity', 1)

        if quantity <= 0:
            return Response({'error': 'Quantity must be greater than 0'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        return Response({'message': 'Product added to cart'}, status=status.HTTP_201_CREATED)

    def delete(self, request):
        cart = Cart.objects.get(user=request.user)
        product_id = request.data.get('productId')

        try:
            product = Product.objects.get(id=product_id)
            cart_item = CartItem.objects.get(cart=cart, product=product)

            logger.debug(f"Current quantity of product {product_id}: {cart_item.quantity}")

            if cart_item.quantity > 1:
                cart_item.quantity -= 1
                cart_item.save()
                logger.debug(f"Reduced quantity of product {product_id} to {cart_item.quantity}")
                return Response({'message': 'Product quantity reduced by 1'}, status=status.HTTP_200_OK)
            else:
                cart_item.delete()
                logger.debug(f"Product {product_id} removed from cart")
                return Response({'message': 'Product removed from cart'}, status=status.HTTP_200_OK)

        except (Product.DoesNotExist, CartItem.DoesNotExist):
            logger.error(f"Product {product_id} not found in cart")
            return Response({'error': 'Product not found in cart'}, status=status.HTTP_404_NOT_FOUND)
