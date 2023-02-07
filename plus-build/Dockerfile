FROM debian:latest

RUN apt-get update
RUN apt-get install less wget curl jq apt-transport-https lsb-release ca-certificates gnupg2 -y
RUN wget -q -O /var/tmp/nginx_signing.key https://cs.nginx.com/static/keys/nginx_signing.key
RUN apt-key add /var/tmp/nginx_signing.key
RUN wget https://cs.nginx.com/static/keys/app-protect-security-updates.key
RUN apt-key add app-protect-security-updates.key
RUN wget -q -O /etc/apt/apt.conf.d/90pkgs-nginx https://cs.nginx.com/static/files/90pkgs-nginx

RUN printf "deb https://pkgs.nginx.com/plus/debian `lsb_release -cs` nginx-plus\n" | tee /etc/apt/sources.list.d/nginx-plus.list

RUN mkdir -p /etc/ssl/nginx
COPY nginx-repo.crt /etc/ssl/nginx/
COPY nginx-repo.key /etc/ssl/nginx/
RUN chmod 644 /etc/ssl/nginx/nginx-repo.crt
RUN chmod 644 /etc/ssl/nginx/nginx-repo.key

RUN apt-get update
RUN apt-get install nginx-plus nginx-plus-module-njs nginx-sync -y

RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log
CMD ["nginx", "-g", "daemon off;"]
