from django.urls import path
from .views import OrderListView, UserOrderListView,  create_order, update_order

urlpatterns = [
    path('create/', create_order, name='create_order'),
    path('orders/', OrderListView.as_view(), name='list_orders'),
    path('orders/<int:pk>/update/', update_order, name='update-order'),
    path('user/orders/', UserOrderListView.as_view(), name='user-orders'),



]
