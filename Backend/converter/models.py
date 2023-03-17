import json


class Node(object):
    def __init__(self, id: str, type: str, data: dict):
        self.type = type
        self.id = id
        self.data = data


class Edge(object):
    def __init__(self, source: Node, target: Node, targetHandle: str):
        self.source = source
        self.target = target
        self.targetHandle = targetHandle


def __convert_to_pymc(node, edges, root=False):
    if not root:
        arguments = 0

    dist_name = node.data['dist']['name']
    var_name = [edge.targetHandle for edge in edges if edge.source == node]

    final_string = f'{node.id}_{var_name[0]} = pm.{dist_name}("{node.id}_{var_name[0]}")'
    print(final_string)
    return final_string


def convert_model_to_pymc(path):
    with open(path) as f:
        data = json.load(f)
        nodes_dict = {
            node["id"]:
                Node(
                    node["id"],
                    node["type"],
                    node["data"]) for node in data["nodes"]}

        edges = [
            Edge(
                nodes_dict[edge["source"]],
                nodes_dict[edge["target"]],
                edge["targetHandle"]) for edge in data["edges"]]

        for k, v in nodes_dict.items():
            if v.data['root']:
                __convert_to_pymc(v, edges, root=True)

        return edges, list(nodes_dict.values())
