import { Link, Outlet, useLocation } from 'react-router-dom';

export default function PublicLayout() {
  const location = useLocation(); // Buat nandain menu mana yang aktif

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/contact', label: 'Contact Us' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">CompanyPro</Link>
          
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`font-medium transition ${location.pathname === link.path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link to="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
            Admin Login
          </Link>
        </div>
      </nav>

      {/* KONTEN HALAMAN (Home, About, dll akan masuk ke sini) */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 text-center mt-auto">
        <p className="opacity-75 mb-2">&copy; 2026 CompanyPro. All rights reserved.</p>
        <p className="text-sm text-gray-400">Dibuat untuk memenuhi UKK RPL</p>
      </footer>
    </div>
  );
}