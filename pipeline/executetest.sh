#!/usr/bin/env bash

podman ps -a

http_response=$(curl -v -o appresponse -w "%{http_code}" http://127.0.0.1:8085/main)

if [ "${http_response}" == "200" ]; then 
    echo " app container working!" 
else
    echo " app container not working "
    exit 1 
fi

http_response=$(curl -v -o appresponse -w "%{http_code}" http://127.0.0.1:3000/cookie)

if [ "${http_response}" == "200" ]; then 
    echo " stub container working!" 
else
    echo " stub container not working " 
fi