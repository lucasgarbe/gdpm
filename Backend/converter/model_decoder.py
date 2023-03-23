from .models import Edge, Node


def decode_JSON_to_Nodes(data):
    nodes_dict = {
        node["id"]:
            Node(
                node["id"],
                node["type"],
                node["data"]) for node in data["body"]["nodes"]}
    return nodes_dict


def decode_JSON_to_edges(data, nodes_dict: dict):
    edges = [
        Edge(
            nodes_dict[edge["source"]],
            nodes_dict[edge["target"]],
            edge["targetHandle"]) for edge in data["body"]["edges"]]
    return edges
