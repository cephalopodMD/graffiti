__author__ = 'cephalopodMD'

from flask import Flask, jsonify, request, abort
from flask_restful import Resource
from .. import db
from models import Pixel

class PixelsApi(Resource):

    def post(self):
        if not request.get_json():
            abort(400)
        updates = request.get_json()
        for update in updates['pixels']:
            pixel = Pixel.query.filter(Pixel.pixel_x == update['x'])\
                    .filter(Pixel.pixel_y == update['y'])\
                    .first()
            if pixel:
                pixel.pixel_color = update['color']
                #TODO update edit times and user information
            else:
                new_pixel = Pixel(update)
                new_pixel.color = update['color']
                db.session.add(new_pixel)
        db.session.commit()
        return updates

class PixelRangeApi(Resource):

    def get(self, x=0, y=0, width=0, height=0):
        x = int(x)
        y = int(y)
        width = int(width)
        height = int(height)
        pixels = Pixel.query.filter(x <= Pixel.pixel_x)\
                 .filter(Pixel.pixel_x < x + width)\
                 .filter(y <= Pixel.pixel_y)\
                 .filter(Pixel.pixel_y < y + height)
        pixel_list = [pixel.json_repr() for pixel in pixels]
        if len(pixel_list) != width * height:
            found_pixels = [[False for y_index in range(height)] for x_index in range(width)]
            for pixel in pixel_list:
                found_pixels[pixel['x'] - x][pixel['y'] - y] = True
            for x_idx, column in enumerate(found_pixels):
                for y_idx, found in enumerate(column):
                    if found == False:
                        new_pixel = Pixel({'x':x + x_idx, 'y':y + y_idx})
                        db.session.add(new_pixel)
            db.session.commit()
            pixels = Pixel.query.filter(x <= Pixel.pixel_x)\
                 .filter(Pixel.pixel_x < x + width)\
                 .filter(y <= Pixel.pixel_y)\
                 .filter(Pixel.pixel_y < height + y)
            pixel_list = [pixel.json_repr() for pixel in pixels]
        return jsonify({'pixels':pixel_list})

class PixelApi(Resource):

    def get(self, x=0, y=0):
        x = int(x)
        y = int(y)
        pixel = Pixel.query.filter(Pixel.pixel_x == x)\
                .filter(Pixel.pixel_y == y)\
                .first()
        if pixel:
            return jsonify(pixel.json_repr())
        else:
            abort(404)

if __name__ == '__main__':
    pass