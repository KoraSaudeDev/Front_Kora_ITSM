# Usando a imagem oficial do Node.js como base
FROM node:14-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos da aplicação para o diretório de trabalho
COPY . .

# Define a variável de ambiente do React
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Compila o projeto para produção
RUN npm run build

# Instala um servidor web estático para servir os arquivos
RUN npm install -g serve

# Expõe a porta onde o servidor irá rodar
EXPOSE 3000

# Comando para rodar o servidor web estático
CMD ["serve", "-s", "build"]
