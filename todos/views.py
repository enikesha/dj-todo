from django.shortcuts import redirect, get_object_or_404
from django.http import QueryDict
from todos.models import ToDo
from todos.helpers import json, serialize

def items(request):
    if not request.is_ajax():
        return redirect('index')

    if request.method == 'POST':
        return serialize([ToDo.objects.create(text = request.POST['text'])])
    elif request.method == 'GET':
        return serialize(ToDo.objects.all())

def item(request, pk):
    if not request.is_ajax():
        return redirect('index')
    item = get_object_or_404(ToDo, pk=pk)
    if request.method == 'DELETE':
        item.delete()
        return json('ok')
    elif request.method == 'PUT':
        data = QueryDict(request.body, encoding=request.encoding)
        item.complete = data['complete'] == 'true'
        item.save()
        return serialize([item])
