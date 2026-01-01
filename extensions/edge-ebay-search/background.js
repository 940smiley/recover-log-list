const DEFAULT_SETTINGS = {
  apiBase: 'http://localhost:8000',
  itemId: null,
  addToTraining: true,
  triggerTraining: false,
  trainingDataPath: ''
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'collectibles-send-image',
    title: 'Send eBay image to Collectibles Log',
    contexts: ['image'],
    documentUrlPatterns: ['*://*.ebay.com/*', '*://*.ebay.co.uk/*', '*://*.ebay.*/*']
  });

  chrome.storage.sync.get(DEFAULT_SETTINGS, (current) => {
    chrome.storage.sync.set({ ...DEFAULT_SETTINGS, ...current });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'collectibles-send-image' || !tab?.id) return;

  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  if (!settings.itemId) {
    chrome.notifications?.create({
      type: 'basic',
      iconUrl: 'icon-192.svg',
      title: 'Collectibles Log',
      message: 'Set a target item ID in extension options before sending images.'
    });
    return;
  }

  try {
    const metadata = await chrome.tabs.sendMessage(tab.id, {
      type: 'COLLECT_EBAY_METADATA',
      imageUrl: info.srcUrl,
      listingUrl: info.pageUrl
    });

    const payload = {
      item_id: Number(settings.itemId),
      title: metadata?.title || tab.title || 'eBay listing',
      listing_url: metadata?.listingUrl || info.pageUrl,
      price: metadata?.price,
      currency: metadata?.currency,
      image_url: info.srcUrl,
      description: metadata?.description,
      specs: metadata?.specs || [],
      tags: metadata?.tags || [],
      add_to_training: settings.addToTraining,
      trigger_training: settings.triggerTraining,
      training_data_path: settings.trainingDataPath || undefined
    };

    await fetch(`${settings.apiBase}/integrations/edge-ebay/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    chrome.notifications?.create({
      type: 'basic',
      iconUrl: 'icon-192.svg',
      title: 'Collectibles Log',
      message: 'Listing sent to your collection.'
    });
  } catch (error) {
    console.error('Edge bridge error', error);
    chrome.notifications?.create({
      type: 'basic',
      iconUrl: 'icon-192.svg',
      title: 'Collectibles Log',
      message: 'Failed to capture listing. Check console for details.'
    });
  }
});
