import logging
import traceback

from django.conf import settings
from django.contrib import messages
from django.core.mail import EmailMessage
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views.decorators.http import require_POST

from .forms import ContactForm
from .models import Project

logger = logging.getLogger(__name__)


def _sin_clave(texto):
    """Quita la contraseña del SMTP de un texto antes de escribirlo en el log."""
    clave = settings.MAILERS.get('default', {}).get('OPTIONS', {}).get('password')
    return texto.replace(clave, '***') if clave else texto


def home(request):
    projects = Project.objects.all()
    return render(request, 'home.html', {'projects': projects})


@require_POST
def contact(request):
    form = ContactForm(request.POST)
    if not form.is_valid():
        return render(
            request,
            'home.html',
            {'projects': Project.objects.all(), 'contact_form': form},
            status=400,
        )

    nombre = form.cleaned_data['nombre']
    email = form.cleaned_data['email']
    mensaje = form.cleaned_data['mensaje']

    try:
        message = EmailMessage(
            subject=f'Nuevo mensaje desde tu portfolio: {nombre}',
            body=f'Nombre: {nombre}\nEmail: {email}\n\nMensaje:\n{mensaje}\n',
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.CONTACT_EMAIL],
            reply_to=[email],
        )
        # send() devuelve la cantidad de correos enviados: solo 1 cuenta como éxito
        if message.send() != 1:
            raise RuntimeError('el servidor de correo no aceptó el mensaje')
    except Exception as exc:
        # Se registra el detalle en la terminal (sin la contraseña) y la persona ve el aviso, nunca un 500
        logger.error(
            'No se pudo enviar el mensaje de contacto (%s): %s\n%s',
            type(exc).__name__, _sin_clave(str(exc)), ''.join(traceback.format_tb(exc.__traceback__)),
        )
        messages.error(request, 'No pude enviar tu mensaje. Probá de nuevo en un rato o escribime a mimbicaceres@gmail.com.')
    else:
        messages.success(request, '¡Mensaje enviado! Te responderé pronto.')
    return redirect(reverse('home') + '#contacto')
