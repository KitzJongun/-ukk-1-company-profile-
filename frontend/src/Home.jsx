import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [services, setServices] = useState([]);
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/services').then(res => setServices(res.data));
    axios.get('http://127.0.0.1:8000/api/portfolios').then(res => setPortfolios(res.data));
  }, []);

  return (
    <div>
      <header className="bg-blue-600 text-white py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">We Help Great Companies Grow Up</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">Solusi digital terbaik untuk bisnis Anda.</p>
          <Link to="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg inline-block">Mulai Sekarang</Link>
        </div>
      </header>

      <section className="py-20 container mx-auto px-6">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">Layanan Kami</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.slice(0, 3).map((s) => (
            <div key={s.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition">
              {s.icon_url ? <img src={`http://127.0.0.1:8000/storage/${s.icon_url}`} className="w-14 h-14 object-cover rounded-lg mb-4" alt="" /> : <div className="w-14 h-14 bg-blue-100 rounded-lg mb-4"></div>}
              <h4 className="text-xl font-bold text-gray-800 mb-2">{s.title}</h4>
              <p className="text-gray-600">{s.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8"><Link to="/services" className="text-blue-600 font-bold hover:underline">Lihat Semua Layanan &rarr;</Link></div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">Portofolio Terbaru</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolios.slice(0, 3).map((p) => (
              <div key={p.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
                {p.main_image_url ? <img src={`http://127.0.0.1:8000/storage/${p.main_image_url}`} className="h-48 w-full object-cover" alt="" /> : <div className="h-48 bg-gray-200"></div>}
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{p.title}</h4>
                  <p className="text-gray-600 text-sm">{p.short_description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8"><Link to="/portfolio" className="text-blue-600 font-bold hover:underline">Lihat Semua Portofolio &rarr;</Link></div>
        </div>
      </section>
    </div>
  );
}