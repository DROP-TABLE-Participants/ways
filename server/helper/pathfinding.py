import itertools
from typing import List, Tuple

from astar import AStar


def get_path(items: List[str]):
    astar = AStar(items)
    paths = {}

    for node1, node2 in itertools.combinations(items + ["EN", "EX"], 2):
        distance, path = astar.search(astar.get_point(node1), astar.get_point(node2))

        paths[(node1, node2)] = distance
        paths[(node2, node1)] = distance

    distances = []

    for permutation in itertools.permutations(items):
        whole_path = ["EN"] + list(permutation) + ["EX"]

        dis = 0

        for i in range(len(whole_path) - 1):
            item1 = whole_path[i]
            item2 = whole_path[i + 1]

            if (item1, item2) in paths:
                dis += paths[(item1, item2)]
            else:
                dis += paths[(item2, item1)]

        distances.append(dis)

