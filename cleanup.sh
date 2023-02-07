#!/bin/sh
grepstring="multinode_cache"

#cleanup containers
for i in $(docker ps -a | grep $grepstring | awk '{print $1}')
  do 
    docker rm $i
  done

#cleanup images
for i in $(docker images | grep $grepstring | awk '{print $1}')
  do 
    docker rmi $i
  done
