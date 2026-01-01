'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type StatSummary = {
    total_items: number;
    total_categories: number;
    total_images: number;
    total_tags: number;
    recent_items: {
        id: number | string;
        name: string;
        description?: string;
        created_at?: string;
    }[];
    category_stats: {
        category: string;
        count: number;
    }[];
};

const statIcons = ['📦', '🗂️', '🖼️', '🏷️'];

export default function DashboardPage() {
    const [stats, setStats] = useState<StatSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setError(null);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/stats/`);
            if (!response.ok) {
                throw new Error('Unable to load dashboard data');
            }
            const data = await response.json();
            setStats(data);
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError('We could not load your latest stats. Try again shortly.');
        } finally {
            setLoading(false);
        }
    };

    const statCards = useMemo(
        () => [
            { label: 'Total Items', value: stats?.total_items ?? 0, accent: 'from-sky-500/80 to-cyan-400/70', icon: statIcons[0] },
            { label: 'Categories', value: stats?.total_categories ?? 0, accent: 'from-emerald-500/80 to-green-400/70', icon: statIcons[1] },
            { label: 'Images', value: stats?.total_images ?? 0, accent: 'from-indigo-500/80 to-purple-400/70', icon: statIcons[2] },
            { label: 'Tags', value: stats?.total_tags ?? 0, accent: 'from-amber-500/80 to-orange-400/70', icon: statIcons[3] },
        ],
        [stats]
    );

    const hasCategories = stats?.category_stats && stats.category_stats.length > 0;
    const hasItems = stats?.recent_items && stats.recent_items.length > 0;

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-950 text-slate-100">
                <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
                    <div className="animate-pulse h-12 w-64 bg-slate-800 rounded-lg" />
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <div key={idx} className="h-28 rounded-2xl bg-slate-900/70 border border-slate-800" />
                        ))}
                    </div>
                    <div className="grid gap-4 lg:grid-cols-[1.6fr,1fr]">
                        <div className="h-72 rounded-2xl bg-slate-900/70 border border-slate-800" />
                        <div className="h-72 rounded-2xl bg-slate-900/70 border border-slate-800" />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100">
            <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
                <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Control Center</p>
                        <h1 className="text-3xl font-semibold mt-1 text-white">Collectible Intelligence Dashboard</h1>
                        <p className="text-slate-400 mt-1">Monitor imports, training activity, and your latest gallery updates.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/import"
                            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
                        >
                            <span>📥</span>
                            Import</Link>
                        <Link
                            href="/training/dataset"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
                        >
                            <span>🧠</span>
                            Train</Link>
                    </div>
                </header>

                {error && (
                    <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-100">
                        <div className="font-semibold mb-1">Heads up</div>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <div
                            key={stat.label}
                            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-slate-900/40"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-10`} />
                            <div className="relative flex items-start justify-between">
                                <div>
                                    <p className="text-slate-400 text-sm">{stat.label}</p>
                                    <p className="text-3xl font-semibold mt-1 text-white">{stat.value}</p>
                                </div>
                                <div className="text-2xl">{stat.icon}</div>
                            </div>
                        </div>
                    ))}
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-900/40">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Recent Activity</p>
                                <h2 className="text-xl font-semibold text-white">Latest imports</h2>
                            </div>
                            <Link href="/gallery" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
                                View gallery →
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
                        {hasItems ? (
                            <div className="space-y-3">
                                {stats?.recent_items?.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/items/${item.id}`}
                                        className="group flex items-center gap-4 rounded-xl border border-slate-800/70 bg-slate-950/60 p-4 transition hover:border-cyan-400/40 hover:bg-slate-900"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/20 text-lg">
                                            🧩
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-white truncate group-hover:text-cyan-100">{item.name}</p>
                                            <p className="text-sm text-slate-400 truncate">{item.description || 'No description yet.'}</p>
                                        </div>
                                        {item.created_at && (
                                            <span className="text-xs text-slate-500 whitespace-nowrap">{new Date(item.created_at).toLocaleDateString()}</span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800/80 bg-slate-950/60 py-14 text-center">
                                <p className="text-lg font-semibold text-white">No imports yet</p>
                                <p className="text-sm text-slate-400 mt-1">Bring your collectibles in to start the magic.</p>
                                <Link
                                    href="/import"
                                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-100 hover:bg-cyan-500/30"
                                >
                                    Begin import
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg shadow-slate-900/40">
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Distribution</p>
                        <h2 className="text-xl font-semibold text-white mt-1">Items by category</h2>
                        {hasCategories ? (
                            <div className="mt-5 space-y-3">
                                {stats?.category_stats?.map((cat) => (
                                    <div key={cat.category} className="space-y-1">
                                        <div className="flex justify-between text-sm text-slate-300">
                                            <span>{cat.category}</span>
                                            <span className="font-semibold text-white">{cat.count}</span>
                                        </div>
                                        <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                                                style={{ width: `${(cat.count / Math.max(...(stats?.category_stats?.map(c => c.count) || [1]))) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-6 rounded-xl border border-dashed border-slate-800/80 bg-slate-950/60 p-6 text-center text-slate-400">
                                <p className="font-semibold text-white">No categories yet</p>
                                <p className="text-sm mt-1">Create categories as you begin tagging your collection.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 shadow-lg shadow-slate-900/40">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Shortcuts</p>
                            <h2 className="text-xl font-semibold text-white">Keep your pipeline flowing</h2>
                            <p className="text-sm text-slate-400 mt-1">Jump into the most common actions for your collectible workflow.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <Link
                                href="/import"
                                className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-slate-900"
                            >
                                Import items
                            </Link>
                            <Link
                                href="/gallery"
                                className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-slate-900"
                            >
                                View gallery
                            </Link>
                            <Link
                                href="/items"
                                className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-slate-900"
                            >
                                Manage items
                            </Link>
                            <Link
                                href="/settings"
                                className="rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-slate-900"
                            >
                                Settings
                            </Link>
                        </div>
                    </div>
                </section>
                {/* Category Statistics */}
                <div className="rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md shadow-slate-900/5">
                    <p className="text-xs text-slate-500 uppercase tracking-[0.2em]">Distribution</p>
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Items by category</h2>
                    {stats?.category_stats && stats.category_stats.length > 0 ? (
                        (() => {
                            const maxCount = Math.max(...stats.category_stats.map((c: any) => c.count));
                            return (
                                <div className="space-y-4">
{categoryStats.map((cat) => {
  const widthPercentage = maxCount > 0 ? (cat.count / maxCount) * 100 : 0;
  return (
    <div key={cat.category} className="space-y-2">
      {/* ... rest of component */}
    </div>
  );
})}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                                        <span>{cat.category}</span>
                                                    </div>
                                                    <span className="font-semibold">{cat.count}</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${widthPercentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
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
                                            style={{ width: `${Math.min(100, Math.max(0, (cat.count || 0) * 10))}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })()
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
        </main>
    );
}
