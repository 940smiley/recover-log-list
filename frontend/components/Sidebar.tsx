'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/', label: 'Dashboard', icon: '🦢' },
    { href: '/gallery', label: 'Gallery', icon: '🖼️' },
    { href: '/import', label: 'Import', icon: '📤' },
    { href: '/training', label: 'Training', icon: '🎯' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
];

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <div className="h-screen w-64 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white fixed left-0 top-0 flex flex-col p-5 shadow-2xl border-r border-white/10">
            <div className="text-2xl font-bold mb-10 text-center tracking-tight">
                <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white/5 px-3 py-2 backdrop-blur">
                    <span className="text-blue-200">Swan</span>
                    <span className="text-white">Logbook</span>
                </div>
            </div>
            <nav className="flex-1">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={[
                                        "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 border border-transparent hover:border-white/10 hover:bg-white/5",
                                        isActive ? "bg-white/10 border-white/10 shadow-lg shadow-blue-500/10" : ""
                                    ].filter(Boolean).join(" ")}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="font-medium tracking-tight">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm text-slate-200">Curate, train, and track every collectible with serene clarity.</p>
            </div>
        </div>
    );
};

export default Sidebar;
