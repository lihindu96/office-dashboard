import os

cred_path = os.path.join(os.path.dirname(__file__), "firebase_credentials.json")
print("Looking for file at:", cred_path)
print("Exists?", os.path.exists(cred_path))
