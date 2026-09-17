import sys
import os

# Ensure the project directory is on sys.path for PythonAnywhere
project_home = os.path.dirname(os.path.abspath(__file__))
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Convert FastAPI (ASGI) to WSGI for PythonAnywhere's web server
from a2wsgi import ASGIMiddleware
from backend.app import app as fastapi_app

# PythonAnywhere requires a WSGI callable named 'application'
application = ASGIMiddleware(fastapi_app)
