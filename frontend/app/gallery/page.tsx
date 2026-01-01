'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const FALLBACK_IMAGE =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjZTFmMmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZjhmOWZmIi8+PC9saW5lYXJHcmFkaWVudD48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0idXJsKCNnKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjNjY3MDdmIiBmb250LXNpemU9IjIxIiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIHByZXZpZXcgbm90IGF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';

export default function GalleryPage() {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [columns, setColumns] = useState(3);
    const [viewDensity, setViewDensity] = useState<'comfortable' | 'compact'>('compact');
    const [error, setError] = useState<string | null>(null);
    const [autoOptimize, setAutoOptimize] = useState(true);
    const [imageFit, setImageFit] = useState<'cover' | 'contain'>('cover');
    const [showMetadata, setShowMetadata] = useState(true);
    const [profile, setProfile] = useState<'battery' | 'balanced' | 'performance'>('balanced');

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const saved = window.localStorage.getItem('gallery_preferences');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setColumns(parsed.columns ?? 3);
                setViewDensity(parsed.viewDensity ?? 'compact');
                setAutoOptimize(parsed.autoOptimize ?? true);
                setImageFit(parsed.imageFit ?? 'cover');
                setShowMetadata(parsed.showMetadata ?? true);
                setProfile(parsed.profile ?? 'balanced');
            } catch (error) {
                console.warn('Failed to parse gallery preferences:', error);
                // Clear invalid data
                window.localStorage.removeItem('gallery_preferences');
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const payload = {
            columns,
            viewDensity,
            autoOptimize,
            imageFit,
            showMetadata,
            profile,
        };
        window.localStorage.setItem('gallery_preferences', JSON.stringify(payload));
    }, [columns, viewDensity, autoOptimize, imageFit, showMetadata, profile]);

    useEffect(() => {
        if (!autoOptimize || typeof window === 'undefined') return;
        const width = window.innerWidth;
        // Use deviceMemory if available to bias density for higher-end devices
        const memory = (navigator as any).deviceMemory || 4;
        const performanceBonus = memory >= 12 ? 1 : memory >= 8 ? 0 : -1;

        const calculatedColumns = Math.max(
            2,
            Math.min(6, Math.floor(width / 280) + performanceBonus)
        );

        setColumns(calculatedColumns);
        setViewDensity(performanceBonus >= 0 ? 'compact' : 'comfortable');

        const derivedProfile = performanceBonus > 0 ? 'performance' : performanceBonus < 0 ? 'battery' : 'balanced';
        setProfile(derivedProfile);
    }, [autoOptimize]);

    const fetchItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/items/`);
            if (!response.ok) {
                throw new Error('Unable to load items');
            }
            const data = await response.json();
            setItems(data);
        } catch (error: any) {
            console.error('Error fetching items:', error);
            setError(error?.message || 'Unable to load items right now.');
        } finally {
            setLoading(false);
        }
    };

    const derivedCategories = useMemo(() => {
        const defaults = ['All'];
        const fromItems = Array.from(
            new Set(
                items
                    .map((item) => item.category?.name)
                    .filter((name: string | undefined) => Boolean(name))
                    .map((name: string) => name)
            )
        );
        return [...defaults, ...fromItems];
    }, [items]);

    const filteredItems = useMemo(() => {
        const normalizedFilter = filter.toLowerCase();
        const searchTerm = search.trim().toLowerCase();

        return items.filter((item) => {
            const matchesCategory =
                normalizedFilter === 'all'
                    ? true
                    : item.category?.name?.toLowerCase() === normalizedFilter;

            const searchableText = `${item.name || ''} ${item.description || ''} ${
                item.category?.name || ''
            }`.toLowerCase();
            const matchesSearch = searchTerm ? searchableText.includes(searchTerm) : true;

            return matchesCategory && matchesSearch;
        });
    }, [filter, items, search]);

    const cardPadding = viewDensity === 'compact' ? 'p-3' : 'p-4';
    const gridGap = viewDensity === 'compact' ? 'gap-4' : 'gap-6';

    const getPrimaryImage = (item: any) => {
        if (!item.images || item.images.length === 0) return null;
        return item.images.find((img: any) => img.is_primary) || item.images[0];
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

            <div className="bg-white rounded-lg shadow p-6 mb-6 space-y-4">
                <div className="flex flex-wrap gap-4">
                    <div className="min-w-[220px] flex-1">
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                            className="w-full px-4 py-2 border rounded"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            {derivedCategories.map((cat) => (
                                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="min-w-[260px] flex-1">
                        <label className="block text-sm font-medium mb-2">Search</label>
                        <input
                            type="text"
                            placeholder="Search items, descriptions, or categories"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full px-4 py-2 border rounded"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Optimization</span>
                        <label className="inline-flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={autoOptimize}
                                onChange={(e) => setAutoOptimize(e.target.checked)}
                            />
                            Auto tune layout
                        </label>
                        <select
                            className="px-2 py-1 border rounded text-sm"
                            value={profile}
                            onChange={(e) => {
                                const value = e.target.value as typeof profile;
                                setProfile(value);
                                if (value === 'battery') {
                                    setColumns(2);
                                    setViewDensity('comfortable');
                                } else if (value === 'performance') {
                                    setColumns(5);
                                    setViewDensity('compact');
                                } else {
                                    setColumns(3);
                                    setViewDensity('compact');
                                }
                                setAutoOptimize(false);
                            }}
                        >
                            <option value="battery">Battery saver</option>
                            <option value="balanced">Balanced</option>
                            <option value="performance">Performance</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Layout</span>
                        <div className="inline-flex rounded border overflow-hidden">
                            <button
                                className={`px-3 py-2 text-sm ${
                                    viewDensity === 'comfortable' ? 'bg-blue-50 text-blue-700' : 'bg-white'
                                }`}
                                onClick={() => setViewDensity('comfortable')}
                            >
                                Comfortable
                            </button>
                            <button
                                className={`px-3 py-2 text-sm border-l ${
                                    viewDensity === 'compact' ? 'bg-blue-50 text-blue-700' : 'bg-white'
                                }`}
                                onClick={() => setViewDensity('compact')}
                            >
                                Compact
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <label htmlFor="columns" className="text-sm font-medium text-gray-700">
                            Columns
                        </label>
                        <input
                            id="columns"
                            type="range"
                            min={2}
                            max={6}
                            value={columns}
                            onChange={(e) => setColumns(Number(e.target.value))}
                            className="w-32"
                        />
                        <span className="text-sm text-gray-600">{columns} per row</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700">Image fit</label>
                        <select
                            className="px-2 py-1 border rounded text-sm"
                            value={imageFit}
                            onChange={(e) => setImageFit(e.target.value as typeof imageFit)}
                        >
                            <option value="cover">Fill (crop edges)</option>
                            <option value="contain">Contain (show full image)</option>
                        </select>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={showMetadata}
                            onChange={(e) => setShowMetadata(e.target.checked)}
                        />
                        Show metadata chips
                    </label>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">
                        <p>Loading items...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-600">
                        <p className="font-semibold">{error}</p>
                        <button
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={fetchItems}
                        >
                            Retry
                        </button>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <p className="text-lg mb-2">No matching items</p>
                        <p className="text-sm mb-4">Try adjusting your filters or import something new.</p>
                        <Link href="/import" className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Go to Import
                        </Link>
                    </div>
                ) : (
                    <div>
                        <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
                            <p>{filteredItems.length} of {items.length} items</p>
                            <div className="flex flex-wrap gap-3 items-center">
                                {autoOptimize && (
                                    <span className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1 rounded">
                                        Optimized for {profile}
                                    </span>
                                )}
                                <button className="text-blue-600 hover:underline" onClick={fetchItems}>
                                    Refresh
                                </button>
                            </div>
                        </div>
                        <div
                            className={`grid ${gridGap}`}
                            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                        >
                            {filteredItems.map((item) => {
                                const primaryImage = getPrimaryImage(item);

                                return (
                                    <Link key={item.id} href={`/items/${item.id}`}>
                                        <div
                                            className={`border rounded-lg overflow-hidden bg-white hover:shadow-lg transition cursor-pointer ${
                                                viewDensity === 'compact' ? 'border-gray-200' : 'border-gray-300'
                                            }`}
                                        >
                                            <div className="relative aspect-[4/3] bg-gray-50 flex items-center justify-center overflow-hidden">
                                                {primaryImage ? (
                                                    <img
                                                        src={`${API_BASE}/images/${primaryImage.filename}`}
                                                        alt={item.name}
                                                        onError={(event) => {
                                                            const target = event.currentTarget as HTMLImageElement;
                                                            if (target.src !== FALLBACK_IMAGE) {
                                                                target.src = FALLBACK_IMAGE;
                                                            }
                                                        }}
                                                        loading="lazy"
                                                        className={`w-full h-full ${imageFit === 'contain' ? 'object-contain' : 'object-cover'} bg-white`}
                                                    />
                                                ) : (
                                                    <div className="text-gray-400 text-sm">No Preview</div>
                                                )}
                                            </div>
                                            <div className={`${cardPadding} space-y-2`}>
                                                <div className="flex items-center justify-between gap-2">
                                                    <h3 className="font-semibold truncate" title={item.name}>
                                                        {item.name}
                                                    </h3>
                                                    {item.category?.name && showMetadata && (
                                                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                            {item.category.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2 min-h-[38px]">
                                                    {item.description || 'No description yet'}
                                                </p>
                                                {showMetadata && (
                                                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">ID: {item.id}</span>
                                                        <span className="bg-gray-100 px-2 py-1 rounded">
                                                            {item.images?.length || 0} image{item.images?.length === 1 ? '' : 's'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
