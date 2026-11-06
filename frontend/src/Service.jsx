import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/services').then(res => setServices(res.data));
  }, []);

  return (
    <div className="py-20 container mx-auto px-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Layanan Kami</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((s) => (
          <div key={s.id} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition">
            {s.icon_url ? (
              <img src={`http://127.0.0.1:8000/storage/${s.icon_url}`} className="w-14 h-14 object-cover rounded-lg mb-4" alt="" />
            ) : (
              <div className="w-14 h-14 bg-blue-100 rounded-lg mb-4"></div>
            )}
            <h4 className="text-xl font-bold text-gray-800 mb-2">{s.title}</h4>
            <p className="text-gray-600">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}