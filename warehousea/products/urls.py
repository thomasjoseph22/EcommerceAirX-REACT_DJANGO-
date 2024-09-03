# urls.py

from django.urls import path
from .views import ProductCreateView, ProductListView, ProductDeleteView, ProductUpdateView, ProductDetailView

urlpatterns = [
    path('add/', ProductCreateView.as_view(), name='product-create'),
    path('', ProductListView.as_view(), name='product-list'),
    path('<int:pk>/delete/', ProductDeleteView.as_view(), name='product-delete'),
    path('<int:pk>/edit/', ProductUpdateView.as_view(), name='product-edit'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),  # Add this line

]
