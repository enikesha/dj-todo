from django.db import models

class ToDo(models.Model):
    text = models.CharField(max_length=100)
    complete = models.BooleanField()
