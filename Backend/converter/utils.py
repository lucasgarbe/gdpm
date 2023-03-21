from collections import defaultdict

from . import pymc_converter
from .models import Edge


def create_reversed_graph(nodes: dict, edges: list[Edge]):
    # graph = {
    #     'Node_0': [2],
    #     'Node_1': [0,3],
    #     'Node_2': [],
    #     'Node_3': [2],
    #     'Node_4': [3],
    #     'Node_5': [1],
    #     'Node_6': [0,2],
    # }

    # inverse_graph = {
    #     'Node_0': [Node_1,Node_6],
    #     'Node_1': [Node_5],
    #     'Node_2': [Node_0,Node_3,Node__6],
    #     'Node_3': [Node_1,Node_4],
    #     'Node_4': [],
    #     'Node_5': [],
    #     'Node_6': [],
    # }

    graph = defaultdict(list)

    for node in nodes:
        graph[node] = ([edge.source for edge in edges if node == edge.target.id])

    return graph


def traverse_graph(graph, edges, node, visited=None, output=None, library='pymc'):
    if visited is None:
        visited = set()
    if output is None:
        output = []

    for n in node:
        visited.add(n)
        for neighbor in graph.get(n.id):
            if neighbor not in visited:
                traverse_graph(graph, edges, [neighbor], visited, output)
        try:
            if library == 'pymc':
                output.append(pymc_converter.convert(n, edges))
            else:
                raise ModuleNotFoundError
        except ModuleNotFoundError:
            print('Library not found, choose between pymc,...')
    return output


def get_end_of_graph(nodes, edges):
    source = set()
    endnodes = set()

    for edge in edges:
        source.add(edge.source)

    var = {endnodes.add(nodes.get(node))
           for node in nodes
           if nodes.get(node) not in source}
    print(endnodes)
    return endnodes
