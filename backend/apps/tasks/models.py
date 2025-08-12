from django.db import models
from django.contrib.contenttypes.fields import GenericRelation
from apps.subtasks.models import Subtask
from django.contrib.auth.models import User

class Task(models.Model):
    DIFFICULTY_CHOICES = (
        ('B', 'Básico'),
        ('I', 'Intermediário'),
        ('A', 'Avançado'),
    )
    
    STATUS_CHOICES = (
        ('P', 'Pendente'),
        ('C', 'Concluído'),
        ('F', 'Falhado'),
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    completed = models.CharField(max_length=1, choices=STATUS_CHOICES, blank=False, null=False, default='P')
    created_at = models.DateTimeField(auto_now_add=True)
    conclusion_date = models.DateTimeField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subtasks = GenericRelation(Subtask,
        content_type_field='content_type',
        object_id_field='object_id',
        related_query_name='tasks'
    )
    difficulty = models.CharField( max_length=1, choices=DIFFICULTY_CHOICES, blank=False, null=False, default='I')

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['created_at']
