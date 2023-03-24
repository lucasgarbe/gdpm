from .models import Edge, Node

"""Reactflow Nodes and Edge decoder

This script allows the user to decode the Reactflow-graph to their respective Nodes and Edges.
functions:
    * decode_JSON_to_Nodes - decodes the graph into a Dictionary of Nodes
    * decode_JSON_to_edges - decodes the graph into Edges ( already decoded Nodes are necessary )
"""


def decode_JSON_to_Nodes(data: dict) -> dict[str, Node]:
    """
    Decodes JSON body to Nodes

    @param data: unprocessed JSON body of the reactflow graph
    @return: all Nodes as dict[Node]
    """
    nodes_dict = {
        node["id"]:
            Node(
                node["id"],
                node["type"],
                node["data"]) for node in data["nodes"]}
    return nodes_dict


def decode_JSON_to_edges(data: dict, nodes_dict: dict) -> list[Edge]:
    """
    Decodes Nodes and JSON body to Edges

    @param data: unprocessed JSON body of the reactflow graph
    @param nodes_dict: all Nodes as dict[Node] ( by invoking @decode_JSON_to_Nodes() )
    @return: a list of all Edges as list[Edge]
    """
    edges = [
        Edge(
            nodes_dict[edge["source"]],
            nodes_dict[edge["target"]],
            edge["targetHandle"]) for edge in data["edges"]]
    return edges
