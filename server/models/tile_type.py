from enum import IntEnum


class TileType(IntEnum):
    PRODUCT = 0
    SELF_CHECKOUT = 1,
    CARD_ONLY_SELF_CHECKOUT = 2
    CASH_REGISTER = 3
    WALL = 4
    EASTER_EGG = 5
    ENTER = 6
    EXIT = 7
    CLEAR = 8