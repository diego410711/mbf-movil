# Usa una imagen oficial de Node LTS
FROM node:18

# Instala dependencias necesarias (como Ionic y Angular CLI)
RUN npm install -g @ionic/cli @angular/cli

# Crea una carpeta de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY . .

# Instala dependencias del proyecto
RUN npm install

# Expone el puerto por defecto de Ionic
EXPOSE 8100

# Comando por defecto
CMD ["ionic", "serve", "--host=0.0.0.0"]
