import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className="h-screen w-64 bg-gray-900 text-white fixed left-0 top-0 flex flex-col p-4">
            <div className="text-2xl font-bold mb-8 text-center">Log Book</div>
            <nav className="flex-1">
                <ul className="space-y-4">
                    <li>
                        <Link href="/" className="block p-2 hover:bg-gray-800 rounded">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link href="/gallery" className="block p-2 hover:bg-gray-800 rounded">
                            Gallery
                        </Link>
                    </li>
                    <li>
                        <Link href="/import" className="block p-2 hover:bg-gray-800 rounded">
                            Import
                        </Link>
                    </li>
                    <li>
                        <Link href="/training" className="block p-2 hover:bg-gray-800 rounded">
                            Training
                        </Link>
                    </li>
                    <li>
                        <Link href="/settings" className="block p-2 hover:bg-gray-800 rounded">
                            Settings
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
