from rest_framework import serializers

from api.models import Postulacion


class PostulacionesProfesorSerializer(
    serializers.ModelSerializer
):  # Serializer para obtener los postulantes a una oferta
    class Meta:
        model = Postulacion
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["nombre_postulante"] = instance.postulante.nombre_completo
        ret["run_postulante"] = instance.postulante.run
        ret["modulo"] = instance.oferta.modulo.__str__()
        ret["riesgo_academico"] = instance.postulante.riesgo_academico
        ret.pop("oferta")
        ret["horas"] = instance.oferta.horas_ayudantia
        ret["contacto"] = {
            "correo": instance.postulante.email,
            "telefono": instance.postulante.n_contacto,
            "otro": instance.postulante.otro_contacto,
        }
        return ret


class PostulacionesCoordinadorSerializer(
    serializers.ModelSerializer
):  # Serializer para obtener las postulaciones de todos los estudiantes
    class Meta:
        model = Postulacion
        fields = "__all__"

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["nombre_postulante"] = instance.postulante.nombre_completo
        ret["run_postulante"] = instance.postulante.run
        ret["modulo"] = instance.oferta.modulo.__str__()
        ret["naprobacion"] = instance.nota_aprobacion
        ret["promedio"] = instance.postulante.Promedio
        ret["ncontacto"] = instance.postulante.n_contacto
        ret["correo"] = instance.postulante.email
        ret["banco"] = instance.postulante.banco
        ret["tipo_cuenta"] = instance.postulante.tipo_cuenta

        ret["ncuenta"] = instance.postulante.n_cuenta
        ret["horas_mensuales"] = instance.oferta.horas_ayudantia
        if instance.oferta.resolucion:
            ret["cantidad_meses"] = instance.oferta.resolucion.n_meses
            ret["resolucion"] = instance.oferta.resolucion.id
            ret["pago_mensual"] = (
                instance.oferta.resolucion.precio * instance.oferta.horas_ayudantia
            )
            ret["fecha_inicio"] = instance.oferta.resolucion.f_inicio
            ret["fecha_termino"] = instance.oferta.resolucion.f_termino
        else:
            ret["cantidad_meses"] = None
            ret["pago_mensual"] = None
            ret["fecha_inicio"] = None
            ret["fecha_termino"] = None
        ret["charla"] = instance.postulante.charla
        ret["riesgo_academico"] = instance.postulante.riesgo_academico
        ret["id_oferta"] = instance.oferta.id
        ret.pop("oferta")
        return ret


class PostulacionesEstudianteSerializer(
    serializers.ModelSerializer
):  # Serializer para obtener las postulaciones de un estudiante
    class Meta:
        model = Postulacion
        exclude = ["postulante"]

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["modulo"] = instance.oferta.modulo.__str__()
        ret.pop("oferta")
        ret["profesor"] = instance.oferta.modulo.profesor_asignado.nombre_completo
        ret["horas"] = instance.oferta.horas_ayudantia
        ret["correo_profesor"] = instance.oferta.modulo.profesor_asignado.email
        ret["año"] = instance.oferta.modulo.anio
        ret["semestre"] = instance.oferta.modulo.semestre 
        return ret
