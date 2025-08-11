import firebase_admin
from firebase_admin import credentials, firestore
import os

# Get the directory of the current file (database.py)
current_dir = os.path.dirname(os.path.abspath(__file__))
# Construct the path to firebase_credentials.json relative to database.py
credentials_path = os.path.join(current_dir, 'firebase_credentials.json')

# Check if the credentials file exists
if not os.path.exists(credentials_path):
    raise FileNotFoundError(f"Firebase credentials file not found at: {credentials_path}")

try:
    # Initialize Firebase Admin SDK
    cred = credentials.Certificate(credentials_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase initialized successfully.")
except Exception as e:
    print(f"Error initializing Firebase: {e}")
    # Depending on your app, you might want to raise the exception or handle it differently
    raise