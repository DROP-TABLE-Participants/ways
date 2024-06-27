import time
import itertools
from typing import List
import pickle

from redis_client import redis_client

from .astar import AStar


async def get_path(items: List[str]):
    t0 = time.time()
    astar = AStar(items)
    await astar.init_maze()

    paths = {}

    additional_paths = ["EN", "EX"]
    exits = ["CA1", "CA2", "CA3", "CA4", "S1", "S2", "S3", "S4"]

    for node1, node2 in itertools.combinations(items + additional_paths + exits, 2):
        cached_path = redis_client.get(f"{node1}:{node2}")

        if not cached_path:
            if node1 in exits:
                astar.add_point(node1)
            elif node2 in exits:
                astar.add_point(node2)

            distance, path = astar.search(astar.get_point(node1), astar.get_point(node2))

            paths[(node1, node2)] = [distance, path]
            paths[(node2, node1)] = [distance, path[::-1]]

            redis_client.set(f"{node1}:{node2}", pickle.dumps([distance, path]).decode("latin1"))
            redis_client.set(f"{node2}:{node1}", pickle.dumps([distance, path[::-1]]).decode("latin1"))

            if node1 in exits:
                astar.remove_point(node1)
            elif node2 in exits:
                astar.remove_point(node2)
        else:
            distance, path = pickle.loads(cached_path.encode("latin1"))

            paths[(node1, node2)] = [distance, path]
            paths[(node2, node1)] = [distance, path[::-1]]

    distances = []

    for permutation in itertools.permutations(items):
        for end_point in ["CA1", "CA2", "CA3", "CA4", "S1", "S2", "S3", "S4"]:
            whole_path = ["EN"] + list(permutation) + [end_point] + ["EX"]

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

            distances.append([dis, path, whole_path])

    t1 = time.time()

    print(t1 - t0)

    return min(distances, key=lambda x: x[0])
