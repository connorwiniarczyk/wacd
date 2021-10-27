#!/bin/sh

latitude=0
longitude=0

redis-cli geosearch locations fromlonlat $longitude $latitude byradius 22000 km withcoord 
