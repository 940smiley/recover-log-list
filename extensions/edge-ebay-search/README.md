# Collectibles Edge eBay Bridge

This Microsoft Edge extension lets you right-click eBay listing images and push them into the Collectibles Log app, linking them to an item, enriching metadata, and optionally adding the image to the training ingest folder.

## Install locally
1. Build/run the backend so `http://localhost:8000` is available (or update the API base in the options page).
2. In Edge, navigate to `edge://extensions`, enable **Developer mode**, and choose **Load unpacked**.
3. Select the `extensions/edge-ebay-search` folder from this repository.

## Configure
- Open the extension options.
- Set **API base URL** (e.g., `http://localhost:8000`).
- Set **Target item ID** for the item that should receive updates.
- Toggle **Add to training ingest** if the downloaded image should be saved into `data/training_ingest`.
- Toggle **Trigger training** and provide a YOLO `data.yaml` path when you want to start training immediately after ingest.

## Usage
1. Browse to an eBay listing or search results page.
2. Right-click an image and choose **Send eBay image to Collectibles Log**.
3. The extension scrapes the title, price, and top specs, then POSTs to `/integrations/edge-ebay/link` to update the item and store a training copy.

## Data flow
- **Content script** scrapes title/price/specs.
- **Background service worker** builds the payload and calls the FastAPI endpoint.
- **Backend** downloads the image into `data/logs`, links it to the item, ensures tags, and optionally saves a training copy and starts training when requested.
