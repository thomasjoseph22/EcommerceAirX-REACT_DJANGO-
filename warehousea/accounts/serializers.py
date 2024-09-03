# serializers.py
from rest_framework import serializers
from .models import CustomUser, DeliveryBoy
from django.core.mail import send_mail
import random
import string
from django.contrib.auth import authenticate
import logging
from rest_framework import serializers
from .models import DeliveryBoy
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


class DeliveryBoyProfileSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)
    pan_card = serializers.CharField(max_length=12, min_length=10)

    class Meta:
        model = DeliveryBoy
        fields = ['username', 'email', 'pan_card', 'old_password', 'new_password']

    def validate_email(self, value):
        if DeliveryBoy.objects.filter(email=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    def validate_pan_card(self, value):
        if DeliveryBoy.objects.filter(pan_card=value).exclude(id=self.instance.id).exists():
            raise serializers.ValidationError("PAN card already registered.")
        return value

    def validate(self, data):
        old_password = data.get('old_password')
        new_password = data.get('new_password')

        if old_password and new_password:
            user = self.instance
            if not user.check_password(old_password):
                raise serializers.ValidationError({"old_password": "Old password is incorrect."})

            validate_password(new_password, user)

        return data

    def update(self, instance, validated_data):
        old_password = validated_data.pop('old_password', None)
        new_password = validated_data.pop('new_password', None)

        if old_password and new_password:
            instance.set_password(new_password)

        return super().update(instance, validated_data)




logger = logging.getLogger(__name__)



class UserSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    is_active = serializers.BooleanField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'pan_card', 'is_active', 'old_password', 'new_password']
        read_only_fields = ['id']

    def validate(self, attrs):
        if attrs.get('new_password') and not attrs.get('old_password'):
            raise serializers.ValidationError({"old_password": "Old password is required to set a new password."})
        return attrs

    def update(self, instance, validated_data):
        if 'old_password' in validated_data and 'new_password' in validated_data:
            old_password = validated_data.pop('old_password')
            new_password = validated_data.pop('new_password')
            if not instance.check_password(old_password):
                raise serializers.ValidationError({"old_password": "Old password is incorrect."})
            instance.set_password(new_password)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        return super().update(instance, validated_data)

    

    

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user is None:
            raise serializers.ValidationError('Invalid credentials')
        return {'user': user}

class CustomerRegistrationSerializer(serializers.ModelSerializer):
    pan_card = serializers.CharField(max_length=12, min_length=10)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'pan_card']

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    def validate_pan_card(self, value):
        if CustomUser.objects.filter(pan_card=value).exists():
            raise serializers.ValidationError("PAN card already registered.")
        return value

    def create(self, validated_data):
        # Generate a random 6-character password
        random_password = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
        logger.debug(f'Generated random password: {random_password}')

        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=random_password,
            pan_card=validated_data['pan_card']
        )

        # Attempt to send email
        try:
            send_mail(
                'Registration Confirmation',
                f'Thank you for registering. Your initial password is {random_password}. Please reset your password after logging in.',
                'thomasjoseph1243@gmail.com',
                [validated_data['email']],
                fail_silently=False,
            )
            logger.debug(f'Successfully sent email to {validated_data["email"]}')
        except Exception as e:
            logger.error(f'Error sending email: {e}')

        return user

class AdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password', 'email', 'is_staff']
        read_only_fields = ['id', 'is_staff']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email']
        )
        user.is_staff = True
        user.save()
        return user

class DeliveryBoyRegistrationSerializer(serializers.ModelSerializer):
    pan_card = serializers.CharField(max_length=12, min_length=10)

    class Meta:
        model = DeliveryBoy
        fields = ['username', 'email', 'pan_card']

    def validate_email(self, value):
        if DeliveryBoy.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    def validate_pan_card(self, value):
        if DeliveryBoy.objects.filter(pan_card=value).exists():
            raise serializers.ValidationError("PAN card already registered.")
        return value

    def create(self, validated_data):
        random_password = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
        logger.debug(f'Generated random password: {random_password}')

        user = DeliveryBoy.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=random_password,
            pan_card=validated_data['pan_card'],
           
        )

        # Attempt to send email
        try:
            send_mail(
                'Registration Confirmation',
                f'Thank you for registering as a delivery boy. Your initial password is {random_password}. Please reset your password after logging in.',
                'your-email@example.com',
                [validated_data['email']],
                fail_silently=False,
            )
            logger.debug(f'Successfully sent email to {validated_data["email"]}')
        except Exception as e:
            logger.error(f'Error sending email: {e}')

        return user

class DeliveryBoyLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user is None:
            raise serializers.ValidationError('Invalid credentials')
        return {'user': user}
