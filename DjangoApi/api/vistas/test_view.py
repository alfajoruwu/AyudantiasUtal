from django.http import JsonResponse


def hola_mundo(request):
    """Ruta de prueba muy simple para ver despliegue.
    GET /backend/hola/ -> {"message": "hola mundo"}
    """
    return JsonResponse({"message": "hola mundo"})
