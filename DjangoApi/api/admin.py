from django.contrib import admin
from .models import Modulo, Postulacion, Oferta, Resolucion


class OfertaAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "modulo",
        "estado",
        "ayudante",
        "resolucion",
        "fecha_creacion",
        "fecha_modificacion",
    )
    search_fields = (
        "id",
        "modulo__nombre",
        "modulo__profesor_asignado__nombre_completo",
    )
    list_filter = (
        "estado",
        "modulo__profesor_asignado__nombre_completo",
    )
    list_editable = ["estado"]


class PostulacionAdmin(admin.ModelAdmin):
    list_display = ("id", "estado", "postulante", "oferta")
    search_fields = ("id", "comentario")
    list_filter = ("estado",)
    list_editable = ["estado"]


# Register your models here.
admin.site.register(Modulo)
admin.site.register(Postulacion, PostulacionAdmin)
admin.site.register(Oferta, OfertaAdmin)
admin.site.register(Resolucion)
