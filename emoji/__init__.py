#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
    Module emoji
"""

import json
import os

import docutils.parsers.rst.directives as directives
from docutils.nodes import Text, emphasis, reference, strong
from docutils.parsers.rst import Directive
from docutils.parsers.rst.roles import set_classes
from sphinx import addnodes

__version_info__ = (0, 0, 1)
__version__ = ".".join([str(val) for val in __version_info__])

with open(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "codes.json"),
    encoding="utf-8",
) as file:
    emoji_dict = json.load(file)

# add role
def emoji_global():
    def emoji(role, rawtext, text, lineno, inliner, options={}, content=[]):
        node = Text(emoji_dict[text] if text in emoji_dict.keys() else text)
        return [node], []

    return emoji


def setup(app):
    app.add_role("emoji", emoji_global())
    return {"version": __version__}
