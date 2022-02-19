#!/usr/bin/python3

import redis
import csv
import sys

# open a connection to the redis database
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

#helper functions
def geo_members(key):
    return r.geosearch(key, longitude = "0", latitude = "0", radius = "22000", unit = "km", withcoord = True)

command_table = {}

# decorator for subcommands
def command(name):
    def inner(function):
        command_table[name] = function
        return function
    return inner


@command("save locations")
def save_locations():
    locations = [[name, lat, long] for [name, (long, lat)] in geo_members("locations")]
    writer = csv.writer(sys.stdout)
    writer.writerow(["name", "latitude", "longitude"])
    writer.writerows(locations)

@command("save reviews")
def save_reviews():
    # helper function to remove the prefix "reviews:" from each review key
    clean = lambda key: key[8:]

    output = []
    for wc in r.keys("reviews:*"):
        output.extend([[clean(wc), review] for review in r.smembers(wc)])

    writer = csv.writer(sys.stdout)
    writer.writerow(["name", "review"])
    writer.writerows(output)

@command("load locations")
def load_locations():
    reader = csv.reader(sys.stdin)
    title = reader.__next__() # Strip the title row
    for name, latitude, longitude in reader:
        r.geoadd("locations", (longitude, latitude, name))

@command("load reviews")
def load_reviews():
    reader = csv.reader(sys.stdin)
    title = reader.__next__() # Strip the title row
    for name, review in reader:
        r.sadd(f"reviews:{name}", review)

if __name__ == "__main__":
    op = sys.argv[1]
    set = sys.argv[2]
    command_table.get(f"{op} {set}")()
