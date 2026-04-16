#!/bin/bash

echo "Clonando repositorio..."
git clone https://github.com/TU_USUARIO/TU_REPO.git

cd TU_REPO

echo "Construyendo contenedores..."
docker compose build

echo "Levantando aplicación..."
docker compose up -d

echo "Deploy completo 🚀"