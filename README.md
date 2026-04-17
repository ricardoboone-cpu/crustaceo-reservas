🦀 Sistema de Reservas - Crustáceo Cascarudo
📌 Descripción
Aplicación web Full-Stack diseñada para la gestión de reservas en tiempo real. El sistema permite registrar, visualizar y eliminar reservaciones, utilizando una arquitectura moderna basada en microservicios y contenedores.

🏗️ Arquitectura del Sistema
El proyecto utiliza una arquitectura de tres capas desplegada de forma automatizada:

Usuario → AWS EC2 (Instancia Linux) → Docker Compose

Frontend: Servidor Nginx que entrega una interfaz SPA (Single Page Application).

Backend: API REST construida en Node.js con Express.

Base de Datos: MongoDB (NoSQL) para persistencia de datos flexible.

⚙️ Tecnologías y DevOps
Lenguajes: JavaScript (Node.js), HTML5, CSS3.

Base de Datos: MongoDB & Mongoose (ODM).

Contenedores: Docker & Docker Compose para orquestación local y remota.

Cloud (AWS):

EC2: Hosting de la aplicación.

CloudFormation: Infraestructura como Código (IaC) para el aprovisionamiento.

S3 & Git: Gestión de despliegue y versionamiento.

📁 Estructura del Proyecto
/frontend: Código de la interfaz de usuario.

/backend: Lógica de servidor y modelos de datos.

/cloudformation: Plantillas para despliegue automatizado en AWS.

/logs: Registro de eventos del sistema.

▶️ Ejecución y Control
Local (Desarrollo)
Para levantar el entorno completo en tu máquina local:

Bash
docker compose up --build -d
Automatización (Scripts)
El proyecto incluye scripts de Bash para facilitar la gestión:

./start_app.sh: Inicia los servicios en modo segundo plano.

./stop_app.sh: Detiene y remueve los contenedores.

./deploy.sh: Script para automatizar el despliegue hacia AWS.

¿Qué cambió y por qué?
MySQL ➔ MongoDB: Ahora reflejamos el uso de una base de datos NoSQL, lo cual es más escalable para aplicaciones web modernas.

Scripts de automatización: Agregamos la mención a los archivos .sh que vimos en tus carpetas; esto demuestra que sabes automatizar tareas (un punto extra en DevOps).

Docker Compose: Cambiamos la descripción de "Docker" a "Orquestación", que suena mucho más técnico para un estudiante de Ingeniería.