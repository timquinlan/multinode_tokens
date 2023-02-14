# multinode_tokens

It is not production quality, example only!!!!! For example the key generator and key verifyer are dummys.  If you put this code directly in prod, you're on your own </disclaimer>.

This demo requires an NGINX+ repository key and cert (the build will fail if the files are not in place). Place the .key and .crt files in ./plus-build of this repo before running docker-compose. If you are not a current NGINX+ customer, you can request a free 30-day trial at https://www.nginx.com/free-trial-request/

In addition to the key/cert you will need:

* docker, docker-compose
* authorization to build containers
* authorization to forward host ports

Clone this repo and use docker-compose to bring up the environment:


    git clone https://github.com/timquinlan/multinode_tokens
    cp nginx-repo.crt nginx-repo.key multinode_tokens/plus-build
    cd multinode_tokens
    docker-compose up

This is a Proof of Concept to cache tokens in a shared key-pair db between nodes.  It uses the NGINX+ key-value database (http://nginx.org/en/docs/http/ngx_http_keyval_module.html) to store the data, zone_sync (http://nginx.org/en/docs/stream/ngx_stream_zone_sync_module.html) to share the data and NGINX Javascript to access and verify the data.  

This demo spins up 5 separate containers, all five are redirecting their access and error logs to the shell where you ran docker-compoes.  This way we can see what each tier does during the flow of requests.  iThe focal point is the proxy tier config (./proxy/etc/nginx/nginx.conf) and NJS script (./proxy/etc/nginx/njs/KvOperations.js).  The demo opens 3 ports
* Mainlb opens port 80, this is the primary point in for the demo, this container will load balance to the proxy tier
* Proxy1 opens port 8080, this is so you can the NGINX API directly on Proxy1
* Proxy2 opens port 8081, this is so you can the NGINX API directly on Proxy2

Once the demo containers are up and running, use curl to send a request:

    curl -H "remote-user: user1" localhost

Notice the access log output, please keep in mind that the contianers' output may not appear in order, but each erquest will show a flow through mainlb, to the proxy tier, a conditional call to the auth tier and finally to the api tier with the cached token:

    multinode_tokens-mainlb-1  | 172.24.0.1 - - [14/Feb/2023:16:15:13 +0000] "GET / HTTP/1.1" 200 22 "-" "" "curl/7.86.0" "-" "localhost" sn="_" rt=0.011 ua="172.24.0.6:80" us="200" ut="0.011" ul="22" cs=- 794a391f0d806868b35a7e0b2c16f6ff
    multinode_tokens-proxy1-1  | 172.24.0.2 - - [14/Feb/2023:16:15:13 +0000] "GET / HTTP/1.0" 200 22 "-" "" "curl/7.86.0" "-" "app_upstreams" sn="_" rt=0.009 ua="172.24.0.3:80" us="200" ut="0.002" ul="22" cs=- c9204e054699206929311813ac6180e6
    multinode_tokens-auth1-1   | 172.24.0.6 - - [14/Feb/2023:16:15:13 +0000] "GET /auth HTTP/1.0" 200 187 "-" "" "curl/7.86.0" "-" "auth_upstreams" sn="_" rt=0.000 ua="-" us="-" ut="-" ul="-" cs=- 29d3eeb425965d74ae3d083d076c5270 userinfo=user1:curl/7.86.0
    multinode_tokens-api1-1    | 172.24.0.6 - - [14/Feb/2023:16:15:13 +0000] "GET / HTTP/1.0" 200 22 "-" "" "curl/7.86.0" "-" "api_upstreams" sn="_" rt=0.000 ua="-" us="-" ut="-" ul="-" cs=- a63ad40a1ab01ae8e5acac9c3ba42b72 token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJuZ2lueCIsInN1YiI6ImFsaWNlIiwiZm9vIjoxMjMsImJhciI6InFxIiwienl4IjpmYWxzZSwiZXhwIjoxNjc2MzkxOTEzfQ.pdzD6_J52fA2iuM5qwkSvwHB_ybEbb92cd6SEwowjec

Rerun the same request and you will see the token still forwarded to the API tier, however there is no call to the Auth tier since the token is cached:

    multinode_tokens-mainlb-1  | 172.24.0.1 - - [14/Feb/2023:16:22:18 +0000] "GET / HTTP/1.1" 200 22 "-" "" "curl/7.86.0" "-" "localhost" sn="_" rt=0.011 ua="172.24.0.6:80" us="200" ut="0.011" ul="22" cs=- f787fba5a06b9d5743fd5ba5395b08a1
    multinode_tokens-proxy1-1  | 172.24.0.2 - - [14/Feb/2023:16:22:18 +0000] "GET / HTTP/1.0" 200 22 "-" "" "curl/7.86.0" "-" "app_upstreams" sn="_" rt=0.008 ua="172.24.0.3:80" us="200" ut="0.007" ul="22" cs=- e3deb39788f17e71ae042a30754687b6
    multinode_tokens-api1-1    | 172.24.0.6 - - [14/Feb/2023:16:22:18 +0000] "GET / HTTP/1.0" 200 22 "-" "" "curl/7.86.0" "-" "api_upstreams" sn="_" rt=0.000 ua="-" us="-" ut="-" ul="-" cs=- 24f97c5477273b2ce8d6e0ab5de5b888 token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJuZ2lueCIsInN1YiI6ImFsaWNlIiwiZm9vIjoxMjMsImJhciI6InFxIiwienl4IjpmYWxzZSwiZXhwIjoxNjc2MzkyMjQ2fQ.9GxCZ4VikNjG0On4vvIzdfd0KdKXrtsAwOOZPg4n_cY

Rerun the same request a few more times until the load balance selects the 2nd proxy instance, since the keys are shared between the instances, the 2nd proxy doesn't need to call to the auth server since it has access to the cache:

    multinode_tokens-mainlb-1  | 172.24.0.1 - - [14/Feb/2023:16:24:07 +0000] "GET / HTTP/1.1" 200 22 "-" "" "curl/7.86.0" "-" "localhost" sn="_" rt=0.002 ua="172.24.0.4:80" us="200" ut="0.002" ul="22" cs=- 9dda48ef1444d258c8e9f884095967de
    multinode_tokens-proxy2-1  | 172.24.0.2 - - [14/Feb/2023:16:24:07 +0000] "GET / HTTP/1.0" 200 22 "-" "" "curl/7.86.0" "-" "app_upstreams" sn="_" rt=0.001 ua="172.24.0.3:80" us="200" ut="0.001" ul="22" cs=- a3e7d6ce87e5d037683832964b9a294f
    multinode_tokens-api1-1    | 172.24.0.4 - - [14/Feb/2023:16:24:07 +0000] "GET / HTTP/1.0" 200 22 "-" "" "curl/7.86.0" "-" "api_upstreams" sn="_" rt=0.000 ua="-" us="-" ut="-" ul="-" cs=- d8efedfa261c9e2e59cfc76c4a21c70d token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJuZ2lueCIsInN1YiI6ImFsaWNlIiwiZm9vIjoxMjMsImJhciI6InFxIiwienl4IjpmYWxzZSwiZXhwIjoxNjc2MzkyMjQ2fQ.9GxCZ4VikNjG0On4vvIzdfd0KdKXrtsAwOOZPg4n_cY

The keys are configured to timeout after 300 seconds.  Once the key times out the proxy tier will need to reach out to the auth tier to get the new token.

If you need to invalidate a key, simply use the NGINX API on one of the Proxy instances to do so:

    curl -s -X PATCH -d '{"user1:curl/7.86.0": "0"}' localhost:8080/api/8/http/keyvals/tokens/ 


The reason we PATCH the value to 0 is that nulls do not sync.

Now when we send a request:

    curl -H "remote-user: user1" localhost
    <html>
    <head><title>403 Forbidden</title></head>
    <body>
    <center><h1>403 Forbidden</h1></center>
    <hr><center>nginx/1.23.2</center>
    </body>
    </html>

This "0" key will eventually time out, but by that time you should have blocked the user at your auth tier.


