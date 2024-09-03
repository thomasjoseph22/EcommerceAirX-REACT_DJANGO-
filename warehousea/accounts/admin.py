from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('username', 'email', 'is_staff', 'is_active')
    search_fields = ('username', 'email')
    readonly_fields = ('date_joined', 'last_login')

admin.site.register(CustomUser, CustomUserAdmin)
