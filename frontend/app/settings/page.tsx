'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'models' | 'ebay' | 'general'>('models');
    const [modelSettings, setModelSettings] = useState({
        detection_model: 'yolov8n.pt',
        detection_confidence: 0.25,
        custom_model_path: ''
    });
    const [ebaySettings, setEbaySettings] = useState({
        app_id: '',
        cert_id: '',
        dev_id: '',
        user_token: '',
        sandbox_mode: true
    });

    const handleSaveModels = async () => {
        // TODO: Implement save to backend
        alert('Model settings saved (backend integration pending)');
    };

    const handleSaveEbay = async () => {
        // TODO: Implement save to backend
        alert('eBay settings saved (backend integration pending)');
    };

    return (
        <div className="p-6">
            {/* Breadcrumb Navigation */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
                <Link href="/" className="text-blue-600 hover:underline">Dashboard</Link>
                <span className="text-gray-400">/</span>
                <Link href="/gallery" className="text-blue-600 hover:underline">Gallery</Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">Settings</span>
            </nav>

            <h1 className="text-3xl font-bold mb-6">Settings</h1>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex gap-8 px-6">
                        <button
                            onClick={() => setActiveTab('models')}
                            className={`py-4 border-b-2 font-medium transition ${activeTab === 'models'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            AI Models
                        </button>
                        <button
                            onClick={() => setActiveTab('ebay')}
                            className={`py-4 border-b-2 font-medium transition ${activeTab === 'ebay'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            eBay API
                        </button>
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`py-4 border-b-2 font-medium transition ${activeTab === 'general'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            General
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {/* AI Models Tab */}
                    {activeTab === 'models' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">AI Model Configuration</h2>
                                <p className="text-sm text-gray-600 mb-6">
                                    Configure which AI models to use for object detection and image processing.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Detection Model</label>
                                <select
                                    value={modelSettings.detection_model}
                                    onChange={(e) => setModelSettings({ ...modelSettings, detection_model: e.target.value })}
                                    className="w-full px-4 py-2 border rounded"
                                >
                                    <option value="yolov8n.pt">YOLOv8 Nano (Fastest, Default)</option>
                                    <option value="yolov8s.pt">YOLOv8 Small</option>
                                    <option value="yolov8m.pt">YOLOv8 Medium</option>
                                    <option value="yolov8l.pt">YOLOv8 Large</option>
                                    <option value="yolov8x.pt">YOLOv8 XLarge (Most Accurate)</option>
                                    <option value="custom">Custom Model</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Larger models are more accurate but slower. Nano is recommended for most use cases.
                                </p>
                            </div>

                            {modelSettings.detection_model === 'custom' && (
                                <div>
                                    <label className="block text-sm font-medium mb-2">Custom Model Path</label>
                                    <input
                                        type="text"
                                        value={modelSettings.custom_model_path}
                                        onChange={(e) => setModelSettings({ ...modelSettings, custom_model_path: e.target.value })}
                                        placeholder="e.g., ../data/training_runs/custom_run/weights/best.pt"
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Path to your custom trained model file (.pt)
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Detection Confidence Threshold: {modelSettings.detection_confidence}
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="0.9"
                                    step="0.05"
                                    value={modelSettings.detection_confidence}
                                    onChange={(e) => setModelSettings({ ...modelSettings, detection_confidence: parseFloat(e.target.value) })}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>More detections (less accurate)</span>
                                    <span>Fewer detections (more accurate)</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleSaveModels}
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save Model Settings
                                </button>
                            </div>
                        </div>
                    )}

                    {/* eBay API Tab */}
                    {activeTab === 'ebay' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">eBay API Configuration</h2>
                                <p className="text-sm text-gray-600 mb-6">
                                    Configure your eBay Developer credentials to enable listing items directly to eBay.
                                    <a href="https://developer.ebay.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                                        Get API credentials →
                                    </a>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">App ID (Client ID)</label>
                                <input
                                    type="text"
                                    value={ebaySettings.app_id}
                                    onChange={(e) => setEbaySettings({ ...ebaySettings, app_id: e.target.value })}
                                    placeholder="Your eBay App ID"
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Cert ID (Client Secret)</label>
                                <input
                                    type="password"
                                    value={ebaySettings.cert_id}
                                    onChange={(e) => setEbaySettings({ ...ebaySettings, cert_id: e.target.value })}
                                    placeholder="Your eBay Cert ID"
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Dev ID</label>
                                <input
                                    type="text"
                                    value={ebaySettings.dev_id}
                                    onChange={(e) => setEbaySettings({ ...ebaySettings, dev_id: e.target.value })}
                                    placeholder="Your eBay Dev ID"
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">User Token (OAuth)</label>
                                <input
                                    type="password"
                                    value={ebaySettings.user_token}
                                    onChange={(e) => setEbaySettings({ ...ebaySettings, user_token: e.target.value })}
                                    placeholder="Your eBay User Token"
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="sandbox"
                                    checked={ebaySettings.sandbox_mode}
                                    onChange={(e) => setEbaySettings({ ...ebaySettings, sandbox_mode: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="sandbox" className="text-sm">
                                    Use Sandbox Mode (for testing)
                                </label>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleSaveEbay}
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save eBay Settings
                                </button>
                            </div>
                        </div>
                    )}

                    {/* General Tab */}
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">General Settings</h2>
                                <p className="text-sm text-gray-600 mb-6">
                                    General application preferences and configurations.
                                </p>
                            </div>

                            <div className="text-gray-500 text-center py-12">
                                <p>General settings coming soon...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
