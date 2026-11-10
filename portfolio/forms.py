from django import forms


class ContactForm(forms.Form):
    nombre = forms.CharField(max_length=100, error_messages={'required': 'Escribí tu nombre.'})
    email = forms.EmailField(error_messages={'required': 'Escribí tu email.', 'invalid': 'El email no es válido.'})
    mensaje = forms.CharField(
        max_length=5000,
        error_messages={
            'required': 'Escribí un mensaje.',
            'max_length': 'El mensaje es muy largo (máximo 5000 caracteres).',
        },
    )

    def clean_nombre(self):
        # una sola línea: el nombre va en el asunto del correo
        return ' '.join(self.cleaned_data['nombre'].split())

    # honeypot: los usuarios no lo ven; los bots suelen completarlo.
    # Nombre sin sentido para que el autocompletado del navegador no lo llene.
    hp_campo = forms.CharField(required=False)

    def clean_hp_campo(self):
        if self.cleaned_data['hp_campo']:
            raise forms.ValidationError('Solicitud inválida.')
        return ''
