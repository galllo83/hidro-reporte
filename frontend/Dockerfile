# --- Build Stage ---
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Pass build arguments to Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the Vite application
RUN npm run build

# --- Production Serving Stage ---
FROM nginx:alpine

# Copy the built assets to Nginx's HTML folder
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Overwrite default nginx config to support React Router SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
