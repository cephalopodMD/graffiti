from flask import Flask
from flask_restful import Api
from flask.ext.restful.utils import cors
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__)
api = Api(app)

db = SQLAlchemy(app)
app.config['SQLALCHEMY_DATABASE_URI'] = (
        'mysql://graffiti_user:password@127.0.0.1:3306/graffiti')

api.decorators = [cors.crossdomain(
        origin = '*',
        methods= ['GET','POST','PUT','DELETE','OPTIONS'],
        headers= ['/*/','Content-type','Content-Length','Origin',
                  'X-Requested-With','Content-Type','Accept','Accept-Language',
                  'Accept-Encoding','Host','User-Agent','Connection','Pragma',
                  'Cache-Control','Authentication-Info', 'Authorization'])]

import urls