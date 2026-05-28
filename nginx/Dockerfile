FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
# frontend/build is copied here by the pipeline before docker build
COPY build /usr/share/nginx/html
