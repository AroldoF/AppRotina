from rest_framework import serializers
from apps.tasks.models import Task 

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task  # Replace with your actual Task model
        fields = '__all__'  # Adjust fields as necessary
        read_only_fields = ['id', 'created_at']  # Fields that should not be modified by the user


        
