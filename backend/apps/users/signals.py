from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserProfile
from apps.tasks.models import Task
from django.contrib.auth.models import User

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Task)
def update_user_points(sender, instance, created, **kwargs):
    if not created:  # Se não for uma nova tarefa, trata a atualização
        user = instance.user
        points = 0

        # Verifica se a tarefa foi concluída (C), falhada (F) ou pendente (P)
        if instance.difficulty == 'C':  # Tarefa concluída
            if instance.difficulty == 'B':  # Básico
                points = 4
            elif instance.difficulty == 'I':  # Intermediário
                points = 8
            elif instance.difficulty == 'A':  # Avançado
                points = 12

            # Se a tarefa falhou, perde metade dos pontos
            if instance.conclusion_date == 'F':  # Falhado
                points //= 2

        elif instance.difficulty == 'F':  # Tarefa falhada
            if instance.difficulty == 'B':
                points = 4
            elif instance.difficulty == 'I':
                points = 8
            elif instance.difficulty == 'A':
                points = 12

            # Falhou, então subtrai os pontos (pois foi falhada)
            if instance.conclusion_date == 'F':
                points //= 2
            points = -points  # Subtrair os pontos do usuário

        elif instance.difficulty == 'P':  # Tarefa pendente
            points = 0  # Nenhum ponto para tarefa pendente

        # Ajusta a pontuação do usuário
        user_profile, created = UserProfile.objects.get_or_create(user=user)
        user_profile.points += points
        user_profile.save()


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Criar um perfil de usuário automaticamente quando um User for criado."""
    if created:  # Verifica se o usuário foi criado (não atualizado)
        UserProfile.objects.create(user=instance)