# 👋 Hola, soy Candela Mimbí Cáceres

**Estudiante de Desarrollo de Software**
💻 Desarrollo web · 🐍 Python · ⚛️ React · 🗄️ Bases de datos

📍 Corrientes, Argentina

💼 [LinkedIn](https://linkedin.com/in/mimbi-caceres)

---

## 👩‍💻 Sobre mí

Estudio la Tecnicatura en Desarrollo de Software. Me gusta resolver problemas con código, ver cómo algo que armé empieza a funcionar y cuidar que la interfaz sea prolija y fácil de usar.

Aprendí haciendo, en equipo, con proyectos completos que incluyen login, roles y base de datos.

## 🛠️ Stack

**Lenguajes y frameworks:** Python · Django · JavaScript · TypeScript · React
**Web:** HTML · CSS · Bootstrap · Tailwind · Vite · Node.js · Express
**Bases de datos:** SQLite · MySQL · PostgreSQL · Prisma
**Herramientas:** Git · GitHub · VS Code

## 🚀 Proyectos

| Proyecto | Descripción | Tecnologías |
|---|---|---|
| 🎓 [EduControl](https://github.com/anttobocc/ProyectoGestorCursos) | Aplicación web de gestión académica con roles de administrador y profesor. Desarrollé la mayor parte del frontend y una parte del backend. | Python · Django · SQLite · HTML · CSS · Bootstrap |
| 💻 [PlayCode](https://github.com/mimbicaceres/playcode-app) | Plataforma interactiva para aprender a programar practicando. Proyecto en equipo. | React · TypeScript · Vite · Tailwind · Node.js · Express · Prisma · PostgreSQL |

## 🎯 Qué busco

Un lugar donde aportar desde el primer día y, al mismo tiempo, seguir aprendiendo trabajando con otras personas.

## 🌐 Conectemos

💼 LinkedIn: [Mimbí Cáceres](https://linkedin.com/in/mimbi-caceres)
🐙 GitHub: [@mimbicaceres](https://github.com/mimbicaceres)

## ⚙️ Cómo correrlo en local

Sitio personal hecho con Django: página de inicio con proyectos, stack, sobre mí y contacto, más un blog. Tiene modo claro y oscuro.

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

### Qué no incluye el repositorio

La base de datos (`db.sqlite3`), las imágenes subidas (`media/`) y el archivo `.env` quedan fuera a propósito. Después de `migrate` el sitio arranca vacío: cargá tus proyectos desde el admin.
