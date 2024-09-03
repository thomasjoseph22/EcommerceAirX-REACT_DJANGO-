# carts/urls.py

from django.urls import path
from .views import CartView,clear_cart
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/add/', CartView.as_view(), name='cart-add'),  # Add this line
    path('cart/clear/', clear_cart, name='clear-cart'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)