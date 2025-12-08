const DEFAULT_SETTINGS = {
  apiBase: 'http://localhost:8000',
  itemId: '',
  addToTraining: true,
  triggerTraining: false,
  trainingDataPath: ''
};

function restore() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (settings) => {
    document.getElementById('apiBase').value = settings.apiBase;
    document.getElementById('itemId').value = settings.itemId;
    document.getElementById('addToTraining').checked = settings.addToTraining;
    document.getElementById('triggerTraining').checked = settings.triggerTraining;
    document.getElementById('trainingDataPath').value = settings.trainingDataPath || '';
  });
}

function save() {
  const apiBase = document.getElementById('apiBase').value || DEFAULT_SETTINGS.apiBase;
  const itemId = document.getElementById('itemId').value;
  const addToTraining = document.getElementById('addToTraining').checked;
  const triggerTraining = document.getElementById('triggerTraining').checked;
  const trainingDataPath = document.getElementById('trainingDataPath').value;

  chrome.storage.sync.set(
    { apiBase, itemId, addToTraining, triggerTraining, trainingDataPath },
    () => {
      document.getElementById('status').textContent = 'Saved! You can now right-click images on eBay results.';
      setTimeout(() => (document.getElementById('status').textContent = ''), 2500);
    }
  );
}

restore();
document.getElementById('save').addEventListener('click', save);
