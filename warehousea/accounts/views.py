from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from .models import CustomUser
from .serializers import UserSerializer, AdminSerializer
from rest_framework.views import APIView
from rest_framework import status
from .serializers import AdminSerializer
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework import generics
from .serializers import CustomerRegistrationSerializer
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .serializers import CustomerRegistrationSerializer, LoginSerializer,DeliveryBoyLoginSerializer,DeliveryBoyRegistrationSerializer
from rest_framework.permissions import IsAuthenticated
import logging
# views.py
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework import status
from .models import DeliveryBoy
from .serializers import DeliveryBoyRegistrationSerializer, DeliveryBoyLoginSerializer
import logging
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import DeliveryBoyProfileSerializer
from django.contrib.auth import update_session_auth_hash
from .serializers import  DeliveryBoyProfileSerializer
from .serializers import UserSerializer
from rest_framework.permissions import IsAdminUser

from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from .models import CustomUser
from .serializers import UserSerializer

class CustomerListView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(is_staff=False, is_delivery_boy=False)
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]



class DeliveryBoyListView(generics.ListAPIView):
    serializer_class = DeliveryBoyProfileSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return DeliveryBoy.objects.filter(is_delivery=True)


class AdminUserManagementView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data
        if 'is_active' in data:
            user.is_active = data['is_active']
            user.save()
            serializer = UserSerializer(user)
            return Response(serializer.data)
        
        return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAdminUser])
@api_view(['GET'])
def admin_user_list_view(request):
    users = CustomUser.objects.all()
    user_data = [{'id': user.id, 'username': user.username, 'email': user.email} for user in users]
    return Response(user_data)




class DeliveryBoyProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = DeliveryBoyProfileSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = DeliveryBoyProfileSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            # Check if old_password and new_password are present
            old_password = request.data.get('old_password')
            new_password = request.data.get('new_password')
            
            if old_password and new_password:
                # Validate old password
                if not user.check_password(old_password):
                    return Response({'old_password': 'Incorrect password.'}, status=status.HTTP_400_BAD_REQUEST)
                
                # Set new password
                user.set_password(new_password)
                user.save()
                update_session_auth_hash(request, user)  # Keep the user logged in after password change
            
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





logger = logging.getLogger(__name__)

class DeliveryBoyRegisterView(generics.CreateAPIView):
    queryset = DeliveryBoy.objects.all()
    serializer_class = DeliveryBoyRegistrationSerializer
    permission_classes = [AllowAny]


# class DeliveryBoyLoginView(ObtainAuthToken):
#     serializer_class = DeliveryBoyLoginSerializer

#     def post(self, request, *args, **kwargs):
#         serializer = self.serializer_class(data=request.data, context={'request': request})
#         if serializer.is_valid():
#             user = serializer.validated_data['user']
#             if not user.is_active:
#                 return Response({'error': 'User is inactive'}, status=status.HTTP_403_FORBIDDEN)
#             token, created = Token.objects.get_or_create(user=user)
#             return Response({
#                 'token': token.key,
#                 'deliveryboy': True,
#             })
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class Login(ObtainAuthToken):
    # serializer_class = DeliveryBoyLoginSerializer
    serializer_class= LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            if not user.is_active:
                return Response({'error': 'User is inactive'}, status=status.HTTP_403_FORBIDDEN)
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'deliveryboy': user.is_delivery_boy,
                'admin': user.is_staff,
            })
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class CustomerProfileView(APIView):
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerRegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomerRegistrationSerializer
    permission_classes = [AllowAny]




logger = logging.getLogger(__name__)

# class CustomerLoginView(ObtainAuthToken):
#     serializer_class = LoginSerializer
    
#     def post(self, request, *args, **kwargs):
#         serializer = self.serializer_class(data=request.data, context={'request': request})
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data['user']
        
#         if not user.is_active:
#             return Response({'error': 'Your account is inactive. Please contact support.'}, status=status.HTTP_403_FORBIDDEN)
        
#         token, created = Token.objects.get_or_create(user=user)
#         return Response({
#             'token': token.key,
#             'is_customer': True,
#         })




class AdminLogin(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        if not user.is_staff:
            return Response({'error': 'User is not an admin'}, status=status.HTTP_403_FORBIDDEN)
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'is_admin': user.is_staff,
        })


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        from django.contrib.auth import authenticate
        user = authenticate(**data)
        if user is None:
            raise serializers.ValidationError('Invalid credentials')
        return {'user': user}
    



@method_decorator(csrf_exempt, name='dispatch')
class AdminRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = AdminSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserCreateView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

class AdminCreateView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = AdminSerializer

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return JsonResponse({'token': token.key})
    else:
        return JsonResponse({'error': 'Invalid credentials'}, status=400)

@api_view(['POST'])
def admin_login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None and user.is_staff:
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
    else:
        return Response({'error': 'Invalid credentials or not an admin'}, status=400)




