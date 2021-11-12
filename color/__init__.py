#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
    Module emoji
"""

import json
import os

import docutils.parsers.rst.directives as directives
from docutils.nodes import Text, inline
from docutils.parsers.rst import Directive
from docutils.parsers.rst.roles import set_classes
from pkg_resources import resource_filename
from sphinx import addnodes
from sphinx.util.fileutil import copy_asset

__version_info__ = (0, 0, 1)
__version__ = ".".join([str(val) for val in __version_info__])

colors = {
    "AliceBlue": "AliceBlue",
    "AntiqueWhite": "AntiqueWhite",
    "Aqua": "Aqua",
    "Aquamarine": "Aquamarine",
    "Azure": "Azure",
    "Beige": "Beige",
    "Bisque": "Bisque",
    "Black": "Black",
    "BlanchedAlmond": "BlanchedAlmond",
    "Blue": "Blue",
    "BlueViolet": "BlueViolet",
    "Brown": "Brown",
    "BurlyWood": "BurlyWood",
    "CadetBlue": "CadetBlue",
    "Chartreuse": "Chartreuse",
    "Chocolate": "Chocolate",
    "Coral": "Coral",
    "CornflowerBlue": "CornflowerBlue",
    "Cornsilk": "Cornsilk",
    "Crimson": "Crimson",
    "Cyan": "Cyan",
    "DarkBlue": "DarkBlue",
    "DarkCyan": "DarkCyan",
    "DarkGoldenRod": "DarkGoldenRod",
    "DarkGray": "DarkGray",
    "DarkGrey": "DarkGrey",
    "DarkGreen": "DarkGreen",
    "DarkKhaki": "DarkKhaki",
    "DarkMagenta": "DarkMagenta",
    "DarkOliveGreen": "DarkOliveGreen",
    "DarkOrange": "DarkOrange",
    "DarkOrchid": "DarkOrchid",
    "DarkRed": "DarkRed",
    "DarkSalmon": "DarkSalmon",
    "DarkSeaGreen": "DarkSeaGreen",
    "DarkSlateBlue": "DarkSlateBlue",
    "DarkSlateGray": "DarkSlateGray",
    "DarkSlateGrey": "DarkSlateGrey",
    "DarkTurquoise": "DarkTurquoise",
    "DarkViolet": "DarkViolet",
    "DeepPink": "DeepPink",
    "DeepSkyBlue": "DeepSkyBlue",
    "DimGray": "DimGray",
    "DimGrey": "DimGrey",
    "DodgerBlue": "DodgerBlue",
    "FireBrick": "FireBrick",
    "FloralWhite": "FloralWhite",
    "ForestGreen": "ForestGreen",
    "Fuchsia": "Fuchsia",
    "Gainsboro": "Gainsboro",
    "GhostWhite": "GhostWhite",
    "Gold": "Gold",
    "GoldenRod": "GoldenRod",
    "Gray": "Gray",
    "Grey": "Grey",
    "Green": "Green",
    "GreenYellow": "GreenYellow",
    "HoneyDew": "HoneyDew",
    "HotPink": "HotPink",
    "IndianRed": "IndianRed",
    "Indigo": "Indigo",
    "Ivory": "Ivory",
    "Khaki": "Khaki",
    "Lavender": "Lavender",
    "LavenderBlush": "LavenderBlush",
    "LawnGreen": "LawnGreen",
    "LemonChiffon": "LemonChiffon",
    "LightBlue": "LightBlue",
    "LightCoral": "LightCoral",
    "LightCyan": "LightCyan",
    "LightGoldenRodYellow": "LightGoldenRodYellow",
    "LightGray": "LightGray",
    "LightGrey": "LightGrey",
    "LightGreen": "LightGreen",
    "LightPink": "LightPink",
    "LightSalmon": "LightSalmon",
    "LightSeaGreen": "LightSeaGreen",
    "LightSkyBlue": "LightSkyBlue",
    "LightSlateGray": "LightSlateGray",
    "LightSlateGrey": "LightSlateGrey",
    "LightSteelBlue": "LightSteelBlue",
    "LightYellow": "LightYellow",
    "Lime": "Lime",
    "LimeGreen": "LimeGreen",
    "Linen": "Linen",
    "Magenta": "Magenta",
    "Maroon": "Maroon",
    "MediumAquaMarine": "MediumAquaMarine",
    "MediumBlue": "MediumBlue",
    "MediumOrchid": "MediumOrchid",
    "MediumPurple": "MediumPurple",
    "MediumSeaGreen": "MediumSeaGreen",
    "MediumSlateBlue": "MediumSlateBlue",
    "MediumSpringGreen": "MediumSpringGreen",
    "MediumTurquoise": "MediumTurquoise",
    "MediumVioletRed": "MediumVioletRed",
    "MidnightBlue": "MidnightBlue",
    "MintCream": "MintCream",
    "MistyRose": "MistyRose",
    "Moccasin": "Moccasin",
    "NavajoWhite": "NavajoWhite",
    "Navy": "Navy",
    "OldLace": "OldLace",
    "Olive": "Olive",
    "OliveDrab": "OliveDrab",
    "Orange": "Orange",
    "OrangeRed": "OrangeRed",
    "Orchid": "Orchid",
    "PaleGoldenRod": "PaleGoldenRod",
    "PaleGreen": "PaleGreen",
    "PaleTurquoise": "PaleTurquoise",
    "PaleVioletRed": "PaleVioletRed",
    "PapayaWhip": "PapayaWhip",
    "PeachPuff": "PeachPuff",
    "Peru": "Peru",
    "Pink": "Pink",
    "Plum": "Plum",
    "PowderBlue": "PowderBlue",
    "Purple": "Purple",
    "RebeccaPurple": "RebeccaPurple",
    "Red": "Red",
    "RosyBrown": "RosyBrown",
    "RoyalBlue": "RoyalBlue",
    "SaddleBrown": "SaddleBrown",
    "Salmon": "Salmon",
    "SandyBrown": "SandyBrown",
    "SeaGreen": "SeaGreen",
    "SeaShell": "SeaShell",
    "Sienna": "Sienna",
    "Silver": "Silver",
    "SkyBlue": "SkyBlue",
    "SlateBlue": "SlateBlue",
    "SlateGray": "SlateGray",
    "SlateGrey": "SlateGrey",
    "Snow": "Snow",
    "SpringGreen": "SpringGreen",
    "SteelBlue": "SteelBlue",
    "Tan": "Tan",
    "Teal": "Teal",
    "Thistle": "Thistle",
    "Tomato": "Tomato",
    "Turquoise": "Turquoise",
    "Violet": "Violet",
    "Wheat": "Wheat",
    "White": "White",
    "WhiteSmoke": "WhiteSmoke",
    "Yellow": "Yellow",
    "YellowGreen": "YellowGreen",
}


# add role
def color_global(color):
    def red(role, rawtext, text, lineno, inliner, options={}, content=[]):
        node = inline(text=text, classes=[color])
        return [node], []

    return red


def copy_asset_files(app, exc):
    asset_files = [
        resource_filename(__name__, "color.css"),
    ]
    if exc is None:  # build succeeded
        for path in asset_files:
            copy_asset(path, os.path.join(app.outdir, "_static/css"))


def setup(app):
    app.connect("build-finished", copy_asset_files)
    for key, value in colors.items():
        app.add_role(key, color_global(value))
    app.add_css_file("css/color.css")
    return {"version": __version__}
