# pong-online
# https://github.com/VilhelmPrytz/pong-online
# Copyright (C) Vilhelm Prytz 2019

import string
import json
import random


def random_string(length=10):
    """Generate a random string of fixed length"""

    return "".join(
        random.choice(string.ascii_lowercase + string.digits) for i in range(length)
    )
