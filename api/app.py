from . import app

if __name__ == "__main__":
    app.config.from_object('configurations.DevelopmentConfig')
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))