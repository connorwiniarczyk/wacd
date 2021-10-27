#!/bin/sh
# adds a water closet to the directory

name=$1
longitude=$2
latitude=$3
review=$4

echo $name $longitude $latitude $review

# add the location to redis using the geoadd command
redis-cli geoadd locations $longitude $latitude "$name"
redis-cli sadd reviews:"$name" "$review"
