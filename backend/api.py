#!/usr/bin/python

import fileinput
import redis
import json
import sys

r = redis.Redis(host='localhost', port=6379, decode_responses=True)

#helper functions
def geo_members(key):
    return r.geosearch(key, longitude = "0", latitude = "0", radius = "22000", unit = "km", withcoord = True)

def get_reviews(key):
    reviews = [review for review in r.smembers(f"reviews:{key}")]
    return reviews
    # return reviews[0] if len(reviews) > 0 else ""

def get_location(name):
    return r.geosearch("locations", member=name, radius = "0", unit="km", withcoord = True )

method_table = {}

def method(name):
    def inner(function):
        method_table[name] = function
        return function
    return inner


# -----------
# API METHODS
# -----------

@method("add")
def add(args):
    r.geoadd("locations", (args.get("longitude"), args.get("latitude"), args.get("name")))
    if args.get('review') != "":
        r.sadd(f"reviews:{args.get('name')}", args.get('review'))
    return ""

@method("add-review")
def add_review(args):
    if args.get('review') != "":
        r.sadd(f"reviews:{args.get('name')}", args.get('review'))
    return ""


@method("water-closets")
def water_closets(args):
    output = [( name, long, lat, get_reviews(name)) for [name, (long, lat)] in geo_members("locations")]
    output = [{ "name": name, "longitude": long, "latitude": lat, "review": review } for name, long, lat, review in output]
    return json.dumps(output)

@method("get")
def get(args):
    name, (longitude, latitude) = get_location(args.get("name"))[0]
    reviews = get_reviews(args.get("name"))
    return json.dumps({ "name": name, "reviews": reviews, "latitude": latitude, "longitude": longitude })

@method("getall")
def get_all(args):
    return json.dumps([{"name": name, "longitude": lon, "latitude": lat} for [name, (lon, lat)] in geo_members("locations")])

@method("find")
def find(args):

    radius = "10"
    latitude = args.get("latitude")
    longitude = args.get("longitude")

    result = r.geosearch("locations",
        longitude = longitude,
        latitude = latitude,
        radius = radius,
        unit = "km",
        withdist = True,
        sort = "ASC",
    )

    locations = [{"name": name, "distance": distance} for [name, distance] in result]
    return json.dumps(locations)


"""
Main function
"""
if __name__ == "__main__":

    if len(sys.argv) < 2:
        print("need to specify an argument")
        exit(1)

    method = sys.argv[1]
    method_function = method_table.get(method, None)

    try:
        input = json.load(sys.stdin)
    except:
        input = {}


    if method_function == None:
        print("not a valid method")
        exit(1)

    result = method_function(input)
    print(result)
