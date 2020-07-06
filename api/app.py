from __init__ import app

if __name__ == "__main__":

    print()
    print(app)
    print()



    app.config.from_object('configurations.DevelopmentConfig')
    #threaded allows multiple users ?
    #app.run(host='0.0.0.0',threaded=True, debug=False, port=os.environ.get('PORT', 80)) PRODUCTION
    app.run()