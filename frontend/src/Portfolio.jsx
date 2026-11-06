import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Portfolio() {
  const [portfolios, setPortfolios] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/portfolios').then(res => setPortfolios(res.data));
  }, []);

  return (
    <div className="py-20 container mx-auto px-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Portofolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolios.map((p) => (
          <div key={p.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white">
            {p.main_image_url ? <img src={`http://127.0.0.1:8000/storage/${p.main_image_url}`} className="h-48 w-full object-cover" alt="" /> : <div className="h-48 bg-gray-200"></div>}
            <div className="p-6">
              <p className="text-sm text-blue-600 font-semibold mb-1">{p.project_date}</p>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{p.title}</h4>
              <p className="text-gray-600 text-sm">{p.short_description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
