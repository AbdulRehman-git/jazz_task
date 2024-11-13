from flask import Flask
from database import db, init_app, User
from controllers.userController import user_api
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# Configure the database URL (for SQLite in this case)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy with the app
init_app(app)

# Create all the tables in the database (based on your models)
with app.app_context():
    if not os.path.exists('database.db'):
        print("Database does not exist, creating...")
    db.create_all()


app.register_blueprint(user_api)

if __name__ == "__main__":
    app.run(debug=True)