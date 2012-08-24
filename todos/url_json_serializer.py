from django.core.serializers.json import Serializer as JsonSerializer

class Serializer(JsonSerializer):
    def end_object(self, obj):
        super(Serializer, self).end_object(obj)
        self.objects[-1]["url"] = obj.get_absolute_url()
