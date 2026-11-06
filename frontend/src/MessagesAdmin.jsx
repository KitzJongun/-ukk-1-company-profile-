import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MessagesAdmin({ token }) {
  const [messages, setMessages] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/admin/contacts', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setMessages(res.data);
    } catch (error) {
      console.error("Gagal ambil data", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Pesan Masuk (Contact Us)</h2>
      
      {messages.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Belum ada pesan yang masuk.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-lg text-gray-800">{msg.subject}</h4>
                  <p className="text-sm text-blue-600 font-medium">Dari: {msg.name} ({msg.email})</p>
                </div>
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                  {new Date(msg.created_at).toLocaleDateString('id-ID')}
                </span>
              </div>
              <p className="text-gray-700 mt-3 whitespace-pre-wrap">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}