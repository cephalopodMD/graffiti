__author__ = 'cephalopodMD'

from flask import Flask, send_from_directory
from flask_restful import Api
from flask.ext.restful.utils import cors
from flask.ext.sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
api = Api(app)

db = SQLAlchemy(app)
#TODO use environment variables instead
app.config['SQLALCHEMY_DATABASE_URI'] = (
           'mysql://graffiti_user:password@127.0.0.1:3306/graffiti')

api.decorators = [cors.crossdomain(
        origin = '*',
        methods= ['GET','POST','PUT','DELETE','OPTIONS'],
        headers= ['/*/','Content-type','Content-Length','Origin',
                  'X-Requested-With','Content-Type','Accept','Accept-Language',
                  'Accept-Encoding','Host','User-Agent','Connection','Pragma',
                  'Cache-Control','Authentication-Info', 'Authorization'])]

@app.route('/site/<path:path>')
def send_files(path):
    return send_from_directory(os.path.join(os.getcwd(), u'static'), path)

import urls
