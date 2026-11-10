from django.db import models


class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=250)
    technologies = models.CharField(
        max_length=200, blank=True,
        help_text='Tecnologías separadas por comas. Ejemplo: Python, Django, SQLite, HTML, CSS, Bootstrap',
    )
    image = models.ImageField(upload_to='portfolio/images/')
    url = models.URLField(blank=True)

    @property
    def technology_list(self):
        return [t.strip() for t in self.technologies.split(',') if t.strip()]

    def __str__(self):
        return self.title