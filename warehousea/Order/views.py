# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .models import Cart, Order, OrderItem
from .serializers import OrderSerializer
from rest_framework.generics import ListAPIView
import logging
from rest_framework.permissions import IsAuthenticated

logger = logging.getLogger(__name__)

class UserOrderListView(ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    



@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_order(request, pk):
    try:
        order = Order.objects.get(pk=pk, user=request.user)

        if order.is_received:
            return Response({'error': 'Order already received'}, status=status.HTTP_400_BAD_REQUEST)

        # Update `is_delivered` only if explicitly provided
        if 'is_delivered' in request.data:
            order.is_delivered = request.data['is_delivered']

        # Update `delivery_location` only if explicitly provided
        if 'delivery_location' in request.data:
            order.delivery_location = request.data['delivery_location']

        # You may want to handle other fields here as needed
        if 'is_received' in request.data:
            order.is_received = request.data['is_received']

        order.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        logger.error(f'Order with ID {pk} not found for user {request.user.id}.')
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f'Error updating order {pk}: {str(e)}')
        return Response({'error': 'Failed to update order. Please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class OrderListView(ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    cart_id = request.data.get('cartId')
    address = request.data.get('address')
    delivery_method = request.data.get('deliveryMethod')
    email = request.data.get('email')
    user = request.user

    try:
        cart = Cart.objects.get(id=cart_id)
        logger.debug(f'Cart before order creation: {cart.items.all()}')

        # Create the order
        order = Order.objects.create(
            user=user,
            cart=cart,
            address=address,
            delivery_method=delivery_method,
            email=email
        )

        # Move items from cart to order items
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

            # Update the product quantities
            product = item.product
            if product.quantity < item.quantity:
                return Response({'error': f'Not enough quantity for product {product.name}'}, status=status.HTTP_400_BAD_REQUEST)
            product.quantity -= item.quantity
            product.save()

        # Send email
        order_details = f"Order Details:\n\nAddress: {address}\nDelivery Method: {delivery_method}\n\nItems:\n"
        for item in order.items.all():
            order_details += f"{item.product.name} - Quantity: {item.quantity} - Price: ${item.price * item.quantity:.2f}\n"
        
        email_body = f"{order_details}\n\n"

        send_mail(
            'Order Confirmation',
            email_body,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

        # Clear the cart
        cart.items.all().delete()
        logger.debug(f'Cart after order creation: {cart.items.all()}')

        return Response({'message': 'Order created successfully'}, status=status.HTTP_200_OK)
    except Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f'Error creating order: {str(e)}')
        return Response({'error': 'Failed to create order. Please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
