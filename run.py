if __name__ == '__main__':
	from api import app
	#app.run(host='0.0.0.0', port=5000)
	app.run(host='localhost', port=5000, debug=True)