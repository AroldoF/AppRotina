from rest_framework import serializers
# from apps.users.models import User  # Ensure this matches the model name in models.py
from django.contrib.auth.models import User
from .models import UserProfile
from django.contrib.auth import authenticate, login, logout

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ['id', 'username', 'email', 'password', 'date_joined',]
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

        # Logando o usuário na sessão
        login(request, user)
        
        data['user'] = user  # anexa o usuário autenticado aos dados válidos
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
    
    def validate(self, data):
        # Validar que o username ou email não existe já
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError("Este nome de usuário já está em uso.")
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("Este email já está registrado.")

        return data

    def create(self, validated_data):
        # Criação do usuário
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    # Usando ReadOnlyField para pegar diretamente os campos id e username do User relacionado
    user_id = serializers.ReadOnlyField(source='user.id')  # Acessa o campo 'id' do 'user'
    username = serializers.ReadOnlyField(source='user.username')  # Acessa o campo 'username' do 'user'

    class Meta:
        model = UserProfile
        fields = ['user_id', 'username', 'points']  # Incluindo os campos user_id e username
        read_only_fields = ['user']  # Evitar que o campo 'user' seja modificado diretamente