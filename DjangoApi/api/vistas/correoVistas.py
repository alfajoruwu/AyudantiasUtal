# vistas/correoVistas.py

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import Group
from ..utils import enviar_correo  # Importa la función desde utils.py
from ..models import Postulacion, Oferta, Modulo
from usuarios.models import User

class Correos(viewsets.GenericViewSet):
    permission_classes = []

    @action(detail=False, methods=['get'])
    def enviar(self, request, *args, **kwargs):
        destinatario = 'matias.camilla.dog@gmail.com'
        asunto = 'Verificacion de correo'
        mensaje = 'Este es un mensaje de prueba.'

        try:
            enviar_correo(destinatario, asunto, mensaje)
            return Response({"message": "Correo enviado"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'])
    def notificar_seleccion(self, request, *args, **kwargs):
        """
        Envía correos de notificación cuando se selecciona un ayudante.
        Envía correo de confirmación al seleccionado y de no selección a los demás.
        """
        try:
            oferta_id = request.data.get('oferta_id')
            postulante_seleccionado_id = request.data.get('postulante_id')
            
            if not oferta_id or not postulante_seleccionado_id:
                return Response(
                    {"error": "Se requieren oferta_id y postulante_id"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Obtener la oferta
            oferta = Oferta.objects.get(id=oferta_id)
            
            # Obtener todas las postulaciones para esta oferta
            postulaciones = Postulacion.objects.filter(oferta=oferta)
            
            # Información del módulo y profesor
            modulo_info = str(oferta.modulo)
            profesor_nombre = oferta.modulo.profesor_asignado.nombre_completo
            
            correos_enviados = 0
            
            for postulacion in postulaciones:
                estudiante = postulacion.postulante
                
                if postulacion.id == int(postulante_seleccionado_id):
                    # Correo de confirmación para el seleccionado
                    asunto = f"¡Felicitaciones! Has sido seleccionado como ayudante - {modulo_info}"
                    mensaje = f"""
Estimado/a {estudiante.nombre_completo},

¡Excelentes noticias! Has sido seleccionado/a como ayudante para el módulo {modulo_info}.

Detalles de la ayudantía:
- Módulo: {modulo_info}
- Profesor: {profesor_nombre}
- Horas semanales: {oferta.horas_ayudantia} horas

El profesor {profesor_nombre} se pondrá en contacto contigo pronto para coordinar los detalles y el inicio de tus funciones como ayudante.

¡Felicitaciones por esta oportunidad y éxito en tu nueva responsabilidad!

Saludos cordiales,
Sistema de Ayudantías UTAL

---
Este es un mensaje automático, por favor no responder a este correo.
"""
                else:
                    # Correo para los no seleccionados
                    asunto = f"Resultado de postulación - {modulo_info}"
                    mensaje = f"""
Estimado/a {estudiante.nombre_completo},

Gracias por tu interés en postular como ayudante para el módulo {modulo_info}.

Lamentablemente, en esta ocasión no has sido seleccionado/a para esta posición. El proceso de selección fue muy competitivo y hubo muchos candidatos calificados.

Te animamos a seguir postulando a futuras oportunidades de ayudantías. Tu interés y dedicación son valorados.

¡No te desanimes y sigue esforzándote!

Saludos cordiales,
Sistema de Ayudantías UTAL

---
Este es un mensaje automático, por favor no responder a este correo.
"""
                
                # Enviar el correo
                enviar_correo(estudiante.email, asunto, mensaje)
                correos_enviados += 1
            
            return Response({
                "message": f"Notificaciones enviadas exitosamente a {correos_enviados} postulantes",
                "correos_enviados": correos_enviados
            }, status=status.HTTP_200_OK)
            
        except Oferta.DoesNotExist:
            return Response(
                {"error": "Oferta no encontrada"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Error al enviar notificaciones: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def solicitud_horas(self, request, *args, **kwargs):
        """
        Envía correo de notificación cuando un profesor solicita más horas para un módulo.
        """
        try:
            modulo_id = request.data.get('modulo_id')
            solicitud_horas = request.data.get('solicitud_horas')
            
            if not modulo_id or not solicitud_horas:
                return Response(
                    {"error": "Se requieren modulo_id y solicitud_horas"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Obtener el módulo y actualizar la solicitud
            modulo = Modulo.objects.get(id=modulo_id)
            modulo.solicitud_horas = solicitud_horas
            modulo.save()
            
            # Información del módulo y profesor
            profesor = modulo.profesor_asignado
            modulo_info = str(modulo)
            
            # Obtener todos los coordinadores dinámicamente
            coordinadores = User.objects.filter(groups__name="Coordinador")
            
            if not coordinadores.exists():
                return Response(
                    {"error": "No se encontraron coordinadores en el sistema"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            asunto = f"Solicitud de Horas Adicionales - {modulo_info}"
            mensaje = f"""
Estimado/a Coordinador/a,

El profesor {profesor.nombre_completo} ha realizado una solicitud de horas adicionales para el siguiente módulo:

DETALLES DEL MÓDULO:
- Módulo: {modulo_info}
- Profesor: {profesor.nombre_completo}
- Email del profesor: {profesor.email}
- Horas actuales asignadas: {modulo.horas_asignadas} horas

SOLICITUD:
{solicitud_horas}

Por favor, revise esta solicitud a la brevedad posible.

Para contactar al profesor directamente: {profesor.email}

Saludos cordiales,
Sistema de Ayudantías UTAL

---
Este es un mensaje automático, por favor no responder a este correo.
"""
            
            # Enviar correo a todos los coordinadores
            correos_enviados = 0
            for coordinador in coordinadores:
                try:
                    enviar_correo(coordinador.email, asunto, mensaje)
                    correos_enviados += 1
                except Exception as e:
                    print(f"Error enviando correo a {coordinador.email}: {str(e)}")
            
            # También enviar confirmación al profesor
            asunto_profesor = f"Confirmación de Solicitud de Horas - {modulo_info}"
            mensaje_profesor = f"""
Estimado/a {profesor.nombre_completo},

Su solicitud de horas adicionales ha sido enviada exitosamente al coordinador.

DETALLES DE SU SOLICITUD:
- Módulo: {modulo_info}
- Fecha de solicitud: {modulo.fecha_modificacion if hasattr(modulo, 'fecha_modificacion') else 'Hoy'}
- Solicitud: {solicitud_horas}

El coordinador revisará su solicitud y se pondrá en contacto con usted a la brevedad.

Saludos cordiales,
Sistema de Ayudantías UTAL

---
Este es un mensaje automático, por favor no responder a este correo.
"""
            
            try:
                enviar_correo(profesor.email, asunto_profesor, mensaje_profesor)
                correos_enviados += 1
            except Exception as e:
                print(f"Error enviando correo de confirmación al profesor: {str(e)}")
            
            return Response({
                "message": "Solicitud de horas enviada y correos de notificación enviados exitosamente",
                "correos_enviados": correos_enviados,
                "coordinadores_notificados": coordinadores.count()
            }, status=status.HTTP_200_OK)
            
        except Modulo.DoesNotExist:
            return Response(
                {"error": "Módulo no encontrado"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Error al procesar solicitud de horas: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def observaciones_oferta(self, request, *args, **kwargs):
        """
        Envía correo de notificación cuando un coordinador envía observaciones a un profesor sobre una oferta.
        """
        try:
            oferta_id = request.data.get('oferta_id')
            observaciones = request.data.get('observaciones')
            
            if not oferta_id or not observaciones:
                return Response(
                    {"error": "Se requieren oferta_id y observaciones"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Obtener la oferta y actualizar las observaciones
            oferta = Oferta.objects.get(id=oferta_id)
            oferta.observaciones = observaciones
            oferta.save()
            
            # Información de la oferta y profesor
            profesor = oferta.modulo.profesor_asignado
            modulo_info = str(oferta.modulo)
            
            # Mensaje para el profesor (destinatario principal)
            asunto_profesor = f"Observaciones del Coordinador - {modulo_info}"
            mensaje_profesor = f"""
Estimado/a {profesor.nombre_completo},

El coordinador ha revisado su oferta de ayudantía y tiene las siguientes observaciones que requieren su atención:

DETALLES DE LA OFERTA:
- Módulo: {modulo_info}
- Horas de ayudantía: {oferta.horas_ayudantia} horas
- Estado: Pendiente (requiere correcciones)

OBSERVACIONES DEL COORDINADOR:
{observaciones}

Por favor, revise estos comentarios y realice las correcciones necesarias en su oferta de ayudantía. Una vez realizados los cambios, puede volver a enviar la oferta para su aprobación.

Para cualquier consulta, puede contactar al coordinador a través del sistema.

Saludos cordiales,
Sistema de Ayudantías UTAL

---
Este es un mensaje automático, por favor no responder a este correo.
"""
            
            # Enviar correo al profesor
            correos_enviados = 0
            try:
                enviar_correo(profesor.email, asunto_profesor, mensaje_profesor)
                correos_enviados += 1
            except Exception as e:
                print(f"Error enviando correo al profesor {profesor.email}: {str(e)}")
            
            # Obtener el coordinador que hizo la observación (usuario actual)
            coordinador_actual = request.user
            
            # Enviar copia de confirmación al coordinador que envió las observaciones
            asunto_coordinador = f"Confirmación de Observaciones Enviadas - {modulo_info}"
            mensaje_coordinador = f"""
Estimado/a {coordinador_actual.nombre_completo},

Sus observaciones han sido enviadas exitosamente al profesor {profesor.nombre_completo}.

DETALLES:
- Módulo: {modulo_info}
- Profesor notificado: {profesor.nombre_completo} ({profesor.email})
- Fecha de envío: Hoy

OBSERVACIONES ENVIADAS:
{observaciones}

El profesor ha sido notificado y deberá realizar las correcciones solicitadas antes de que la oferta pueda ser publicada.

Saludos cordiales,
Sistema de Ayudantías UTAL

---
Este es un mensaje automático, por favor no responder a este correo.
"""
            
            try:
                enviar_correo(coordinador_actual.email, asunto_coordinador, mensaje_coordinador)
                correos_enviados += 1
            except Exception as e:
                print(f"Error enviando correo de confirmación al coordinador: {str(e)}")
            
            return Response({
                "message": "Observaciones enviadas exitosamente al profesor",
                "correos_enviados": correos_enviados,
                "profesor_notificado": profesor.nombre_completo
            }, status=status.HTTP_200_OK)
            
        except Oferta.DoesNotExist:
            return Response(
                {"error": "Oferta no encontrada"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Error al procesar observaciones: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
