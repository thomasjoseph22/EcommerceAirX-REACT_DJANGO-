from django.db import migrations, models
from django.db.models import F

def set_unique_pan_card(apps, schema_editor):
    CustomUser = apps.get_model('accounts', 'CustomUser')
    for user in CustomUser.objects.filter(pan_card__isnull=True):
        user.pan_card = f"PAN{user.pk:06d}"  # Generate a unique placeholder value
        user.save()

class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='pan_card',
            field=models.CharField(max_length=12, unique=True, null=True),
        ),
        migrations.RunPython(set_unique_pan_card),  # Run data migration
        migrations.AlterField(
            model_name='customuser',
            name='pan_card',
            field=models.CharField(max_length=12, unique=True, null=False),
        ),
    ]
