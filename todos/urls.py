from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView

urlpatterns = patterns('todos.views',
    url(r'^$', TemplateView.as_view(template_name='index.html'), name='index'),
    url(r'^items/$', 'items', name='items'),
    url(r'^items/(?P<pk>\d+)/$', 'item', name='item'),
)
