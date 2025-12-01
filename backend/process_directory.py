import requests
import os

API_URL = "http://127.0.0.1:8000"
SOURCE_DIR = r"I:\C&D PHOTOS\phil"

def process_images():
    # 1. Get list of image files
    image_files = []
    if os.path.exists(SOURCE_DIR):
        for root, dirs, files in os.walk(SOURCE_DIR):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp')):
                    image_files.append(os.path.join(root, file))
    else:
        print(f"Directory not found: {SOURCE_DIR}")
        return

    with open("output.log", "w") as log:
        log.write(f"Found {len(image_files)} images.\n")
        
        if not image_files:
            log.write("No images found to process.\n")
            return

        # 2. Prepare payload
        # We send 'files' as a list of strings. requests handles lists in 'data' by repeating the key.
        payload = {
            "category_name": "Phil Photos",
            "delete_original": "false",
            "batch_process": "true",
            "files": image_files
        }
        
        log.write("Sending request to import items...\n")
        try:
            response = requests.post(f"{API_URL}/items/import", data=payload)
            
            if response.status_code == 200:
                result = response.json()
                log.write(f"Success! Imported {result.get('imported_count')} items.\n")
                for item in result.get('items', []):
                    log.write(f" - Imported: {item['name']} (ID: {item['item_id']})\n")
            else:
                log.write(f"Error: {response.status_code} - {response.text}\n")
                
        except Exception as e:
            log.write(f"Failed to send request: {e}\n")

if __name__ == "__main__":
    process_images()
