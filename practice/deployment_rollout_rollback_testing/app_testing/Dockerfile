FROM nginx:alpine

RUN apk add --no-cache gettext

COPY index.html /usr/share/nginx/html/index.template.html
COPY nginx.conf /etc/nginx/nginx.conf

CMD envsubst < /usr/share/nginx/html/index.template.html \
    > /usr/share/nginx/html/index.html && \
    nginx -g 'daemon off;'
EXPOSE 80