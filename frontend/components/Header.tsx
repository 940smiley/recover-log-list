const Header = () => {
    return (
        <header className="h-16 bg-white/80 backdrop-blur-xl flex items-center justify-between px-8 ml-64 border-b border-slate-200 shadow-sm">
            <h1 className="text-lg font-semibold text-slate-800 tracking-tight">Your collection, perfectly balanced.</h1>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-500">
                    <span className="text-lg">🔍</span>
                    <input
                        type="text"
                        placeholder="Quick search"
                        className="bg-transparent outline-none placeholder:text-slate-400 text-slate-700"
                        value=""
                        onChange={() => {}}
                        maxLength={100}
                    />
                </div>
                <button className="rounded-full px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/20">
                    New entry
                </button>
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full border border-white shadow-inner" />
            </div>
        </header>
    );
};

export default Header;
