#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
    Module emoji
"""

__version_info__ = (0, 0, 1)
__version__ = ".".join([str(val) for val in __version_info__])

prolog = """.. |check| raw:: html

    <input checked=""  type="checkbox">

.. |check_| raw:: html

    <input checked=""  disabled="" type="checkbox">

.. |uncheck| raw:: html

    <input type="checkbox">

.. |uncheck_| raw:: html

    <input disabled="" type="checkbox">
"""


def setup(app):
    app.config.rst_prolog = prolog
    return {"version": __version__}
