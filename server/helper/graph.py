
class Node:
    def __init__(self, x, y, g=0, h=0, f=0):
        self.x = x
        self.y = y
        self.g = g
        self.h = h
        self.f = f
        self.parent = None

    def __lt__(self, other):
        return self.f < other.f
