import csv
from random import randint

from models.product import ProductIn_Pydantic
from models.tile import TileIn_Pydantic, TileWithoutProductIn_Pydantic
from models.tile_type import TileType
from services.product_service import ProductService
from services.tile_service import TileService


class Seeder:
    @staticmethod
    async def seed():
        # Check if products already exist in the database
        products = await ProductService.get_products()
        if products:
            return

        # Read the CSV file
        with open('exampleData/products.csv', 'r', encoding='utf-8') as file:
            reader = csv.reader(file)

            # Parse the CSV content into a list of dictionaries
            products = [{'name': row[0], 'category': row[1], "price": randint(1, 30)} for row in reader]

        # Iterate over the list of dictionaries and create a new product in the database for each one
        for product in products:
            product_in = ProductIn_Pydantic(**product)
            await ProductService.create_product(product_in)

        tiles = await TileService.get_tiles()
        if tiles:
            return

        with open('exampleData/tiles.csv', 'r', encoding='utf-8') as file:
            reader = csv.reader(file)

            tiles = [
                {'x': row[0], 'y': row[1], "productName": row[2], "productCategory": row[3], "type": TileType.PRODUCT}
                for row in reader]

        for tile in tiles:
            product = await ProductService.get_product_by_name_and_category(tile['productName'],
                                                                            tile['productCategory'])

            tile.pop('productName')
            tile.pop('productCategory')

            tile_in = TileIn_Pydantic(**tile, product_id=product.id)

            await TileService.create_tile(tile_in)

        with open('exampleData/self_checkout.csv', 'r', encoding='utf-8') as file:
            reader = csv.reader(file)

            tiles = [{'x': row[0], 'y': row[1], "type": TileType.SELF_CHECKOUT} for row in reader]

        for tile in tiles:
            tile_in = TileWithoutProductIn_Pydantic(**tile)
            await TileService.create_tile(tile_in)

        with open('exampleData/card_only_self_checkout.csv', 'r', encoding='utf-8') as file:
            reader = csv.reader(file)

            tiles = [{'x': row[0], 'y': row[1], "type": TileType.CARD_ONLY_SELF_CHECKOUT} for row in reader]

        for tile in tiles:
            tile_in = TileWithoutProductIn_Pydantic(**tile)
            await TileService.create_tile(tile_in)

        with open('exampleData/cash_registers.csv', 'r', encoding='utf-8') as file:
            reader = csv.reader(file)

            tiles = [{'x': row[0], 'y': row[1], "type": TileType.CASH_REGISTER} for row in reader]

        for tile in tiles:
            tile_in = TileWithoutProductIn_Pydantic(**tile)
            await TileService.create_tile(tile_in)

        with open('exampleData/walls.csv', 'r', encoding='utf-8') as file:
            reader = csv.reader(file)

            tiles = [{'x': row[0], 'y': row[1], "type": TileType.WALL} for row in reader]

        for tile in tiles:
            tile_in = TileWithoutProductIn_Pydantic(**tile)
            await TileService.create_tile(tile_in)

        with open('exampleData/easter_eggs.csv', 'r', encoding='utf-8') as file:
            reader = csv.reader(file)

            tiles = [
                {'x': row[0], 'y': row[1], "productName": row[2], "productCategory": row[3], "type": TileType.EASTER_EGG}
                for row in reader]

        for tile in tiles:
            product = await ProductService.get_product_by_name_and_category(tile['productName'],
                                                                            tile['productCategory'])

            tile.pop('productName')
            tile.pop('productCategory')

            tile_in = TileIn_Pydantic(**tile, product_id=product.id)

            await TileService.create_tile(tile_in)

        with open('exampleData/entrance.csv', 'r', encoding='utf-8') as file:
            reader = csv.reader(file)

            tiles = [{'x': row[0], 'y': row[1], "type": TileType.ENTER} for row in reader]

        for tile in tiles:
            tile_in = TileWithoutProductIn_Pydantic(**tile)
            await TileService.create_tile(tile_in)

        with open('exampleData/exit.csv', 'r', encoding='utf-8') as file:
            reader = csv.reader(file)

            tiles = [{'x': row[0], 'y': row[1], "type": TileType.EXIT} for row in reader]

        for tile in tiles:
            tile_in = TileWithoutProductIn_Pydantic(**tile)
            await TileService.create_tile(tile_in)
