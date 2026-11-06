import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PortfoliosAdmin({ token }) {
  const [portfolios, setPortfolios] = useState([]);
  const [form, setForm] = useState({ title: '', short_description: '', full_content: '', project_date: '', image: null });
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchData = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/portfolios');
    setPortfolios(res.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('short_description', form.short_description);
    formData.append('full_content', form.full_content);
    formData.append('project_date', form.project_date);
    if (form.image) formData.append('image', form.image);

    try {
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      if (editId) {
        await axios.post(`http://127.0.0.1:8000/api/admin/portfolios/${editId}?_method=PUT`, formData, config);
      } else {
        await axios.post('http://127.0.0.1:8000/api/admin/portfolios', formData, config);
      }
      setForm({ title: '', short_description: '', full_content: '', project_date: '', image: null });
      setEditId(null);
      setPreview(null);
      fetchData();
      alert('Data berhasil disimpan!');
    } catch (error) {
      alert('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ title: p.title, short_description: p.short_description, full_content: p.full_content, project_date: p.project_date, image: null });
    setPreview(p.main_image_url ? `http://127.0.0.1:8000/storage/${p.main_image_url}` : null);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Hapus portofolio ini?')) {
      await axios.delete(`http://127.0.0.1:8000/api/admin/portfolios/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Portofolio' : 'Tambah Portofolio Baru'}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded border">
        <div>
          <label className="block text-sm font-bold mb-2">Judul Proyek</label>
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Tanggal Proyek</label>
          <input type="date" value={form.project_date} onChange={e => setForm({...form, project_date: e.target.value})} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-bold mb-2">Deskripsi Singkat</label>
          <input type="text" value={form.short_description} onChange={e => setForm({...form, short_description: e.target.value})} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-bold mb-2">Detail Lengkap</label>
          <textarea value={form.full_content} onChange={e => setForm({...form, full_content: e.target.value})} required className="w-full px-3 py-2 border rounded" rows="3"></textarea>
        </div>
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-bold mb-2">Gambar Proyek</label>
          <input type="file" onChange={handleFileChange} accept="image/*" className="w-full px-3 py-2 border rounded bg-white" />
          {preview && <img src={preview} alt="Preview" className="mt-2 h-32 object-cover rounded shadow" />}
        </div>
        <div className="col-span-1 md:col-span-2 flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">{editId ? 'Update' : 'Simpan'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ title: '', short_description: '', full_content: '', project_date: '', image: null }); setPreview(null); }} className="bg-gray-400 text-white px-4 py-2 rounded">Batal</button>}
        </div>
      </form>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border-b">Gambar</th>
            <th className="p-3 border-b">Judul</th>
            <th className="p-3 border-b">Tanggal</th>
            <th className="p-3 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {portfolios.map(p => (
            <tr key={p.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">
                {p.main_image_url ? (
                  <img src={`http://127.0.0.1:8000/storage/${p.main_image_url}`} alt="porto" className="w-16 h-12 object-cover rounded" />
                ) : <span className="text-gray-400 text-xs">No Image</span>}
              </td>
              <td className="p-3 border-b font-semibold">{p.title}</td>
              <td className="p-3 border-b text-gray-600">{p.project_date}</td>
              <td className="p-3 border-b flex gap-2">
                <button onClick={() => handleEdit(p)} className="text-blue-500 hover:underline">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}