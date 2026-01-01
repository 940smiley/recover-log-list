function scrapeSpecs() {
  const rows = Array.from(document.querySelectorAll('table tr, li.s-item__detail')).slice(0, 6);
  return rows
    .map((row) => {
      const cells = row.querySelectorAll('th, td, span');
      if (cells.length >= 2) {
        return { key: cells[0].textContent.trim(), value: cells[1].textContent.trim() };
      }
      const text = row.textContent?.trim();
      if (!text) return null;
      const parts = text.split(':');
      if (parts.length === 2) return { key: parts[0].trim(), value: parts[1].trim() };
      return null;
    })
    .filter(Boolean);
}

function scrapePrice() {
  const priceEl =
    document.querySelector('[itemprop="price"]') ||
    document.querySelector('[data-testid="x-price-primary"]') ||
    document.querySelector('.x-price') ||
    document.querySelector('.s-item__price');

  const raw = priceEl?.textContent?.replace(/[^0-9.,]/g, '');
  if (!raw) return { price: null, currency: null };
  const price = parseFloat(raw.replace(',', ''));
  const currencyMatch = priceEl?.textContent?.match(/[€$£]/);
  const currency = currencyMatch ? currencyMatch[0] : null;
  return { price, currency };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== 'COLLECT_EBAY_METADATA') return;

  const title =
    document.querySelector('#itemTitle')?.textContent?.replace('Details about', '').trim() ||
    document.querySelector('[data-testid="x-item-title"]')?.textContent?.trim() ||
    document.querySelector('h1')?.textContent?.trim() ||
    document.title;

  const description = document.querySelector('#desc_div, #desc_ifr')?.textContent?.trim() || '';
  const specs = scrapeSpecs();
  const { price, currency } = scrapePrice();
  const tags = specs.slice(0, 3).map((row) => row.key);

  sendResponse({
    title,
    description,
    specs,
    price,
    currency,
    tags,
    listingUrl: message.listingUrl,
    imageUrl: message.imageUrl
  });
});
