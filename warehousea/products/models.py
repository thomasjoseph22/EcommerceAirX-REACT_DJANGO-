from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    images = models.ManyToManyField('Image', blank=True)  # Allowing multiple images, optional

class Image(models.Model):
    image = models.ImageField(upload_to='product_images/')
    # You may add other fields like 'title' or 'description' if needed
