from tortoise import Model, fields
from tortoise.contrib.pydantic import pydantic_model_creator


class AdminSession(Model):
    id = fields.IntField(primary_key=True)
    user_id = fields.TextField()
    token = fields.TextField()

    def __str__(self):
        return self.user_id + " " + self.token


AdminSession_Pydantic = pydantic_model_creator(AdminSession, name="AdminSession")
AdminSessionIn_Pydantic = pydantic_model_creator(AdminSession, name="AdminSessionIn", exclude_readonly=True)
