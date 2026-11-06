import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PagesAdmin({ token }) {
  const [pages, setPages] = useState([]);
  const [form, setForm] = useState({ title: '', content: '' });

  const fetchData = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/pages');
    setPages(res.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://127.0.0.1:8000/api/admin/pages', form, { headers: { Authorization: `Bearer ${token}` } });
    setForm({ title: '', content: '' });
    fetchData();
  };

  const handleDelete = async (id) => {
    if(window.confirm('Hapus halaman ini?')) {
      await axios.delete(`http://127.0.0.1:8000/api/admin/pages/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Tambah Halaman Baru</h2>
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input type="text" placeholder="Judul Halaman" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="flex-1 px-3 py-2 border rounded" />
        <textarea placeholder="Konten Halaman..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} required className="flex-[2] px-3 py-2 border rounded"></textarea>
        <button type="submit" className="bg-blue-600 text-white px-6 rounded hover:bg-blue-700 h-fit py-2">Simpan</button>
      </form>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border-b">ID</th>
            <th className="p-3 border-b">Judul</th>
            <th className="p-3 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(p => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">{p.id}</td>
              <td className="p-3 border-b font-semibold">{p.title}</td>
              <td className="p-3 border-b">
                <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}