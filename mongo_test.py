from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

try:
    # Check if server is available
    server_info = client.server_info()
    print("✅ Connected to MongoDB. Server info:")
    print(server_info)

except Exception as e:
    print("❌ Failed to connect to MongoDB:", e)