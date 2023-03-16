from django.db import models
import json


class Distribution(object):
    def __init__(self, name):
        self.name = name


class Edges(object):
    def __init__(self, name, source, target):
        self.name = name
        self.source = source
        self.target = target


class Nodes(object):
    def __init__(self, name, root, dist, edges):
        self.name = name
        self.root = root
        self.dist = Distribution(**dist)
        self.edges = Edges(**edges)


def importJSON(js):
    j = json.loads(js)
    print(j)
    # u = Nodes(**j)
    # print(u)


def writeRootNodes():
    pass


def writeGraph():
    pass
