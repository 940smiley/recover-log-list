const Header = () => {
    return (
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 ml-64">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-gray-900">
                    Notifications
                </button>
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
        </header>
    );
};

export default Header;
