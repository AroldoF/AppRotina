from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Subtask(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    conclusion_date = models.DateTimeField(blank=True, null=True)

    # Referência genérica (para acessar como subtask.parent)
    content_type = models.ForeignKey(
        ContentType, 
        on_delete=models.CASCADE,
        limit_choices_to=models.Q(app_label='tasks', model='task') |
                         models.Q(app_label='habits', model='habit')

    )
    object_id = models.PositiveIntegerField()
    # Referência genérica (para acessar como subtask.parent)
    parent = GenericForeignKey('content_type', 'object_id')


    def __str__(self):
        return self.title

    class Meta:
        ordering = ['created_at']
