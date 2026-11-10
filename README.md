# Portfolio de Candela Mimbí Cáceres

Sitio personal hecho con Django: página de inicio con proyectos, stack, sobre mí y contacto, más un blog. Tiene modo claro y oscuro.

## Cómo correrlo en local

Necesitás Python 3.12 o superior y Git.

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/mimbicaceres/portfolio.git
   cd portfolio
   ```

2. **Crear y activar el entorno virtual**

   ```bash
   python -m venv venv
   venv\Scripts\activate          # Windows
   source venv/bin/activate       # macOS / Linux
   ```

3. **Instalar las dependencias**

   ```bash
   pip install -r requirements.txt
   ```

4. **Crear el archivo `.env`** copiando el ejemplo y completándolo con tus datos (ver los comentarios dentro de `.env.example`):

   ```bash
   copy .env.example .env         # Windows
   cp .env.example .env           # macOS / Linux
   ```

   Para desarrollo alcanza con dejar los valores por defecto. El `.env` no se sube a Git.

5. **Crear la base de datos**

   ```bash
   python manage.py migrate
   ```

6. **Crear un usuario administrador**

   ```bash
   python manage.py createsuperuser
   ```

7. **Iniciar el servidor**

   ```bash
   python manage.py runserver
   ```

   Abrí http://127.0.0.1:8000/. Los proyectos y las publicaciones se cargan desde http://127.0.0.1:8000/admin/.

## Qué no incluye el repositorio

La base de datos (`db.sqlite3`), las imágenes subidas (`media/`) y el archivo `.env` quedan fuera a propósito. Después de `migrate` el sitio arranca vacío: cargá tus proyectos desde el admin.
