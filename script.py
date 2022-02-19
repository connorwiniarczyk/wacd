#!/usr/bin/python3

import redis
import csv

r = redis.Redis(host='localhost', port=6379, charset="utf-8", decode_responses=True)

locations = r.georadius('locations', 0, 0, 22000, "km", "WITHDIST", "WITHCOORD")
locations = [ [name, lat, lon ] for [name, _distance, (lon, lat)] in locations]

print(locations)

with open("locations.csv", "w") as csvfile:
    csvwriter = csv.writer(csvfile)

    csvwriter.writerow(["name", "latitude", "longitude"])
    csvwriter.writerows(locations)
