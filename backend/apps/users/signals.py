from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserProfile
from apps.tasks.models import Task
from django.contrib.auth.models import User

from django.db.models.signals import post_save
from django.dispatch import receiver

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserProfile
from apps.tasks.models import Task
from django.contrib.auth.models import User

@receiver(post_save, sender=Task)
def update_user_points(sender, instance, created, **kwargs):
    if created:
        return  # Ignora criação, apenas atualizações contam

    user = instance.user
    points = 0

    if instance.completed == 'C':  # Concluída
        if instance.difficulty == 'B':
            points = 4
        elif instance.difficulty == 'I':
            points = 8
        elif instance.difficulty == 'A':
            points = 12

    # elif instance.completed == 'F':  # Falhada
    #     if instance.difficulty == 'B':
    #         points = -2
    #     elif instance.difficulty == 'I':
    #         points = -4
    #     elif instance.difficulty == 'A':
    #         points = -6

    elif instance.completed == 'P':  # Pendente
        points = 0

    user_profile, _ = UserProfile.objects.get_or_create(user=user)
    user_profile.points += points
    user_profile.save()



@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Criar um perfil de usuário automaticamente quando um User for criado."""
    if created:  # Verifica se o usuário foi criado (não atualizado)
        UserProfile.objects.create(user=instance)