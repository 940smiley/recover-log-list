'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ImportPage() {
    const [selectedSource, setSelectedSource] = useState<'local' | 'cloud' | 'upload'>('local');
    const [localPath, setLocalPath] = useState('');
    const [files, setFiles] = useState<any[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState<any>(null);
    const [category, setCategory] = useState('');
    const [deleteOriginal, setDeleteOriginal] = useState(false);

    const handleBrowseLocal = async () => {
        try {
            const response = await fetch(`http://localhost:8000/files/list?path=${encodeURIComponent(localPath)}`);
            const data = await response.json();
            setFiles(data.filter((f: any) => !f.is_dir && /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name)));
        } catch (error) {
            console.error('Error fetching files:', error);
            alert('Error browsing directory. Make sure the path is correct.');
        }
    };

    const toggleFileSelection = (path: string) => {
        const newSelection = new Set(selectedFiles);
        if (newSelection.has(path)) {
            newSelection.delete(path);
        } else {
            newSelection.add(path);
        }
        setSelectedFiles(newSelection);
    };

    const handleImport = async () => {
        if (selectedFiles.size === 0) return;

        setImporting(true);
        setImportResult(null);

        try {
            const formData = new FormData();
            selectedFiles.forEach(path => formData.append('files', path));
            if (category) formData.append('category_name', category);
            formData.append('delete_original', deleteOriginal.toString());
            formData.append('batch_process', 'true');

            const response = await fetch('http://localhost:8000/items/import', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            setImportResult(result);

            if (result.success) {
                // Clear selection after successful import
                setSelectedFiles(new Set());
                setFiles([]);
                setLocalPath('');
            }
        } catch (error) {
            console.error('Error importing:', error);
            alert('Error importing items. Check console for details.');
        } finally {
            setImporting(false);
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
                <span className="text-gray-600">Import</span>
            </nav>

            <h1 className="text-3xl font-bold mb-6">Import Items</h1>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setSelectedSource('local')}
                        className={`px-4 py-2 rounded ${selectedSource === 'local' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Local Directory
                    </button>
                    <button
                        onClick={() => setSelectedSource('cloud')}
                        className={`px-4 py-2 rounded ${selectedSource === 'cloud' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Cloud Storage
                    </button>
                    <button
                        onClick={() => setSelectedSource('upload')}
                        className={`px-4 py-2 rounded ${selectedSource === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Upload Files
                    </button>
                </div>

                {selectedSource === 'local' && (
                    <div>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={localPath}
                                onChange={(e) => setLocalPath(e.target.value)}
                                placeholder="Enter directory path (e.g., C:\\Pictures)"
                                className="flex-1 px-4 py-2 border rounded"
                            />
                            <button
                                onClick={handleBrowseLocal}
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Browse
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Category (optional)</label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="e.g., Comic Books, Stamps"
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>
                            <div className="flex items-end">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={deleteOriginal}
                                        onChange={(e) => setDeleteOriginal(e.target.checked)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm">Delete original files after import</span>
                                </label>
                            </div>
                        </div>

                        {files.length > 0 && (
                            <div>
                                <p className="mb-2 text-sm text-gray-600">Found {files.length} images</p>
                                <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                                    {files.map((file) => (
                                        <div
                                            key={file.path}
                                            onClick={() => toggleFileSelection(file.path)}
                                            className={`border rounded p-2 cursor-pointer ${selectedFiles.has(file.path) ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}
                                        >
                                            <div className="aspect-square bg-gray-200 rounded mb-2 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={`http://localhost:8000/files/serve?path=${encodeURIComponent(file.path)}`}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <p className="text-xs truncate">{file.name}</p>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    disabled={selectedFiles.size === 0 || importing}
                                    onClick={handleImport}
                                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                                >
                                    {importing ? 'Importing...' : `Import ${selectedFiles.size} Selected`}
                                </button>
                            </div>
                        )}

                        {importResult && (
                            <div className={`mt-4 p-4 rounded ${importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                <h3 className="font-semibold mb-2">
                                    {importResult.success ? '✓ Import Successful' : '✗ Import Failed'}
                                </h3>
                                <p className="text-sm">Imported {importResult.imported_count} items</p>
                                {importResult.items && (
                                    <ul className="mt-2 text-sm space-y-1">
                                        {importResult.items.map((item: any, idx: number) => (
                                            <li key={idx}>
                                                • {item.name} ({item.detections} objects detected)
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {selectedSource === 'cloud' && (
                    <div className="text-center py-12 text-gray-500">
                        <p>Cloud storage integration coming soon...</p>
                        <p className="text-sm mt-2">Configure Rclone to enable cloud storage access</p>
                    </div>
                )}

                {selectedSource === 'upload' && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                        <input type="file" multiple accept="image/*" className="hidden" id="file-upload" />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="text-gray-600">
                                <p className="text-lg mb-2">Drop files here or click to browse</p>
                                <p className="text-sm">Supports: JPG, PNG, GIF, WEBP</p>
                            </div>
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
}
