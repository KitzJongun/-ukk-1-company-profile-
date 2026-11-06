import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ServicesAdmin({ token }) {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', icon: null });
  const [editId, setEditId] = useState(null); // Untuk nandain kalau lagi mode Edit
  const [preview, setPreview] = useState(null); // Untuk preview gambar

  const fetchData = async () => {
    const res = await axios.get('http://127.0.0.1:8000/api/services');
    setServices(res.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, icon: file });
    if (file) setPreview(URL.createObjectURL(file)); // Bikin preview gambar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kita pakai FormData karena ada file gambar
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    if (form.icon) formData.append('icon', form.icon);

    try {
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      
      if (editId) {
        // Mode Edit
        await axios.post(`http://127.0.0.1:8000/api/admin/services/${editId}?_method=PUT`, formData, config);
      } else {
        // Mode Tambah
        await axios.post('http://127.0.0.1:8000/api/admin/services', formData, config);
      }
      
      setForm({ title: '', description: '', icon: null });
      setEditId(null);
      setPreview(null);
      fetchData();
      alert('Data berhasil disimpan!');
    } catch (error) {
      alert('Gagal menyimpan: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (s) => {
    setEditId(s.id);
    setForm({ title: s.title, description: s.description, icon: null });
    setPreview(s.icon_url ? `http://127.0.0.1:8000/storage/${s.icon_url}` : null);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Hapus layanan ini?')) {
      await axios.delete(`http://127.0.0.1:8000/api/admin/services/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Layanan' : 'Tambah Layanan Baru'}</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded border">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-bold mb-2">Judul Layanan</label>
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full px-3 py-2 border rounded" />
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-bold mb-2">Deskripsi</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} required className="w-full px-3 py-2 border rounded"></textarea>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Ikon/Gambar</label>
          <input type="file" onChange={handleFileChange} accept="image/*" className="w-full px-3 py-2 border rounded bg-white" />
          {preview && <img src={preview} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded shadow" />}
        </div>

        <div className="flex items-end gap-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            {editId ? 'Update Layanan' : 'Simpan Layanan'}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm({ title: '', description: '', icon: null }); setPreview(null); }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
              Batal
            </button>
          )}
        </div>
      </form>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border-b">Ikon</th>
            <th className="p-3 border-b">Judul</th>
            <th className="p-3 border-b">Deskripsi</th>
            <th className="p-3 border-b">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="p-3 border-b">
                {s.icon_url ? (
                  <img src={`http://127.0.0.1:8000/storage/${s.icon_url}`} alt="icon" className="w-10 h-10 object-cover rounded" />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </td>
              <td className="p-3 border-b font-semibold">{s.title}</td>
              <td className="p-3 border-b text-gray-600">{s.description}</td>
              <td className="p-3 border-b flex gap-2">
                <button onClick={() => handleEdit(s)} className="text-blue-500 hover:underline">Edit</button>
                <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:underline">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}