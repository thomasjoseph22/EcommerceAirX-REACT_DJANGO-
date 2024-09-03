from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Product
from .serializers import ProductCreateSerializer, ProductSerializer
from rest_framework.generics import ListAPIView
from rest_framework.generics import DestroyAPIView
from .models import Product
from rest_framework.permissions import IsAdminUser
from rest_framework.generics import UpdateAPIView
from .models import Product
from .serializers import ProductCreateSerializer,ProductUpdateSerializer
from rest_framework.generics import RetrieveAPIView


class ProductUpdateView(UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductUpdateSerializer  
    lookup_field = 'pk'


class ProductDetailView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'pk'



class ProductDeleteView(DestroyAPIView):
    queryset = Product.objects.all()
    lookup_field = 'pk'


from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

class ProductCreateView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can access
    authentication_classes = [TokenAuthentication]  # Use Token Authentication

    def post(self, request, *args, **kwargs):
        serializer = ProductCreateSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            response_serializer = ProductSerializer(product)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Print the errors for debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    authentication_classes = [TokenAuthentication]  # Ensure token authentication is used
    permission_classes = [IsAuthenticated]