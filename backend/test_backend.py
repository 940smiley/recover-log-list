import requests

BASE_URL = "http://127.0.0.1:8000"

def test_root():
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Root endpoint: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Root endpoint failed: {e}")

def test_files_list():
    try:
        # Test listing current directory
        response = requests.get(f"{BASE_URL}/files/list?path=.")
        print(f"Files list endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"Found {len(response.json())} items")
    except Exception as e:
        print(f"Files list endpoint failed: {e}")

if __name__ == "__main__":
    test_root()
    test_files_list()
