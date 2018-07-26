FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html
COPY certs /etc/nginx/certs
EXPOSE 80
EXPOSE 443