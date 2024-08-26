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

# Exponha a porta em que a aplicação irá rodar
EXPOSE 33963

# Comando para iniciar a aplicação com npm start
CMD ["npm", "start"]
