from tortoise import Model, fields
from tortoise.contrib.pydantic import pydantic_model_creator


class Session(Model):
    id = fields.IntField(primary_key=True)
    user_id = fields.TextField()
    token = fields.TextField()

    def __str__(self):
        return self.user_id + " " + self.token


Session_Pydantic = pydantic_model_creator(Session, name="Session")
SessionIn_Pydantic = pydantic_model_creator(Session, name="SessionIn", exclude_readonly=True)
