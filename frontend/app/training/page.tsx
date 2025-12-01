'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function TrainingPage() {
    const [config, setConfig] = useState({
        data_path: '',
        epochs: 10,
        batch_size: 16,
        model_name: 'yolov8n.pt'
    });
    const [status, setStatus] = useState<any>(null);
    const [models, setModels] = useState<any[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchStatus();
        fetchModels();
        const interval = setInterval(fetchStatus, 2000); // Poll status every 2s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Scroll logs to bottom
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const fetchStatus = async () => {
        try {
            const response = await fetch('http://localhost:8000/training/status');
            const data = await response.json();
            setStatus(data);
            if (data.logs) {
                setLogs(data.logs);
            }
        } catch (error) {
            console.error('Error fetching status:', error);
        }
    };

    const fetchModels = async () => {
        try {
            const response = await fetch('http://localhost:8000/training/models');
            const data = await response.json();
            setModels(data);
        } catch (error) {
            console.error('Error fetching models:', error);
        }
    };

    const handleStart = async () => {
        try {
            const response = await fetch('http://localhost:8000/training/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });

            if (!response.ok) {
                const error = await response.json();
                alert(`Error: ${error.detail}`);
            }
        } catch (error) {
            console.error('Error starting training:', error);
            alert('Failed to start training');
        }
    };

    const handleStop = async () => {
        try {
            await fetch('http://localhost:8000/training/stop', { method: 'POST' });
        } catch (error) {
            console.error('Error stopping training:', error);
        }
    };

    return (
        <div className="p-6">
            {/* Breadcrumb Navigation */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
                <Link href="/" className="text-blue-600 hover:underline">Dashboard</Link>
                <span className="text-gray-400">/</span>
                <Link href="/gallery" className="text-blue-600 hover:underline">Gallery</Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">Training</span>
            </nav>

            <h1 className="text-3xl font-bold mb-6">AI Model Training</h1>

            <div className="grid grid-cols-2 gap-6">
                {/* Configuration */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Configuration</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Dataset Path (data.yaml)</label>
                            <input
                                type="text"
                                value={config.data_path}
                                onChange={(e) => setConfig({ ...config, data_path: e.target.value })}
                                placeholder="e.g., C:/datasets/coco128.yaml"
                                className="w-full px-4 py-2 border rounded"
                                disabled={status?.is_training}
                            />
                            <p className="text-xs text-gray-500 mt-1">Path to YOLO format dataset YAML file</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Epochs</label>
                                <input
                                    type="number"
                                    value={config.epochs}
                                    onChange={(e) => setConfig({ ...config, epochs: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border rounded"
                                    disabled={status?.is_training}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Batch Size</label>
                                <input
                                    type="number"
                                    value={config.batch_size}
                                    onChange={(e) => setConfig({ ...config, batch_size: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border rounded"
                                    disabled={status?.is_training}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Base Model</label>
                            <select
                                value={config.model_name}
                                onChange={(e) => setConfig({ ...config, model_name: e.target.value })}
                                className="w-full px-4 py-2 border rounded"
                                disabled={status?.is_training}
                            >
                                <option value="yolov8n.pt">YOLOv8 Nano (Fastest)</option>
                                <option value="yolov8s.pt">YOLOv8 Small</option>
                                <option value="yolov8m.pt">YOLOv8 Medium</option>
                                <option value="yolov8l.pt">YOLOv8 Large</option>
                                <option value="yolov8x.pt">YOLOv8 XLarge (Most Accurate)</option>
                            </select>
                        </div>

                        <div className="pt-4">
                            {status?.is_training ? (
                                <button
                                    onClick={handleStop}
                                    className="w-full px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                                >
                                    Stop Training
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleStart}
                                        className="w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium mb-2"
                                    >
                                        Start Training
                                    </button>
                                    <Link href="/training/dataset">
                                        <button className="w-full px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 font-medium">
                                            📝 Annotate Dataset
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status & Logs */}
                <div className="bg-white rounded-lg shadow p-6 flex flex-col h-[600px]">
                    <h2 className="text-xl font-semibold mb-4">Training Status</h2>

                    <div className="mb-6">
                        <div className="flex justify-between mb-2">
                            <span className="font-medium">Status:</span>
                            <span className={`font-bold ${status?.status === 'training' ? 'text-blue-600' :
                                status?.status === 'completed' ? 'text-green-600' :
                                    status?.status === 'error' ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                {status?.status?.toUpperCase() || 'IDLE'}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${status?.progress || 0}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-sm text-gray-600">
                            <span>Epoch: {status?.current_epoch || 0} / {status?.total_epochs || 0}</span>
                            <span>{Math.round(status?.progress || 0)}%</span>
                        </div>
                    </div>

                    <div className="flex-1 bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-y-auto">
                        {logs.length === 0 ? (
                            <p className="text-gray-500 italic">No logs available...</p>
                        ) : (
                            logs.map((log, idx) => (
                                <div key={idx} className="mb-1">{log}</div>
                            ))
                        )}
                        <div ref={logsEndRef} />
                    </div>
                </div>
            </div>

            {/* Available Models */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Custom Models</h2>
                {models.length === 0 ? (
                    <p className="text-gray-500">No custom models found yet.</p>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {models.map((model, idx) => (
                            <div key={idx} className="border rounded p-4 flex items-center gap-4">
                                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded flex items-center justify-center font-bold">
                                    AI
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{model.name}</div>
                                    <div className="text-xs text-gray-500">{(model.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
