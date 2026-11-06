import { useState, useEffect } from 'react';
import axios from 'axios';

export default function About() {
  const [page, setPage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/pages/about-us')
      .then(res => {
        if (res.data && res.data.content) {
          setPage(res.data);
        } else {
          setError('Data halaman kosong.');
        }
      })
      .catch(err => {
        console.log(err);
        setError('Halaman About Us belum dibuat di Admin.');
      });
  }, []);

  return (
    <div className="py-20 container mx-auto px-6 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Tentang Kami</h1>
      
      {error && <p className="text-center text-red-500 bg-red-50 py-4 rounded-lg">{error}</p>}
      
      {page && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          {page.main_image_url && (
            <img 
              src={`http://127.0.0.1:8000/storage/${page.main_image_url}`} 
              className="w-full max-h-96 object-cover rounded-lg mb-6" 
              alt="About" 
            />
          )}
          {/* Cara nampilin teks yang lebih aman */}
          <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
            {page.content}
          </p>
        </div>
      )}
    </div>
  );
}