from rest_framework import serializers
# from apps.users.models import User  # Ensure this matches the model name in models.py
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ['id', 'username', 'email', 'password', 'date_joined']
        # exclude =  ['user_permissions', 'groups', 'is_superuser', 'is_active','first_name', 'last_name',]  # Exclude fields that should not be serialized
        read_only_fields = ['id', 'date_joined'] 
        extra_kwargs = {
            'password': {'write_only': True},
        }  

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)

    def validate(self, data):
        request = self.context.get('request')
        if request is None:
            raise serializers.ValidationError("Request está ausente do contexto.")
        
        username = data.get("username")
        password = data.get("password")
        user = authenticate(request=request, username=username, password=password)
        if not user:
                raise serializers.ValidationError("Usuário ou senha inválidos")

        login(request, user)  # Assuming 'request' is available in the context  
        data['user'] = user  # anexa o user validado
        return data

    class Meta:
        fields = ['username', 'password']

