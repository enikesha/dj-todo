from django.db import models

class List(models.Model):
    session_key = models.CharField(max_length=40)

class ToDo(models.Model):
    list = models.ForeignKey(List, related_name='todos')
    text = models.CharField(max_length=100)
    complete = models.BooleanField()
