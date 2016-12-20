__author__ = 'cephalopodMD'

from . import api
from resources import *

api.add_resource(pixels.PixelsApi, '/pixels')
api.add_resource(pixels.PixelRangeApi, '/pixels/<x>,<y>:<width>,<height>')
api.add_resource(pixels.PixelApi, '/pixels/<x>,<y>')