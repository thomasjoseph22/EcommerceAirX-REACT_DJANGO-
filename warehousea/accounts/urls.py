from django.urls import path
from .views import AdminRegisterView, AdminLogin, AdminUserManagementView, CustomerLoginView, CustomerRegisterView, CustomerProfileView, DeliveryBoyRegisterView, DeliveryBoyLoginView, DeliveryBoyProfileView

urlpatterns = [
    path('admin/register/', AdminRegisterView.as_view(), name='admin-register'),
    path('admin/login/', AdminLogin.as_view(), name='admin-login'),
    path('customer/register/', CustomerRegisterView.as_view(), name='customer-register'),
    path('customer/login/', CustomerLoginView.as_view(), name='customer-login'),
    path('customer/profile/', CustomerProfileView.as_view(), name='customer-profile'),
    path('deliveryboy/register/', DeliveryBoyRegisterView.as_view(), name='delivery-boy-register'),
    path('deliveryboy/login/', DeliveryBoyLoginView.as_view(), name='delivery-boy-login'),
    path('deliveryboy/profile/', DeliveryBoyProfileView.as_view(), name='delivery-boy-profile'),
     path('admin/users/', AdminUserManagementView.as_view(), name='admin-user-management'),
    path('admin/users/<int:pk>/', AdminUserManagementView.as_view(), name='admin-user-update'),


]
