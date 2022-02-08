#!/usr/bin/python

import fileinput
import redis
import json
import sys

r = redis.Redis(host='localhost', port=6379, decode_responses=True)
r.geoadd("locations", ["10.0", "10.0", "test"], nx=False)


#helper function
def geo_members(key):
    return r.geosearch(key, longitude = "0", latitude = "0", radius = "22000", unit = "km", withcoord = True)


method_table = {}

def method(name):
    def inner(function):
        method_table[name] = function
        return function
    return inner

@method("getall")
def get_all():
    return [{"name": name, "lon": lon, "lat": lat} for [name, (lon, lat)] in geo_members("locations")]




method_table["getall"] = get_all

"""
Main function
"""
if __name__ == "__main__":

    if len(sys.argv) < 2:
        print("need to specify an argument")
        exit(1)

    method = sys.argv[1]

    method_function = method_table.get(method, None)

    if method_function == None:
        print("not a valid method")
        exit(1)

    result = method_function()
    print(result)


