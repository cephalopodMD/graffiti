_author__ = 'cephalopodMD'

from .. import db
import random

class Pixel(db.Model):

    __tablename__ = 'pixels'

    pixel_id = db.Column(db.Integer, primary_key=True)
    pixel_x = db.Column(db.Integer)
    pixel_y = db.Column(db.Integer)
    pixel_color = db.Column(db.Integer)
    pixel_last_updated = db.Column(db.DATETIME)
    pixel_updated_by = db.Column(db.Integer) #, db.ForeignKey(User.id))
    pixel_edit_lock = db.Column(db.DATETIME)
    pixel_locked_by = db.Column(db.Integer) #, db.ForeignKey(User.id))
    pixel_canvas = db.Column(db.Integer) #, db.ForeignKey(Canvas.id))

    def __init__(self, d):
        # requires x and y
        self.pixel_x = d['x']
        self.pixel_y = d['y']
        #TODO multiple random colors
        self.pixel_color = d.get('color', bool(random.getrandbits(1)))
        self.pixel_last_updated = 0
        self.pixel_edit_lock = 0
        self.pixel_canvas = 1

    def __repr__(self):
        return 'Pixel ' + self.pixel_x +', ' + self.pixel_y

    def json_repr(self):
        d = {
            'x': self.pixel_x,
            'y': self.pixel_y,
            'color': self.pixel_color
        }
        return d
