from django.db import models
from django.utils import timezone 
from pytz import timezone as tz

class MyModel(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)


class BetResult(models.Model):
    user = models.CharField(max_length=100)
    winning_fruit = models.CharField(max_length=100)
    amount = models.IntegerField()
    created_at = models.DateTimeField()  # No need to set default here
    fruit_image_url = models.URLField()  # Field to store the image URL of the winning fruit
    number_image_url = models.URLField()  # Add this field
    result_image_url = models.URLField()  # Add this field
    
    def save(self, *args, **kwargs):
        if not self.pk:
            # Convert current time to Kolkata timezone
            kolkata_time = timezone.now().astimezone(tz('Asia/Kolkata'))
            self.created_at = kolkata_time
        super().save(*args, **kwargs)
    
    def __str__(self) -> str:
        created_at_ist = self.created_at.astimezone(tz('Asia/Kolkata'))  
        return f"{self.winning_fruit} - {created_at_ist.strftime('%Y-%m-%d %H:%M:%S')}"



class BetHistory(models.Model):
    user = models.CharField(max_length=100)
    fruit = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    ticket = models.TextField()
    bet_time = models.DateTimeField(default=timezone.now)


    def __str__(self):
        return f"{self.user} "
    
