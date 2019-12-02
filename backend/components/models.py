# pong-online
# https://github.com/VilhelmPrytz/pong-online
# Copyright (C) Vilhelm Prytz 2019

from components.tools import random_string


class Game:
    def __init__(self):
        self.p1_pos = 0
        self.p2_pos = 0
        self.p1_key = random_string(length=50)
        self.p2_key = random_string(length=50)

        self.invite_key = random_string(length=20)

        self.ball_x = 0
        self.ball_y = 0

        self.state = 0  # 0 means playing
