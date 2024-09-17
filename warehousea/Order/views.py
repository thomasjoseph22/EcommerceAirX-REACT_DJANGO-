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
import random
from datetime import timedelta
from django.utils import timezone



logger = logging.getLogger(__name__)

class UserOrderListView(ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    



# views.py

# views.py
@api_view(['PATCH'])
def update_order(request, pk):
    try:
        order = Order.objects.get(pk=pk)

        if order.is_received:
            return Response({'error': 'Order already received'}, status=status.HTTP_400_BAD_REQUEST)

        if 'is_delivered' in request.data:
            order.is_delivered = request.data['is_delivered']
        if 'delivery_location' in request.data:
            order.delivery_location = request.data['delivery_location']
        if 'is_received' in request.data:
            order.is_received = request.data['is_received']
        if 'is_dispatched' in request.data:
            order.is_dispatched = request.data['is_dispatched']
        if order.is_dispatched:
                 order.is_in_transit = True

        
        

        order.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)

    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': 'Failed to update order. Please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





class OrderListView(ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
        




logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    cart_id = request.data.get('cartId')
    address = request.data.get('address')
    delivery_method = request.data.get('deliveryMethod')
    email = request.data.get('email')
    user = request.user

    # Debugging logs to capture incoming data
    logger.debug(f'Received order creation request with data: {request.data}')
    logger.debug(f'User: {user}, Cart ID: {cart_id}, Address: {address}, Delivery Method: {delivery_method}, Email: {email}')

    try:
        # Retrieve cart
        try:
            cart = Cart.objects.get(id=cart_id, user=user)
            logger.debug(f'Cart found for user {user}: {cart}')
        except Cart.DoesNotExist:
            logger.error(f'Cart with ID {cart_id} not found for user {user.id}')
            return Response({'error': 'Cart not found'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the order
        order = Order.objects.create(
            user=user,
            cart=cart,
            address=address,
            delivery_method=delivery_method,
            email=email,
            arrival_date=timezone.now() + timedelta(days=random.randint(0, 6)),  # Random arrival date
            is_dispatched=False,
        )
        logger.debug(f'Order created: {order}')

        # Move items from cart to order items
        for item in cart.items.all():
            product = item.product
            logger.debug(f'Processing cart item: {item}, Product: {product}')

            # Check if product has enough quantity
            if product.quantity < item.quantity:
                logger.error(f'Not enough quantity for product {product.name}. Required: {item.quantity}, Available: {product.quantity}')
                return Response({'error': f'Not enough quantity for product {product.name}'}, status=status.HTTP_400_BAD_REQUEST)

            # Create order item and update product quantity
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item.quantity,
                price=product.price
            )
            product.quantity -= item.quantity
            product.save()
            logger.debug(f'Order item created for product {product.name}, Remaining quantity: {product.quantity}')

        # Send order confirmation email
        try:
            order_details = f"Order Details:\n\nAddress: {address}\nDelivery Method: {delivery_method}\nArrival Date: {order.arrival_date.strftime('%Y-%m-%d')}\n\nItems:\n"
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
            logger.debug(f'Order confirmation email sent to {email}')
        except Exception as e:
            logger.error(f'Error sending order confirmation email: {str(e)}')
            # You can fail silently here or choose to return an error response for email failures
            # return Response({'error': 'Failed to send order confirmation email.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Clear the cart
        cart.items.all().delete()
        logger.debug(f'Cart cleared for user {user}')

        return Response({'message': 'Order created successfully'}, status=status.HTTP_200_OK)

    except Exception as e:
        # General error logging with exception details
        logger.error(f'Error creating order: {str(e)}')
        return Response({'error': 'Failed to create order. Please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)