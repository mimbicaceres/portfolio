from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import RedirectView
from portfolio import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('contacto/enviar/', views.contact, name='contact'),
    # Blog desactivado por ahora: /blog/ y todo lo que cuelga de ahí vuelve a la home.
    # Para reactivarlo: borrar la línea siguiente y descomentar la del include.
    re_path(r'^blog(?:/.*)?$', RedirectView.as_view(url='/', permanent=False)),
    # path('blog/', include('blog.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)