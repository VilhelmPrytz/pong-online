# pong-online
# https://github.com/VilhelmPrytz/pong-online
# Copyright (C) Vilhelm Prytz 2019

from flask import Flask, jsonify, request

from components.models import Game

app = Flask(__name__)

BASEPATH = "/backend"

# temporary database
Games = []

# error handlers
@app.errorhandler(400)
def error_400(e):
    return (
        jsonify(
            {
                "status": False,
                "http_code": 400,
                "message": "bad request",
                "response": {},
            }
        ),
        400,
    )


@app.errorhandler(404)
def error_404(e):
    return (
        jsonify(
            {
                "status": False,
                "http_code": 404,
                "message": "page not found",
                "response": {},
            }
        ),
        404,
    )


@app.errorhandler(500)
def error_500(e):
    return (
        jsonify(
            {
                "status": False,
                "http_code": 500,
                "message": "internal server error",
                "response": {},
            }
        ),
        500,
    )


@app.route(f"{BASEPATH}/board", methods=["POST", "PUT"])
def board():
    if request.method == "POST":
        data = request.json

    if request.method == "PUT":
        new_game = Game()
        Games.append(new_game)

        return (
            jsonify(
                {
                    "status": True,
                    "http_code": 201,
                    "message": "request successful",
                    "response": {"game": new_game},
                }
            ),
            201,
        )


if __name__ == "__main__":
    app.run(host="0.0.0.0")
