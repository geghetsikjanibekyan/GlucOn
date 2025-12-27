from flask import Flask, request, jsonify, send_from_directory, render_template
import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from require_auth import require_auth, create_token


app = Flask(__name__)
DB = "app.db"
UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as db:
        db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
        """)
        db.execute("""
            CREATE TABLE IF NOT EXISTS recipes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                image TEXT
            )
            """)


@app.post("/register")
def register():
    data = request.json
    print(data)
    if not data or "first_name" not in data or "last_name" not in data or "password" not in data or "email" not in data:
        return {"error": "invalid payload"}, 400

    try:
        with get_db() as db:
            db.execute(
                "INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
                (data["first_name"],
                 data["last_name"],
                 data["email"],
                 generate_password_hash(data["password"]))
            )
        return {"status": "created"}, 201
    except sqlite3.IntegrityError:
        return {"error": "email exists"}, 409


@app.post("/login")
def login():
    data = request.json
    if not data:
        return {"error": "invalid payload"}, 400

    with get_db() as db:
        user = db.execute(
            "SELECT * FROM users WHERE email = ?",
            (data["email"],)
        ).fetchone()

    if not user or not check_password_hash(user["password_hash"], data["password"]):
        return {"error": "invalid credentials"}, 401

    print(user["id"])
    token = create_token(user["id"])
    return {"token": token}


@app.get("/me")
@require_auth
def me():
    with get_db() as db:
        user = db.execute(
            "SELECT * FROM users WHERE id = ?",
            (request.user_id,)
        ).fetchone()
    return {
        "first_name": user['first_name'],
        "last_name": user['last_name'],
        "email": user['email'],
    }


@app.post("/recipes")
@require_auth
def create_recipe():
    title = request.form.get("title")
    content = request.form.get("content")
    image = request.files.get("image")

    if not title or not content:
        return {"error": "invalid payload"}, 400

    filename = None
    if image:
        filename = secure_filename(image.filename)
        image.save(os.path.join(UPLOAD_DIR, filename))

    with get_db() as db:
        db.execute(
            "INSERT INTO recipes (title, content, image) VALUES (?, ?, ?)",
            (title, content, filename)
        )

    return {"status": "created"}, 201

@app.get("/recipes")
@require_auth
def list_recipes():
    with get_db() as db:
        rows = db.execute(
            "SELECT id, title, content, image FROM recipes"
        ).fetchall()
    return jsonify([dict(r) for r in rows])

@app.get("/recipes/<int:rid>")
@require_auth
def get_recipe(rid):
    with get_db() as db:
        r = db.execute(
            "SELECT id, title, content, image FROM recipes WHERE id = ?",
            (rid, request.user_id)
        ).fetchone()

    if not r:
        return {"error": "not found"}, 404

    return dict(r)

@app.get("/images/<filename>")
def get_image(filename):
    return send_from_directory(UPLOAD_DIR, filename)


@app.get("/admin")
def admin_page():
    return render_template("admin.html")

@app.post("/admin/recipes")
def admin_create_recipe():
    title = request.form.get("title")
    content = request.form.get("content")
    image = request.files.get("image")

    if not title or not content:
        return "Invalid input", 400

    filename = None
    if image:
        filename = secure_filename(image.filename)
        image.save(os.path.join(UPLOAD_DIR, filename))

    with get_db() as db:
        db.execute(
            "INSERT INTO recipes (title, content, image) VALUES (?, ?, ?)",
            (title, content, filename)
        )

    return "Saved"

if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=15000, debug=True)