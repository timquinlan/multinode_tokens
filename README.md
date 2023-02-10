# multinode_tokens

This demo requires an NGINX+ repository key and cert (the build will fail if the files are not in place). Place the .key and .crt files in ./plus-build of this repo before running docker-compose. If you are not a current NGINX+ customer, you can request a free 30-day trial at https://www.nginx.com/free-trial-request/

In addition to the key/cert you will need:

* docker, docker-compose
* authorization to build containers
* authorization to forward host ports
* port 8081 open on the host (if you need to use a different port, change docker-compose.yml line 37 before you run "docker-compose up")

Clone this repo and use docker-compose to bring up the environment:


    git clone https://github.com/timquinlan/multinode_tokens
    cp nginx-repo.crt nginx-repo.key nginxplus_api_gw/plus-build
    cd multinode_tokens
    docker-compose up
