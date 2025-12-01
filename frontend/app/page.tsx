'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:8000/stats/');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600 mb-2">Total Items</div>
                    <div className="text-3xl font-bold text-blue-600">{stats?.total_items || 0}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600 mb-2">Categories</div>
                    <div className="text-3xl font-bold text-green-600">{stats?.total_categories || 0}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600 mb-2">Images</div>
                    <div className="text-3xl font-bold text-purple-600">{stats?.total_images || 0}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600 mb-2">Tags</div>
                    <div className="text-3xl font-bold text-orange-600">{stats?.total_tags || 0}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Recent Items */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Recent Items</h2>
                        <Link href="/gallery" className="text-sm text-blue-600 hover:underline">
                            View All
                        </Link>
                    </div>
                    {stats?.recent_items && stats.recent_items.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recent_items.map((item: any) => (
                                <Link key={item.id} href={`/items/${item.id}`}>
                                    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded cursor-pointer">
                                        <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium truncate">{item.name}</div>
                                            <div className="text-sm text-gray-500 truncate">{item.description || 'No description'}</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p className="mb-2">No items yet</p>
                            <Link href="/import" className="text-blue-600 hover:underline">
                                Import your first item
                            </Link>
                        </div>
                    )}
                </div>

                {/* Category Statistics */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Items by Category</h2>
                    {stats?.category_stats && stats.category_stats.length > 0 ? (
                        <div className="space-y-3">
                            {stats.category_stats.map((cat: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                        <span>{cat.category}</span>
                                    </div>
                                    <span className="font-semibold">{cat.count}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No categories yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-4 gap-4">
                    <Link href="/import" className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center">
                        <div className="text-2xl mb-2">📥</div>
                        <div className="font-medium">Import Items</div>
                    </Link>
                    <Link href="/gallery" className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center">
                        <div className="text-2xl mb-2">🖼️</div>
                        <div className="font-medium">View Gallery</div>
                    </Link>
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center cursor-pointer">
                        <div className="text-2xl mb-2">🏷️</div>
                        <div className="font-medium">Manage Categories</div>
                    </div>
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-center cursor-pointer">
                        <div className="text-2xl mb-2">⚙️</div>
                        <div className="font-medium">Settings</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
