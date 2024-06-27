from tortoise.functions import Count

from models.product import Product_Pydantic, ProductIn_Pydantic, Product


class ProductService:
    @staticmethod
    async def get_products(search: str = None, filter_category: str = None):
        if search and filter_category:
            return await Product_Pydantic.from_queryset(
                Product.filter(name__icontains=search, category=filter_category))
        elif search:
            return await Product_Pydantic.from_queryset(Product.filter(name__icontains=search))
        elif filter_category:
            return await Product_Pydantic.from_queryset(Product.filter(category=filter_category))
        return await Product_Pydantic.from_queryset(Product.all())

    @staticmethod
    async def get_product_group_by_category(search: str = None):
        pass

    @staticmethod
    async def create_product(product: ProductIn_Pydantic):
        product_obj = await Product.create(**product.model_dump(exclude_unset=True))
        return await Product_Pydantic.from_tortoise_orm(product_obj)

    @staticmethod
    async def get_product_by_name_and_category(name: str, category: str):
        return await Product_Pydantic.from_queryset_single(Product.get(name=name, category=category))

    @staticmethod
    async def get_categories():
        categories = await Product.all().distinct().values('category')

        return [category['category'] for category in categories]

    @staticmethod
    async def get_product_by_id(product_id: int):
        return await Product_Pydantic.from_queryset_single(Product.get(id=product_id))
