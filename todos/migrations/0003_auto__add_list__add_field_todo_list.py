# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'List'
        db.create_table('todos_list', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('session_key', self.gf('django.db.models.fields.CharField')(max_length=40)),
        ))
        db.send_create_signal('todos', ['List'])

        # Clear existing todos
        if not db.dry_run:
            db.clear_table('todos_todo')

        # Adding field 'ToDo.list'
        db.add_column('todos_todo', 'list',
                      self.gf('django.db.models.fields.related.ForeignKey')(default=0, related_name='todos', to=orm['todos.List']),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting model 'List'
        db.delete_table('todos_list')

        # Deleting field 'ToDo.list'
        db.delete_column('todos_todo', 'list_id')


    models = {
        'todos.list': {
            'Meta': {'object_name': 'List'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
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
