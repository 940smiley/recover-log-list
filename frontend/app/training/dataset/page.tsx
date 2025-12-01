'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
}

interface AnnotatedImage {
    path: string;
    boxes: BoundingBox[];
}

export default function DatasetPage() {
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [annotations, setAnnotations] = useState<Map<string, BoundingBox[]>>(new Map());
    const [currentLabel, setCurrentLabel] = useState('');
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentBox, setCurrentBox] = useState<BoundingBox | null>(null);
    const [localPath, setLocalPath] = useState('');
    const [sourceType, setSourceType] = useState<'local' | 'cloud'>('local');
    const [cloudRemotes, setCloudRemotes] = useState<any[]>([]);
    const [selectedRemote, setSelectedRemote] = useState('');
    const [cloudPath, setCloudPath] = useState('');
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const [tagConfidences, setTagConfidences] = useState<{ [key: string]: number }>({});
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const loadCloudRemotes = async () => {
        try {
            const response = await fetch('http://localhost:8000/cloud/remotes');
            const data = await response.json();
            setCloudRemotes(data);
        } catch (error) {
            console.error('Error loading cloud remotes:', error);
        }
    };

    const loadImages = async () => {
        try {
            let response;
            if (sourceType === 'local') {
                response = await fetch(`http://localhost:8000/files/list?path=${encodeURIComponent(localPath)}`);
            } else {
                response = await fetch(`http://localhost:8000/cloud/files?remote=${selectedRemote}&path=${encodeURIComponent(cloudPath)}`);
            }
            const data = await response.json();
            const imageFiles = data
                .filter((f: any) => !f.is_dir && /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name))
                .map((f: any) => f.path);
            setImages(imageFiles);
            setCurrentIndex(0);
        } catch (error) {
            console.error('Error loading images:', error);
            alert('Error loading images from directory');
        }
    };

    const loadAISuggestions = async () => {
        if (images.length === 0 || currentIndex < 0) return;
        
        setIsLoadingSuggestions(true);
        try {
            // Fetch the image file
            const imagePath = images[currentIndex];
            const imageUrl = sourceType === 'local' 
                ? `http://localhost:8000/files/serve?path=${encodeURIComponent(imagePath)}`
                : `http://localhost:8000/cloud/serve?remote=${selectedRemote}&path=${encodeURIComponent(imagePath)}`;
            
            const imageResponse = await fetch(imageUrl);
            if (!imageResponse.ok) {
                throw new Error(`Failed to load image: ${imageResponse.statusText}`);
            }
            const imageBlob = await imageResponse.blob();
            
            // Send to AI detection
            const formData = new FormData();
            formData.append('file', imageBlob);
            
            const aiResponse = await fetch('http://localhost:8000/ai/detect', {
                method: 'POST',
                body: formData
            });
            
            if (!aiResponse.ok) {
                throw new Error(`AI detection failed: ${aiResponse.statusText}`);
            }
            
            const detections = await aiResponse.json();
            if (!Array.isArray(detections) || detections.length === 0) {
                // If no objects detected, return a helpful message
                setSuggestedTags([]);
                return;
            }
            
            // Group detections by label and count confidence
            const labelGroups: { [key: string]: number[] } = {};
            detections.forEach((d: any) => {
                if (!labelGroups[d.label]) {
                    labelGroups[d.label] = [];
                }
                labelGroups[d.label].push(d.confidence || 0);
            });
            
            // Sort by average confidence
            const tagsWithConfidence = Object.entries(labelGroups)
                .map(([label, confidences]) => ({
                    label,
                    confidence: confidences.reduce((a, b) => a + b, 0) / confidences.length
                }))
                .sort((a, b) => b.confidence - a.confidence);
            
            
            // Store confidence scores
            const confidenceMap: { [key: string]: number } = {};
            tagsWithConfidence.forEach(item => {
                confidenceMap[item.label] = item.confidence;
            });
            
            setSuggestedTags(tagsWithConfidence.map(item => item.label));
            setTagConfidences(confidenceMap);
        } catch (error) {
            console.error('Error loading AI suggestions:', error);
            setSuggestedTags([]);
            // Re-throw to let the UI know there was an error
            throw error;
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        const image = imageRef.current;
        if (!canvas || !image || !image.complete) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match image
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        // Draw image
        ctx.drawImage(image, 0, 0);

        // Draw existing boxes
        const currentImage = images[currentIndex];
        const boxes = annotations.get(currentImage) || [];

        boxes.forEach(box => {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 3;
            ctx.strokeRect(box.x, box.y, box.width, box.height);

            // Draw label
            ctx.fillStyle = '#00ff00';
            ctx.font = '16px Arial';
            ctx.fillText(box.label, box.x, box.y - 5);
        });

        // Draw current box being drawn
        if (currentBox) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
            ctx.setLineDash([]);
        }
    };

    useEffect(() => {
        drawCanvas();
    }, [currentIndex, annotations, currentBox, images]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!currentLabel) {
            alert('Please enter a label first');
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        setIsDrawing(true);
        setStartPos({ x, y });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const width = x - startPos.x;
        const height = y - startPos.y;

        setCurrentBox({
            x: width > 0 ? startPos.x : x,
            y: height > 0 ? startPos.y : y,
            width: Math.abs(width),
            height: Math.abs(height),
            label: currentLabel
        });

        drawCanvas();
    };

    const handleMouseUp = () => {
        if (!isDrawing || !currentBox) return;

        const currentImage = images[currentIndex];
        const existingBoxes = annotations.get(currentImage) || [];
        const newAnnotations = new Map(annotations);
        newAnnotations.set(currentImage, [...existingBoxes, currentBox]);
        setAnnotations(newAnnotations);

        setIsDrawing(false);
        setCurrentBox(null);
    };

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleClearCurrent = () => {
        const currentImage = images[currentIndex];
        const newAnnotations = new Map(annotations);
        newAnnotations.delete(currentImage);
        setAnnotations(newAnnotations);
    };

    const handleExport = () => {
        // Convert annotations to YOLO format
        const yoloData: any[] = [];

        annotations.forEach((boxes, imagePath) => {
            boxes.forEach(box => {
                yoloData.push({
                    image: imagePath,
                    label: box.label,
                    x: box.x,
                    y: box.y,
                    width: box.width,
                    height: box.height
                });
            });
        });

        // Download as JSON
        const blob = new Blob([JSON.stringify(yoloData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'annotations.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
                <Link href="/" className="text-blue-600 hover:underline">Dashboard</Link>
                <span className="text-gray-400">/</span>
                <Link href="/training" className="text-blue-600 hover:underline">Training</Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">Dataset Annotation</span>
            </nav>

            <h1 className="text-3xl font-bold mb-6">Dataset Annotation</h1>

            <div className="grid grid-cols-3 gap-6">
                {/* Left Panel - Controls */}
                <div className="bg-white rounded-lg shadow p-6 space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Load Images</h2>
                        <div className="space-y-2">
                            <div className="flex gap-2 mb-2">
                                <button
                                    onClick={() => setSourceType('local')}
                                    className={`flex-1 px-3 py-2 rounded ${sourceType === 'local' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                >
                                    Local Files
                                </button>
                                <button
                                    onClick={() => { setSourceType('cloud'); loadCloudRemotes(); }}
                                    className={`flex-1 px-3 py-2 rounded ${sourceType === 'cloud' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                >
                                    Cloud Storage
                                </button>
                            </div>
                            
                            {sourceType === 'local' ? (
                                <input
                                    type="text"
                                    value={localPath}
                                    onChange={(e) => setLocalPath(e.target.value)}
                                    placeholder="Directory path (e.g., C:\\Images)"
                                    className="w-full px-4 py-2 border rounded"
                                />
                            ) : (
                                <>
                                    <select
                                        value={selectedRemote}
                                        onChange={(e) => setSelectedRemote(e.target.value)}
                                        className="w-full px-4 py-2 border rounded"
                                    >
                                        <option value="">Select Cloud Storage</option>
                                        {cloudRemotes.map((remote: any) => (
                                            <option key={remote.name} value={remote.name}>{remote.name} ({remote.type})</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        value={cloudPath}
                                        onChange={(e) => setCloudPath(e.target.value)}
                                        placeholder="Path (e.g., /Photos)"
                                        className="w-full px-4 py-2 border rounded"
                                    />
                                </>
                            )}
                            <button
                                onClick={loadImages}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Load Directory
                            </button>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Annotation</h2>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Object Label</label>
                            <input
                                type="text"
                                value={currentLabel}
                                onChange={(e) => setCurrentLabel(e.target.value)}
                                placeholder="e.g., comic_book, stamp"
                                className="w-full px-4 py-2 border rounded"
                            />
                            <p className="text-xs text-gray-500">
                                Enter label, then click and drag on image to draw bounding box
                            </p>
                            
                            <button
                                onClick={loadAISuggestions}
                                disabled={images.length === 0 || isLoadingSuggestions}
                                className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 text-sm"
                            >
                                {isLoadingSuggestions ? 'Loading...' : '🤖 Get AI Suggestions'}
                            </button>
                            
                            {suggestedTags.length > 0 && (
                                <div className="border rounded p-2">
                                    <p className="text-xs font-medium mb-1">Suggested Tags:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {suggestedTags.map((tag, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentLabel(tag)}
                                                className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 flex items-center gap-1"
                                                title={`Confidence: ${(tagConfidences[tag] || 0).toFixed(2)}`}
                                            >
                                                {tag}
                                                <span className="text-xs text-green-600">
                                                    ({(tagConfidences[tag] || 0).toFixed(2)})
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        <button
                                            onClick={() => {
                                                // Apply all suggested tags as labels
                                                const label = suggestedTags.join(', ');
                                                setCurrentLabel(label);
                                            }}
                                            className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                                        >
                                            Apply All
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSuggestedTags([]);
                                                setTagConfidences({});
                                            }}
                                            className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Progress</h2>
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="font-medium">Images:</span> {images.length > 0 ? `${currentIndex + 1} / ${images.length}` : '0 / 0'}
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">Annotated:</span> {annotations.size} images
                            </div>
                            <div className="text-sm">
                                <span className="font-medium">Current Boxes:</span> {annotations.get(images[currentIndex])?.length || 0}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <button
                            onClick={handleClearCurrent}
                            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Clear Current Annotations
                        </button>
                        <button
                            onClick={handleExport}
                            disabled={annotations.size === 0}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                        >
                            Export Annotations
                        </button>
                    </div>
                </div>

                {/* Center Panel - Canvas */}
                <div className="col-span-2 bg-white rounded-lg shadow p-6">
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Image Canvas</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                ← Previous
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentIndex >= images.length - 1}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Next →
                            </button>
                        </div>
                    </div>

                    {images.length > 0 ? (
                        <div className="relative border-2 border-gray-300 rounded overflow-hidden">
                            <img
                                ref={imageRef}
                                src={sourceType === 'local' 
                                    ? `http://127.0.0.1:8000/files/serve?path=${encodeURIComponent(images[currentIndex])}`
                                    : `http://127.0.0.1:8000/cloud/serve?remote=${selectedRemote}&path=${encodeURIComponent(images[currentIndex])}`
                                }
                                alt="Annotation target"
                                onLoad={drawCanvas}
                                className="hidden"
                            />
                            <canvas
                                ref={canvasRef}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                className="w-full cursor-crosshair"
                            />
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded p-12 text-center text-gray-500">
                            <p>Load a directory to start annotating images</p>
                        </div>
                    )}

                    {images.length > 0 && (
                        <div className="mt-4 text-sm text-gray-600">
                            <p className="font-medium">Current Image:</p>
                            <p className="truncate">{images[currentIndex]}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
