import json

from .model_decoder import decode_JSON_to_Nodes, decode_JSON_to_edges
from .models import Node, Edge
from .utils import create_reversed_graph, get_end_of_graph, traverse_graph_recursive

""" PyMC Converter

This script is the main script for converting the graph into PyMC Code

functions:

    * convert_model - converts the reactflow JSON body to PyMC code
    * convert - converts a single node in respect to their edges to PyMC code 
    * __write_constant - converts constant-nodes
    * __write_arguments - collects all arguments (inputs) a node has

"""


def convert_model(json_obj):
    """
    By decoding the JSON body of the reactflow graph, this method creates a reversed version of the graph and traverses
    it by its endnodes as starting nodes to ensure the right order of arguments in the code.

    @param json_obj: JSON body of reactflow
    @return: PyMC code string
    """
    nodes = decode_JSON_to_Nodes(json_obj)
    edges = decode_JSON_to_edges(json_obj, nodes_dict=nodes)

    graph = create_reversed_graph(nodes, edges)
    endnodes = get_end_of_graph(nodes, edges)

    pymc_elements = traverse_graph_recursive(graph, edges, endnodes)

    pymc_code = 'import pymc as pm \nmodel = pm.Model();\nwith model:\n'

    for e in pymc_elements:
        pymc_code += '\n\t' + e

    return pymc_code


def convert(node: Node, edges: list[Edge]):
    """

    @param node: single node that gets converted to PyMC code
    @param edges: all edges of the graph
    @return: PyMc code for a single node
    """

    var_name = f'{node.id}_out'
    pymc_string = ''
    args = []

    if node.type == 'constant':
        return __write_constant(node)

    else:
        args = __write_arguments(node, edges)

    if node.type == 'distribution':
        dist_name = node.data['dist']['name']
        pymc_string = f'{var_name} = pm.{dist_name}("{var_name}"{args})'

    if node.type == 'operation':
        pymc_string = f'{var_name} = {args}'

    return pymc_string


def __write_constant(node):
    """
    Converts a constant to attribute string
    @param node: single node
    @return: attribute string
    """
    cons_value = node.data['value']
    pymc_string = f'{node.id}_out = {cons_value}'
    return pymc_string


def __write_arguments(node, edges):
    """
    Collects all arguments for one Node. Attributes are the respective inputs the node receives.
    @param node: node to collect arguments for
    @param edges: all edges of the graph
    @return: joined string of all arguments
    """
    if node.data['dist']['distType'] == "operation":
        input_edges = [
            f'{edge.source.id}_out'
            for edge in edges
            if edge.target == node]
        if input_edges:
            return node.data['dist']['name'].join(input_edges)

    input_edges = [
        f'{edge.targetHandle}={edge.source.id}_out'
        for edge in edges
        if edge.target == node]

    if input_edges:
        return ', ' + ', '.join(input_edges)

    return ''
