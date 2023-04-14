class Node(object):
    def __init__(self, id: str, var_name: str, type: str, data: dict):
        self.type = type
        self.id = id
        self.data = data
        self.var_name = var_name

    def __str__(self):
        return f'Node({self.id},{self.type},{self.data})'


class Edge(object):
    def __init__(self, source: Node, target: Node, targetHandle: str):
        self.source = source
        self.target = target
        self.targetHandle = targetHandle

    def __str__(self):
        return f'Edge({self.source.id},{self.target.id},{self.targetHandle})'
