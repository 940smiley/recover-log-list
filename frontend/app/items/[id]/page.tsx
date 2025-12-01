'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ItemDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        if (params.id) {
            fetchItem();
        }
    }, [params.id]);

    const fetchItem = async () => {
        try {
            const response = await fetch(`http://localhost:8000/items/${params.id}`);
            const data = await response.json();
            setItem(data);
            setFormData({ name: data.name, description: data.description || '' });
        } catch (error) {
            console.error('Error fetching item:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);

            const response = await fetch(`http://localhost:8000/items/${params.id}`, {
                method: 'PUT',
                body: formDataToSend,
            });

            if (response.ok) {
                await fetchItem();
                setEditing(false);
            }
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error updating item');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const response = await fetch(`http://localhost:8000/items/${params.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push('/gallery');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item');
        }
    };

    const handleReprocess = async () => {
        try {
            const response = await fetch(`http://localhost:8000/items/${params.id}/reprocess`, {
                method: 'POST',
            });

            if (response.ok) {
                await fetchItem();
                alert('Item reprocessed successfully');
            }
        } catch (error) {
            console.error('Error reprocessing item:', error);
            alert('Error reprocessing item');
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <p>Loading...</p>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="p-6">
                <p>Item not found</p>
                <Link href="/gallery" className="text-blue-600 hover:underline">Back to Gallery</Link>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Breadcrumb Navigation */}
            <nav className="mb-6 flex items-center gap-2 text-sm">
                <Link href="/" className="text-blue-600 hover:underline">Dashboard</Link>
                <span className="text-gray-400">/</span>
                <Link href="/gallery" className="text-blue-600 hover:underline">Gallery</Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">Item #{params.id}</span>
            </nav>

            <div className="mb-6">
                <Link href="/gallery" className="text-blue-600 hover:underline">← Back to Gallery</Link>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                        {editing ? (
                            <div>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="text-3xl font-bold border-b-2 border-blue-600 outline-none w-full mb-4"
                                />
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border rounded p-2"
                                    rows={3}
                                    placeholder="Description"
                                />
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
                                <p className="text-gray-600">{item.description || 'No description'}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {editing ? (
                            <>
                                <button
                                    onClick={handleUpdate}
                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditing(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleReprocess}
                                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                >
                                    Reprocess AI
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Images</h2>
                        {item.images && item.images.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {item.images.map((image: any) => (
                                    <div key={image.id} className="border rounded p-2">
                                        <div className="aspect-square bg-gray-200 rounded mb-2 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={`http://localhost:8000/images/${image.filename}`}
                                                alt={image.filename}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <p className="text-xs truncate">{image.filename}</p>
                                        {image.is_primary && (
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Primary</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No images</p>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Details</h2>
                        <dl className="space-y-2">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">ID</dt>
                                <dd className="text-sm">{item.id}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Category</dt>
                                <dd className="text-sm">{item.category?.name || 'Uncategorized'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Created</dt>
                                <dd className="text-sm">{new Date(item.created_at).toLocaleString()}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Updated</dt>
                                <dd className="text-sm">{new Date(item.updated_at).toLocaleString()}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}
