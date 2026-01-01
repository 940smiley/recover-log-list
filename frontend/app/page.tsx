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

    const LoadingState = () => (
        <div className="p-10">
            <div className="animate-pulse space-y-6">
                <div className="h-10 bg-white/60 rounded-2xl"></div>
                <div className="grid grid-cols-4 gap-6">
                    {[...Array(4)].map((_, idx) => (
                        <div key={idx} className="h-32 rounded-2xl bg-white/70"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <LoadingState />;
    }

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-white/70 p-8 shadow-lg shadow-blue-500/5 border border-white/40">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-900/5" />
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-2">Welcome back</p>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Keep your collectibles serene and organized.</h1>
                        <p className="mt-3 text-slate-600 max-w-2xl">
                            Monitor AI detections, curate galleries, and guide your training data with a calm, swan-like workflow.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/import"
                            className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-white font-semibold shadow-lg shadow-blue-500/30"
                        >
                            Start importing
                        </Link>
                        <Link
                            href="/training"
                            className="rounded-full px-5 py-3 border border-blue-100 bg-white text-blue-700 font-semibold hover:border-blue-200"
                        >
                            View training
                        </Link>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[{
                    label: 'Total Items',
                    value: stats?.total_items || 0,
                    accent: 'from-blue-500 to-indigo-500',
                }, {
                    label: 'Categories',
                    value: stats?.total_categories || 0,
                    accent: 'from-emerald-500 to-teal-500',
                }, {
                    label: 'Images',
                    value: stats?.total_images || 0,
                    accent: 'from-purple-500 to-fuchsia-500',
                }, {
                    label: 'Tags',
                    value: stats?.total_tags || 0,
                    accent: 'from-amber-500 to-orange-500',
                }].map((card) => (
                    <div
                        key={card.label}
                        className="relative overflow-hidden rounded-2xl border border-white/50 bg-white/70 p-5 shadow-md shadow-slate-900/5"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br opacity-10 ${card.accent.startsWith('from-') ? card.accent : 'from-blue-500 to-indigo-500'}`} />
                        <div className="relative">
                            <p className="text-sm text-slate-500">{card.label}</p>
                            <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
                            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                <span>Live</span>
                                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Items */}
                <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md shadow-slate-900/5">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-[0.2em]">Activity</p>
                            <h2 className="text-xl font-semibold text-slate-900">Recent items</h2>
                        </div>
                        <Link href="/gallery" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                            View gallery
                        </Link>
                    </div>
                    {stats?.recent_items && stats.recent_items.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {stats.recent_items.map((item: any) => (
                                <Link key={item.id} href={`/items/${item.id}`} className="block py-3 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-100" />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-slate-900 truncate group-hover:text-blue-700 transition-colors">{item.name}</div>
                                            <div className="text-sm text-slate-500 truncate">{item.description || 'No description'}</div>
                                        </div>
                                        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">#{item.id}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-500">
                            <p className="mb-2">No items yet</p>
                            <Link href="/import" className="text-blue-600 hover:underline font-semibold">
                                Import your first item
                            </Link>
                        </div>
                    )}
                </div>

                {/* Category Statistics */}
                <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md shadow-slate-900/5">
                    <p className="text-xs text-slate-500 uppercase tracking-[0.2em]">Distribution</p>
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Items by category</h2>
                    {stats?.category_stats && stats.category_stats.length > 0 ? (
                        <div className="space-y-3">
                            {stats.category_stats.map((cat: any, idx: number) => (
                                <div key={idx} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm text-slate-700">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                            <span className="font-medium">{cat.category}</span>
                                        </div>
                                        <span className="font-semibold text-slate-900">{cat.count}</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                                            style={{ width: `${Math.min(100, cat.count * 10)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-500">
                            <p>No categories yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md shadow-slate-900/5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-[0.2em]">Shortcuts</p>
                        <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
                    </div>
                    <span className="text-xs text-slate-500">Designed for flow</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                    <Link
                        href="/import"
                        className="group rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-5 shadow-sm shadow-blue-500/10"
                    >
                        <div className="text-2xl mb-3">📥</div>
                        <div className="font-semibold text-slate-900">Import items</div>
                        <p className="text-sm text-slate-500">Stream files into your logbook instantly.</p>
                    </Link>
                    <Link
                        href="/gallery"
                        className="group rounded-2xl border border-slate-100 bg-white px-4 py-5 shadow-sm hover:shadow-lg transition-all"
                    >
                        <div className="text-2xl mb-3">🖼️</div>
                        <div className="font-semibold text-slate-900">View gallery</div>
                        <p className="text-sm text-slate-500">See every collectible in a calm grid.</p>
                    </Link>
                    <div className="group rounded-2xl border border-slate-100 bg-white px-4 py-5 shadow-sm hover:shadow-lg transition-all cursor-pointer">
                        <div className="text-2xl mb-3">🏷️</div>
                        <div className="font-semibold text-slate-900">Manage categories</div>
                        <p className="text-sm text-slate-500">Shape taxonomy for precise training.</p>
                    </div>
                    <div className="group rounded-2xl border border-slate-100 bg-white px-4 py-5 shadow-sm hover:shadow-lg transition-all cursor-pointer">
                        <div className="text-2xl mb-3">⚙️</div>
                        <div className="font-semibold text-slate-900">Settings</div>
                        <p className="text-sm text-slate-500">Adjust preferences and automations.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
