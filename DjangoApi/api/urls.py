from rest_framework import routers
from api.vistas.datos_usuarios_view import (
    DatosView,
    HorasEstudianteView,
    NombresProfesorView,
    TipoUsuarioView,
)
from api.vistas.ofertas_view import OfertasView
from api.vistas.postulaciones_view import PostulacionesView
from api.vistas.correoVistas import Correos
from api.vistas.modulo_views import ModulosView
from api.vistas.resoluciones_views import ResolucionesView

router = routers.DefaultRouter()
router.register(r"Datos", DatosView, basename="Datos")
router.register(r"HorasAceptadas", HorasEstudianteView, basename="HorasEstudiante")
router.register(r"NombresProfesor", NombresProfesorView, basename="NombresProfesor")
router.register(r"TipoUsuario", TipoUsuarioView, basename="TipoUsuario")
router.register(r"correo", Correos, basename="correos")
router.register(r"Ofertas", OfertasView, basename="Ofertas")

router.register(r"Postulaciones", PostulacionesView, basename="Postulaciones")

router.register(r"Modulos", ModulosView, basename="Modulos")

router.register(r"Resoluciones", ResolucionesView, basename="Resoluciones")

urlpatterns = router.urls
