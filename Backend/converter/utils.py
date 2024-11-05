from collections import defaultdict
from typing import Any, Dict, List
import re
import keyword

from . import pymc_converter
from .models import Edge, Node

""" Utilities for graph traversal

This script allows the user to do several interactions with the graph.

functions:
    * create_reversed_graph - changes the graph orientation
    * traverse_graph - passes each node of the graph and builds a list of attributes for the defined library. 
    * get_end_of_graph - gets all nodes without a target
"""


def create_reversed_graph(nodes: dict[str, Node], edges: list[Edge]) -> defaultdict[Any, list]:
    """
    Reverses the graph by changing the key,values(target_nodes) to key,values(source_nodes). Each Node will have
    their respective input nodes in their values.

    This method uses defaultdict() to avoid NullpointerException by nodes that are not present in the graph yet.
    It will create those nodes if not present.

    Example for reversed graph:
    graph = {
        'Node_0': [Node_2],
        'Node_1': [Node_0,Node_3],
        'Node_2': [],
        'Node_3': [Node_2],
        'Node_4': [Node_3],
        'Node_5': [Node_1],
        'Node_6': [Node_0,Node_2],
    }

    inverse_graph = {
        'Node_0': [Node_1,Node_6],
        'Node_1': [Node_5],
        'Node_2': [Node_0,Node_3,Node__6],
        'Node_3': [Node_1,Node_4],
        'Node_4': [],
        'Node_5': [],
        'Node_6': [],
    }


    @param nodes: all nodes of the graph
    @param edges: all edges of the graph
    @return: Reversed graph as defaultdict(key,[source_nodes])
    """
    graph = defaultdict(list)

    for node in nodes:
        graph[node] = ([edge.source for edge in edges if node == edge.target.id])

    return graph


def traverse_graph_recursive(graph: defaultdict[Any, list], edges: list[Edge], endnodes: set[Node], visited=None,
                             output=None,
                             library='pymc') -> list[str]:
    """
    Traverses the graph recursively and will write a string in respect of the provided library.


    @param graph: reversed graph
    @param edges: all edges of the graph
    @param endnodes: nodes without a target
    @param visited: nodes already passed by recursion
    @param output:  attributes for each node passed and returned by the converter
    @param library: used library for conversion
    @return: list of attributes for the whole graph
    """

    if visited is None:
        visited = set()
    if output is None:
        output = []

    for n in endnodes:
        visited.add(n)
        for neighbor in graph.get(n.id):
            if neighbor not in visited:
                traverse_graph_recursive(graph, edges, {neighbor}, visited, output)
        try:
            if library == 'pymc':
                output.append(pymc_converter.convert(n, edges))
            else:
                raise ModuleNotFoundError
        except ModuleNotFoundError:
            print('Library not found, choose between pymc,...')
    return output


def get_end_of_graph(nodes: dict[str, Node], edges: list[Edge]) -> set[Node]:
    """
    Collects all Nodes without a target.

    @param nodes: all nodes of the graph
    @param edges: all edges of the graph
    @return: list of nodes without target nodes (no outgoing edge)
    """
    source = set()
    endnodes = set()

    for edge in edges:
        source.add(edge.source)

    var = {endnodes.add(nodes.get(node))
           for node in nodes
           if nodes.get(node) not in source}
    return endnodes


def sanitize_variable_name(name: str) -> str:
    # Step 1: Replace invalid characters with underscores
    sanitized = re.sub(r'\W|^(?=\d)', '_', name)
    
    # Step 2: Ensure the variable doesn't start with a number
    if re.match(r'^\d', sanitized):
        sanitized = '_' + sanitized

    # Step 3: Avoid Python keywords
    if keyword.iskeyword(sanitized):
        sanitized += '_var'

    return sanitized


def write_unique_names (nodes: dict[str, Node]) -> dict[str, Node]:
    """
    Writes unique names for each node in the graph

    @param nodes: all nodes of the graph
    @return: all nodes with unique names
    """
    print("--- write_unique_names ---")
    names = dict()
    for node in nodes:
        print(node, nodes[node].name)
        nodes[node].name = sanitize_variable_name(nodes[node].name)
        if nodes[node].name in names:
            names[nodes[node].name] += 1
            nodes[node].name += f'_{names[nodes[node].name]}'
        else:
            names[nodes[node].name] = 1
    return nodes


def to_ipynb(data: str):
    return {
        "cells": [
            {
                "cell_type": "code",
                "execution_count": "null",
                "metadata": {},
                "outputs": [],
                "source": [
                    data
                ]
            }
        ],
        "metadata": {
            "language_info": {
                "name": "python"
            },
            "orig_nbformat": 4
        },
        "nbformat": 4,
        "nbformat_minor": 2
    }
