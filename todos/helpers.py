from django.core import serializers
from django.http import HttpResponse
from django.utils import simplejson

def serialize(objects):
    return HttpResponse(serializers.serialize('json', objects),
                        mimetype='application/json')

def json(data):
    return HttpResponse(simplejson.dumps(data),
                        mimetype='application/json')
