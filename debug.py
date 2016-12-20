#env python
__author__ = 'cephalopodMD'

if __name__ == '__main__':
	from api import app
	app.run(host='0.0.0.0', port=5000, debug=True)
