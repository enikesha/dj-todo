from django.db import models

class List(models.Model):
    session_key = models.CharField(max_length=40)
    name = models.CharField(max_length=20)

    @models.permalink
    def get_absolute_url(self):
        return ('list', (), {'pk': str(self.pk)})

class ToDo(models.Model):
    list = models.ForeignKey(List, related_name='todos')
    text = models.CharField(max_length=100)
    complete = models.BooleanField()

    @models.permalink
    def get_absolute_url(self):
        return ('item', (), {'pk': str(self.pk)})

