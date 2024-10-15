from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Postulacion, Estudiante, Profesor, Modulo, Postulacion, Usuario

# Create your tests here.


class ofertaViewTest(TestCase):
    def test_oferta_list_view(self):
        response = self.client.get(reverse("lista-ofertas"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "[]")
        self.assertQuerysetEqual(response.context["object_list"], [])
