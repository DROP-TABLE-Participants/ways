from models.product import Product_Pydantic, ProductIn_Pydantic, Product


class ProductService:
    @staticmethod
    async def get_products():
        return await Product_Pydantic.from_queryset(Product.all())

    @staticmethod
    async def create_product(product: ProductIn_Pydantic):
        product_obj = await Product.create(**product.model_dump(exclude_unset=True))
        return await Product_Pydantic.from_tortoise_orm(product_obj)

