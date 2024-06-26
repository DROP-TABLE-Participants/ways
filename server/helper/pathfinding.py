import time
import itertools
from typing import List, Tuple

from astar import AStar


def get_path(items: List[str]):
    t0 = time.time()
    astar = AStar(items)
    paths = {}

    for node1, node2 in itertools.combinations(items + ["EN", "EX"], 2):
        distance, path = astar.search(astar.get_point(node1), astar.get_point(node2))

        paths[(node1, node2)] = [distance, path]
        paths[(node2, node1)] = [distance, path[::-1]]

    distances = []

    for permutation in itertools.permutations(items):
        whole_path = ["EN"] + list(permutation) + ["EX"]

        dis = 0
        path = []

        for i in range(len(whole_path) - 1):
            item1 = whole_path[i]
            item2 = whole_path[i + 1]

            if (item1, item2) in paths:
                the_path = paths[(item1, item2)][1]
                the_distance = paths[(item1, item2)][0]
            else:
                the_path = paths[(item2, item1)][1]
                the_distance = paths[(item2, item1)][0]

            if 0 < i < len(whole_path) - 1:
                the_path = the_path[1:]
                the_distance -= 1

            dis += the_distance
            path.extend(the_path)

        distances.append([dis, path])

    t1 = time.time()

    return min(distances, key=lambda x: x[0])

