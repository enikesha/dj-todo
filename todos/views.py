from django.shortcuts import redirect, get_object_or_404, render
from django.http import QueryDict
from todos.models import ToDo, List
from todos.helpers import json, serialize

def index(request):
    request.session.modified = True
    request.session.set_expiry(31449600)
    return render(request, 'index.html')

def lists(request):
    if not request.is_ajax():
        return redirect('index')

    if request.method == 'GET':
        lists = List.objects.filter(session_key=request.session.session_key)
        if not lists:
            lists = [List.objects.create(session_key=request.session.session_key, name='Default')]
        return serialize(lists)
    elif request.method == 'POST':
        return serialize([List.objects.create(session_key=request.session.session_key, name=request.POST['name'])])

def list(request, pk):
    list = get_object_or_404(List, pk=pk, session_key=request.session.session_key)

    if request.method == 'POST':
        return serialize([list.todos.create(text = request.POST['text'])])
    elif request.method == 'GET':
        return serialize(list.todos.all())
    if request.method == 'DELETE':
        list.delete()
        return json('ok')

def item(request, pk):
    if not request.is_ajax():
        return redirect('index')
    item = get_object_or_404(ToDo, pk=pk, list__session_key=request.session.session_key)

    if request.method == 'DELETE':
        item.delete()
        return json('ok')
    elif request.method == 'PUT':
        data = QueryDict(request.body, encoding=request.encoding)
        item.complete = data['complete'] == 'true'
        item.save()
        return serialize([item])
