# controller/userController.py

from flask import request, Blueprint, jsonify
from services.user import *

user_api = Blueprint("user_api", __name__)

@user_api.route('/addUser', methods=['POST'])
def addUser_route():
    userData = request.json
    
    if not userData.get('firstname') or not userData.get('lastname') or not userData.get('email') or not userData.get('address'):
        return jsonify({"message": "Missing required fields"}), 400

    # Call the service method to add the user
    user = add_user(userData)

    if user:
        return jsonify({"message": f"User {user.firstname} {user.lastname} added successfully!"}), 201
    else:
        return jsonify({"message": "Failed to add user"}), 500



@user_api.route('/getUsers', methods=['GET'])
def get_users():
    users = get_all_users()
    if users:
        return jsonify([{
            'id': user.id,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'email': user.email,
            'address': user.address
        } for user in users]), 200
    else:
        return jsonify({"message": "Failed to retrieve users"}), 500



@user_api.route('/updateUser/<int:user_id>', methods=['PUT'])
def update_user_route(user_id):
    userData = request.json
    
    # Validate required fields
    if not userData.get('firstname') or not userData.get('lastname') or not userData.get('email') or not userData.get('address'):
        return jsonify({"message": "Missing required fields"}), 400

    user = update_user(user_id, userData)
    
    if user:
        return jsonify({"message": f"User {user.firstname} {user.lastname} updated successfully!"}), 200
    else:
        return jsonify({"message": "User not found or failed to update"}), 404



@user_api.route('/deleteUser/<int:user_id>', methods=['DELETE'])
def delete_user_route(user_id):
    user = delete_user(user_id)
    
    if user:
        return jsonify({"message": f"User {user.firstname} {user.lastname} deleted successfully!"}), 200
    else:
        return jsonify({"message": "User not found or failed to delete"}), 404
