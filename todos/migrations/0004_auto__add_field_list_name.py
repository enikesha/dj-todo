# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'List.name'
        db.add_column('todos_list', 'name',
                      self.gf('django.db.models.fields.CharField')(default='Default', max_length=20),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'List.name'
        db.delete_column('todos_list', 'name')


    models = {
        'todos.list': {
            'Meta': {'object_name': 'List'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'session_key': ('django.db.models.fields.CharField', [], {'max_length': '40'})
        },
        'todos.todo': {
            'Meta': {'object_name': 'ToDo'},
            'complete': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'list': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'todos'", 'to': "orm['todos.List']"}),
            'text': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        }
    }

    complete_apps = ['todos']