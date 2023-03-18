import json


class Node(object):
    def __init__(self, id: str, type: str, data: dict):
        self.type = type
        self.id = id
        self.data = data

    def __str__(self):
        return f'Node({self.id},{self.type},{self.data})'


class Edge(object):
    def __init__(self, source: Node, target: Node, targetHandle: str):
        self.source = source
        self.target = target
        self.targetHandle = targetHandle

    def __str__(self):
        return f'Edge({self.source.id},{self.target.id},{self.targetHandle})'


def __decode_arguments(node, edges):
    # print(node)
    input_edges = [f'{edge.targetHandle}={edge.source.id}_out' for edge in edges if edge.target == node]
    # [print(i) for i in input_edges]
    arguments = ', '.join(input_edges)
    return arguments


def __convert_to_pymc(node, edges, root=False):
    var_name = f'{node.id}_out'
    # [edge.targetHandle for edge in edges if edge.source == node]

    pymc_string = ''
    args = []
    if node.type == 'Constant':
        return __decode_constant(node)

    if not root:
        args = ", " + __decode_arguments(node, edges)
        print('ARGS: ', args)

    if node.type == 'distribution':
        dist_name = node.data['dist']['name']
        pymc_string = f'{var_name} = pm.{dist_name}("{var_name}"{args})'

        print(pymc_string)

    return pymc_string


def __decode_constant(node):
    cons_value = node.data['value']
    pymc_string = f'{node.id}_constant = {cons_value}'
    return pymc_string


def __decode_JSON_to_Nodes(data):
    nodes_dict = {
        node["id"]:
            Node(
                node["id"],
                node["type"],
                node["data"]) for node in data["nodes"]}
    return nodes_dict


def __decode_JSON_to_edges(data, nodes_dict):
    edges = [
        Edge(
            nodes_dict[edge["source"]],
            nodes_dict[edge["target"]],
            edge["targetHandle"]) for edge in data["edges"]]
    return edges


def convert_model_to_pymc(path):
    with open(path) as f:
        data = json.load(f)
        nodes = __decode_JSON_to_Nodes(data)
        edges = __decode_JSON_to_edges(data, nodes_dict=nodes)

        pymc_code = 'import pymc as pm \nwith pm.Model():\n'
        for k, node in nodes.items():
            if node.data['root']:
                pymc_code += '\n\t' + __convert_to_pymc(node, edges, root=True)
        for k, node in nodes.items():
            if not node.data['root']:
                pymc_code += '\n\t' + __convert_to_pymc(node, edges, root=False)

        print(pymc_code)
        return edges, list(nodes.values())
