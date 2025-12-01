'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GalleryPage() {
    const [filter, setFilter] = useState('all');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Magazines', 'Comic Books', 'Stamps', 'Trading Cards', 'Coins'];

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:8000/items/');
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            {/* Breadcrumb Navigation */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
                <Link href="/" className="text-blue-600 hover:underline">Dashboard</Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">Gallery</span>
            </nav>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gallery</h1>
                <Link href="/import" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    + Import Items
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                            className="w-full px-4 py-2 border rounded"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Search</label>
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>Loading items...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg mb-2">No items yet</p>
                        <p className="text-sm mb-4">Import some items to get started</p>
                        <Link href="/import" className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Go to Import
                        </Link>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-gray-600 mb-4">{items.length} items</p>
                        <div className="grid grid-cols-4 gap-6">
                            {items.map((item) => (
                                <Link key={item.id} href={`/items/${item.id}`}>
                                    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer">
                                        <div className="aspect-square bg-gray-200 flex items-center justify-center overflow-hidden">
                                            {item.images && item.images.length > 0 ? (
                                                <img
                                                    src={`http://localhost:8000/images/${item.images[0].filename}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-gray-400">No Preview</span>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold truncate">{item.name}</h3>
                                            <p className="text-sm text-gray-600 truncate">{item.description || 'No description'}</p>
                                            <div className="mt-2 flex gap-2">
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    ID: {item.id}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
