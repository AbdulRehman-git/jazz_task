#services/user.py

from database import db, User

def add_user(user_data):
    try:
        new_user = User(
            firstname=user_data['firstname'],
            lastname=user_data['lastname'],
            email=user_data['email'],
            address=user_data['address']
        )

        db.session.add(new_user)
        db.session.commit()

        return new_user
    except Exception as e:
        db.session.rollback()
        print(f"Error in adding user: {e}")
        return None


def get_all_users():
    try:
        users = User.query.all()  # Fetch all users
        return users
    except Exception as e:
        print(f"Error fetching all users: {e}")
        return None


def update_user(user_id, user_data):
    try:
        user = User.query.get(user_id)
        if user:
            user.firstname = user_data.get('firstname', user.firstname)
            user.lastname = user_data.get('lastname', user.lastname)
            user.email = user_data.get('email', user.email)
            user.address = user_data.get('address', user.address)

            db.session.commit()
            return user
        else:
            return None
    except Exception as e:
        db.session.rollback()
        print(f"Error updating user with ID {user_id}: {e}")
        return None


def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return user
        else:
            return None
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting user with ID {user_id}: {e}")
        return None
