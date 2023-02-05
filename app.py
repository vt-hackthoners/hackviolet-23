import base64
import os

import json
from flask import app
from flask import request
from flask_cors import CORS
from flask import Flask, render_template

from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = '/path/to/the/uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)

CORS(app)



@app.route('/png', methods=['POST'])
def png():
    photo = request.get_json()['user_image']
    print(photo)

    return photo


@app.route('/')
def index():
    return render_template('index.html')

