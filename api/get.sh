#!/bin/sh

# get reviews for a given WAC

name=$1

redis-cli --raw smembers reviews:"$name"
