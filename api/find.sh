#!/bin/sh

# find the nearest water closets for a given point on the earth

longitude=$1
latitude=$2

redis-cli --raw geosearch locations fromlonlat $longitude $latitude byradius 10 km withdist asc 
