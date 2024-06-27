import os
import heapq
import json
from .graph import Node
import asyncio
from models.tile_type import TileType

from services.tile_service import TileService


class AStar:
    def __init__(self, good_points: list = []):
        self.maze = None
        self.open_list = None
        self.closed_list = None
        self.start_node = None
        self.end_node = None

        self.good_points = [0, "EX", "EN"]
        self.good_points.extend(good_points)

    async def init_maze(self):
        self.maze = [
            [0 for i in range(41)] for k in range(21)
        ]

        tiles = await TileService.get_tiles()

        for tile in tiles:
            if tile.product:
                self.maze[tile.y][tile.x] = tile.product.legacy_product_id
            else:
                if tile.type in [TileType.SELF_CHECKOUT, TileType.CARD_ONLY_SELF_CHECKOUT]:
                    # self.maze[tile.y][tile.x] = f"S{}"
                    if tile.x == 3:
                        if tile.y == 14:
                            multiplier = 3
                        else:
                            multiplier = 1
                    else:
                        if tile.y == 16:
                            multiplier = 2
                        else:
                            multiplier = 4
                    self.maze[tile.y][tile.x] = f"S{multiplier}"
                elif tile.type == TileType.CASH_REGISTER:
                    if tile.x == 3:
                        if tile.y == 18:
                            multiplier = 2
                        else:
                            multiplier = 1
                    else:
                        if tile.y == 18:
                            multiplier = 3
                        else:
                            multiplier = 4

                    self.maze[tile.y][tile.x] = f"CA{multiplier}"
                elif tile.type == TileType.WALL:
                    self.maze[tile.y][tile.x] = "BL"
                # TODO: Add Easter Egg
                # elif tile.tile_type == TileType.EASTER_EGG:
                #     self.maze[tile.x][tile.y] = "EE"
                elif tile.type == TileType.ENTER:
                    self.maze[tile.y][tile.x] = "EN"
                elif tile.type == TileType.EXIT:
                    self.maze[tile.y][tile.x] = "EX"

        print(self.maze)


    def heuristic(self, node1, node2):
        return abs(node1.x - node2.x) + abs(node1.y - node2.y)

    def get_neighbors(self, node):
        neighbors = []
        directions = [(0, -1), (0, 1), (-1, 0), (1, 0), (1, 1), (1, -1), (-1, 1), (-1, -1)]
        old_node = self.maze[node.x][node.y]
        for direction in directions:
            new_x, new_y = node.x + direction[0], node.y + direction[1]
            new_node = self.maze[new_x][new_y]
            if 0 <= new_x < len(self.maze) and 0 <= new_y < len(self.maze[0]):
                if new_node in self.good_points and not (str(old_node).startswith("P") and str(new_node).startswith("P")):
                    neighbors.append(Node(new_x, new_y))
        return neighbors

    def reconstruct_path(self, end_node):
        path = []
        current = end_node
        while current is not None:
            path.append((current.x, current.y))
            current = current.parent
        return path[::-1]

    def get_point(self, point: str):
        for i in range(len(self.maze)):
            for k in range(len(self.maze[0])):
                if self.maze[i][k] == point:
                    return (i, k)

    def search(self, start, end):
        self.start_node = Node(start[0], start[1])
        self.end_node = Node(end[0], end[1])
        self.open_list = []
        self.closed_list = set()

        heapq.heappush(self.open_list, self.start_node)

        while self.open_list:
            current_node = heapq.heappop(self.open_list)
            self.closed_list.add((current_node.x, current_node.y))

            if current_node.x == self.end_node.x and current_node.y == self.end_node.y:
                path = self.reconstruct_path(current_node)

                return [len(path) - 2, path]

            neighbors = self.get_neighbors(current_node)
            for neighbor in neighbors:
                if (neighbor.x, neighbor.y) in self.closed_list:
                    continue

                tentative_g = current_node.g + 1  # Assuming cost from current to neighbor is always 1
                if (neighbor.x, neighbor.y) not in [(n.x, n.y) for n in self.open_list]:
                    neighbor.g = tentative_g
                    neighbor.h = self.heuristic(neighbor, self.end_node)
                    neighbor.f = neighbor.g + neighbor.h
                    neighbor.parent = current_node
                    heapq.heappush(self.open_list, neighbor)
                else:
                    open_neighbor = next((n for n in self.open_list if n.x == neighbor.x and n.y == neighbor.y), None)
                    if tentative_g < open_neighbor.g:
                        open_neighbor.g = tentative_g
                        open_neighbor.f = tentative_g + open_neighbor.h
                        open_neighbor.parent = current_node

        return None


