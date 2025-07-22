from django.db import models
from django.contrib.contenttypes.fields import GenericRelation
from apps.subtasks.models import Subtask
from django.contrib.auth.models import User

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    conclusion_date = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subtasks = GenericRelation(Subtask,
        content_type_field='content_type',
        object_id_field='object_id',
        related_query_name='tasks'
    )
    
    def __str__(self):
        return self.title

    class Meta:
        ordering = ['created_at']
