# Generated by Django 5.0.3 on 2024-09-01 19:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0013_rename_additional_pan_card_deliveryboy_pan_card'),
    ]

    operations = [
        migrations.AlterField(
            model_name='deliveryboy',
            name='Pan_card',
            field=models.CharField(max_length=12, null=True, unique=True),
        ),
    ]
