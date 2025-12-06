# Build stage
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install --save-dev @types/node@18.11.9
COPY . .
RUN npm run build -- --configuration production

# Run stage
FROM nginx:alpine
COPY --from=build /app/dist/angular-mean-crud-tutorial /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
