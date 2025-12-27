from functools import wraps
from flask import request
import jwt
import os
from datetime import datetime, timedelta

JWT_SECRET = "this is my random secret"
JWT_ALGO = "HS256"
JWT_EXP_MINUTES = 60 * 24 * 30

def create_token(user_id):
    payload = {
        "sub": str(user_id),
        "exp": datetime.now() + timedelta(minutes=JWT_EXP_MINUTES)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization")
        if not auth or not auth.startswith("Bearer "):
            return {"error": "missing token"}, 401

        token = auth.split()[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
            print(payload)
            request.user_id = payload["sub"]
        except jwt.ExpiredSignatureError:
            return {"error": "token expired"}, 401
        except jwt.InvalidTokenError:
            return {"error": "invalid token"}, 401
        return f(*args, **kwargs)
    return wrapper