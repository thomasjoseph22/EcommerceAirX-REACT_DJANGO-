# Generated by Django 5.0.3 on 2024-08-31 14:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0008_deliveryboy_alter_customuser_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='deliveryboy',
            name='Pan_card',
            field=models.CharField(max_length=10, null=True, unique=True),
        ),
    ]
