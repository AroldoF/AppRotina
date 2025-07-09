from rest_framework import serializers
from apps.subtasks.models import Subtask  # Ensure this matches the model name in models.py
from django.contrib.contenttypes.models import ContentType
from django.db.models import Q


class SubtaskSerializer(serializers.ModelSerializer):
    content_type = serializers.SlugRelatedField(
        queryset=ContentType.objects.filter(
            Q(app_label='tasks') |
            Q(app_label='habits')
        ),
        slug_field='app_label',
    )
    # recebe o ID da instância do modelo selecionado
    object_id = serializers.IntegerField()
    
    class Meta:
        model = Subtask
        fields = '__all__'
        read_only_fields = ['id', 'created_at']  # Fields that should not be modified by the user

    # agora o front envia "tasks", "goals" ou "habits"
    
    def validate(self, attrs):
        ct = attrs['content_type']            # ContentType object (app_label e model)
        model_cls = ct.model_class()          # Task, Goal ou Habit
        obj_id    = attrs['object_id']
            
        # Verifica se existe aquela instância
        if not model_cls.objects.filter(pk=obj_id).exists():
            raise serializers.ValidationError({
                'object_id': f'Não existe {ct.app_label} com id={obj_id}.'
            })
        return attrs
    
# porque quando eu passo o object_id com  serializers.IntegerField() funciona e 
# quando passo com serializers.UUIDField() não funciona?
