from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

urlpatterns = patterns('todos.views',
    url(r'^$', 'index', name='index'),
    url(r'^lists/$', 'lists', name='lists'),
    url(r'^lists/(?P<pk>\d+)/$', 'list', name='list'),
    url(r'^item/(?P<pk>\d+)/$', 'item', name='item'),
)
