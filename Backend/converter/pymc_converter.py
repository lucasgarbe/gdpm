import json

from converter.model_decoder import decode_JSON_to_Nodes, decode_JSON_to_edges
from converter.utils import create_reversed_graph, get_end_of_graph, traverse_graph


def convert_model(json_obj):
    nodes = decode_JSON_to_Nodes(json_obj)
    edges = decode_JSON_to_edges(json_obj, nodes_dict=nodes)

    graph = create_reversed_graph(nodes, edges)
    endnodes = get_end_of_graph(nodes, edges)

    pymc_graph = traverse_graph(graph, edges, endnodes)

    pymc_code = 'import pymc as pm \nwith pm.Model():\n'

    for e in pymc_graph:
        pymc_code += '\n\t' + e

    return pymc_code


def convert(node, edges):
    var_name = f'{node.id}_out'
    pymc_string = ''
    args = []

    if node.type == 'Constant':
        return __write_constant(node)

    else:
        args = __write_arguments(node, edges)

    if node.type == 'distribution':
        dist_name = node.data['dist']['name']
        pymc_string = f'{var_name} = pm.{dist_name}("{var_name}"{args})'

    return pymc_string


def __write_constant(node):
    cons_value = node.data['value']
    pymc_string = f'{node.id}_out = {cons_value}'
    return pymc_string


def __write_arguments(node, edges):
    input_edges = [
        f'{edge.targetHandle}={edge.source.id}_out'
        for edge in edges
        if edge.target == node]

    if input_edges:
        return ', ' + ', '.join(input_edges)

    return ''
