import csv

from models.product import ProductIn_Pydantic
from services.product_service import ProductService


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
            products = [{'name': row[0], 'category': row[1], "quantity": 0} for row in reader]

        # Iterate over the list of dictionaries and create a new product in the database for each one
        print(products)
        for product in products:
            product_in = ProductIn_Pydantic(**product)
            await ProductService.create_product(product_in)
