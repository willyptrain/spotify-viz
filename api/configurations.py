class BaseConfig(object):
 '''
 Base config class
 '''
 DEBUG = True
 TESTING = False
 FLASK_APP=run.py




class ProductionConfig(BaseConfig):
 """
 Production specific config
 """
 DEBUG = False
 FLASK_APP=run.py


class DevelopmentConfig(BaseConfig):
 """
 Development environment specific configuration
 """
 DEBUG = True
 TESTING = True
 FLASK_APP=run.py
