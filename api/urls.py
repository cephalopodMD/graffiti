__author__ = 'acl3qb'

from . import api
from resources import *

api.add_resource(pixels.PixelsApi, '/pixels')
api.add_resource(pixels.PixelRangeApi, '/pixels/<int:x>,<int:y>:<int:width>,<int:height>')
api.add_resource(pixels.PixelApi, '/pixels/<int:x>,<int:y>')