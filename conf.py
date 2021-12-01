# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
# import os
# import sys
# sys.path.insert(0, os.path.abspath('.'))


# -- Project information -----------------------------------------------------

project = "StephLin's Personal Blog"
copyright = "2021, Yu-Kai Lin"
author = "Yu-Kai Lin"


# -- General configuration ---------------------------------------------------

import sys

sys.path.append(".")

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    "sphinx.ext.mathjax",
    "sphinxcontrib.youtube",
    "sphinx_fontawesome",
    "ablog",
    "sphinx.ext.intersphinx",
    "sphinxcontrib.mermaid",
    "myst_nb",
    "emoji",
    "color",
    "checkbox",
]

# Add any paths that contain templates here, relative to this directory.
templates_path = ["_templates"]

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store", "venv"]

source_suffix = {
    ".rst": "restructuredtext",
    ".ipynb": "myst-nb",
    ".myst": "myst-nb",
}

jupyter_execute_notebooks = "off"

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = "pydata_sphinx_theme"

html_theme_options = {
    "collapse_navigation": True,
    "navigation_depth": 2,
    "show_prev_next": False,
    "navbar_end": ["search-field", "navbar-icon-links"],
    "show_toc_level": 3,
    "icon_links": [
        {
            "name": "GitHub",
            "url": "https://github.com/StephLin",
            "icon": "fab fa-github-square",
        },
        {
            "name": "RSS",
            "url": "/blog/atom.xml",
            "icon": "fas fa-rss-square",
        },
    ],
    "google_analytics_id": "UA-179336561-1",
}

html_extra_path = ["feed.xml"]

html_sidebars = {
    "index": [
        "me.html",
        "recentposts.html",
        "tagcloud.html",
        "categories.html",
        "archives.html",
    ],
    "blog": [
        "me.html",
        "recentposts.html",
        "tagcloud.html",
        "categories.html",
        "archives.html",
    ],
    "post/**": [
        "postcard.html",
        "recentposts.html",
        "tagcloud.html",
        "categories.html",
        "archives.html",
    ],
    "about": [],
    "projects": [],
}

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ["_static"]

html_css_files = ["css/style.css"]

html_codeblock_linenos_style = "table"

html_logo = "_static/images/logo.png"

html_favicon = "_static/favicon.ico"

# sphinxemoji_style = "twemoji"


# -- Blog Options ----

blog_authors = {
    "StephLin": ("Yu-Kai Lin", "https://github.com/StephLin"),
}
blog_default_author = "StephLin"
blog_languages = {
    "en": ("English", None),
    "zh": ("中文", None),
}
blog_locations = {
    "TW": ("Taiwan", None),
}
blog_baseurl = "https://stephlin.github.io"
blog_title = "StephLin's Personal Blog"
blog_path = "blog"

blog_feed_archives = True

fontawesome_link_cdn = (
    "http://localhost:5510/_static/vendor/fontawesome/5.13.0/css/all.min.css"
)
fontawesome_included = True

disqus_shortname = "stephlin-github-io"
