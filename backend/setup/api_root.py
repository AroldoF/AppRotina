from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('users-list', request=request, format=format),
        'tasks': reverse('tasks-list', request=request, format=format),
        'subtasks': reverse('subtasks-list', request=request, format=format),
    })