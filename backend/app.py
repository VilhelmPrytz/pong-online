# pong-online
# https://github.com/VilhelmPrytz/pong-online
# Copyright (C) Vilhelm Prytz 2019

from flask import Flask, jsonify, request
from flask_cors import CORS

from components.models import Game

app = Flask(__name__)
CORS(app)

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

        if data["token"]:
            for game in Games:
                if game.p1_key == data["token"] or game.p2_key == data["token"]:
                    return jsonify({
                        "status": True,
                        "http_code": 200,
                        "message": "request successful",
                        "response": {
                            "game": {
                                "state": game.state,
                                "p1_pos": game.p1_pos,
                                "p2_pos": game.p2_pos,
                                "ball_x": game.ball_x,
                                "ball_y": game.ball_y,
                            }
                        }
                    })

            # token does not exist
            return jsonify({
                "status": False,
                "http_code": 400,
                "message": "invalid token",
                "response": {}
            }), 400

        return jsonify({
            "status": False,
            "http_code": 400,
            "message": "missing data",
            "response": {}
        }), 400

    if request.method == "PUT":
        new_game = Game()
        Games.append(new_game)

        return (
            jsonify(
                {
                    "status": True,
                    "http_code": 201,
                    "message": "request successful",
                    "response": {
                        "game": {
                            "your_key": new_game.p1_key,
                            "invite_key": new_game.invite_key,
                        }
                    },
                }
            ),
            201,
        )


@app.route(f"{BASEPATH}/board/join", methods=["POST"])
def board_join():
    data = request.json

    if data["invite_key"]:
        for game in Games:
            if data["invite_key"] == game.invite_key:
                game.state = 2

                return jsonify({
                    "status": True,
                    "http_code": 200,
                    "message": "request successful",
                    "response": {
                        "game": {
                            "your_key": game.p2_key
                        }
                    }
                })


        return jsonify({
            "status": False,
            "http_code": 400,
            "message": "invalid invite key",
            "response": {}
        }), 400

    return jsonify({
        "status": False,
        "http_code": 400,
        "message": "missing data",
        "response": {}
    }), 400

@app.route(f"{BASEPATH}/board/move", methods=["POST"])
def board_move():
    data = request.json
    print(data)

    if data["token"]:
        for game in Games:
            if game.p1_key == data["token"]:
                if data["direction"] == "up":
                    game.p1_pos = game.p1_pos-1

                if data["direction"] == "down":
                    game.p1_pos = game.p1_pos+1
                
                return jsonify({
                    "status": True,
                    "http_code": 200,
                    "message": "request successful",
                    "response": {
                        "game": {
                            "state": game.state,
                            "p1_pos": game.p1_pos,
                            "p2_pos": game.p2_pos,
                            "ball_x": game.ball_x,
                            "ball_y": game.ball_y,
                        }
                    }
                })
            if game.p2_key == data["token"]:
                if data["direction"] == "up":
                    game.p2_pos = game.p2_pos-1

                if data["direction"] == "down":
                    game.p2_pos = game.p2_pos+1

                return jsonify({
                    "status": True,
                    "http_code": 200,
                    "message": "request successful",
                    "response": {
                        "game": {
                            "state": game.state,
                            "p1_pos": game.p1_pos,
                            "p2_pos": game.p2_pos,
                            "ball_x": game.ball_x,
                            "ball_y": game.ball_y,
                        }
                    }
                })

        # token does not exist
        return jsonify({
            "status": False,
            "http_code": 400,
            "message": "invalid token",
            "response": {}
        }), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0")
