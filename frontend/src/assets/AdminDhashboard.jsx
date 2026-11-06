import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard({ token, setToken }) {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [pages, setPages] = useState([]);
  const [messages, setMessages] = useState([]);

  const [editId, setEditId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImage, setFormImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const ambilData = async () => {
    try {
      const resS = await axios.get('http://127.0.0.1:8000/api/services');
      const resPg = await axios.get('http://127.0.0.1:8000/api/pages');
      setServices(resS.data);
      setPages(resPg.data);
    } catch (err) { console.log(err); }
  };

  const ambilPesan = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/admin/contacts', { headers: { Authorization: `Bearer ${token}` } });
      setMessages(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { ambilData(); }, []);
  useEffect(() => { if(activeTab === 'messages') ambilPesan(); }, [activeTab, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    window.location.href = '/admin'; // Refresh halaman
  };

  const simpanService = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', formTitle);
    formData.append('description', formDesc);
    if (formImage) formData.append('icon', formImage);
    try {
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      if (editId) await axios.post(`http://127.0.0.1:8000/api/admin/services/${editId}?_method=PUT`, formData, config);
      else await axios.post('http://127.0.0.1:8000/api/admin/services', formData, config);
      resetForm(); ambilData(); alert('Layanan berhasil disimpan!');
    } catch (err) { alert('Gagal simpan: ' + (err.response?.data?.message || err.message)); }
  };

  const simpanPage = async (e) => {
    e.preventDefault();
    try {
      const data = { title: formTitle, content: formContent };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editId) await axios.put(`http://127.0.0.1:8000/api/admin/pages/${editId}`, data, config);
      else await axios.post('http://127.0.0.1:8000/api/admin/pages', data, config);
      resetForm(); ambilData(); alert('Halaman berhasil disimpan!');
    } catch (err) { alert('Gagal simpan'); }
  };

  const hapusData = async (tipe, id) => {
    if(!window.confirm('Yakin mau hapus data ini?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/${tipe}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      ambilData();
    } catch (err) { alert('Gagal hapus'); }
  };

  const resetForm = () => {
    setEditId(null); setFormTitle(''); setFormDesc(''); setFormContent(''); setFormImage(null); setPreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* SIDEBAR GELAP */}
      <div className="w-72 bg-[#0F172A] text-white flex flex-col shadow-2xl z-20">
        <div className="p-8 text-2xl font-bold border-b border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">C</div>
          AdminPanel
        </div>
        
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold">A</div>
          <div>
            <p className="text-sm font-bold">Administrator</p>
            <p className="text-xs text-gray-400">admin@companypro.com</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <p className="text-xs font-bold text-gray-500 mb-4 px-4 tracking-wider">MAIN MENU</p>
          <button onClick={() => {setActiveTab('services'); resetForm();}} className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 ${activeTab === 'services' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <span className="text-xl">💼</span> Kelola Layanan
          </button>
          <button onClick={() => {setActiveTab('pages'); resetForm();}} className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 ${activeTab === 'pages' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <span className="text-xl">📄</span> Kelola Halaman
          </button>
          <button onClick={() => setActiveTab('messages')} className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 ${activeTab === 'messages' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            <span className="text-xl">✉️</span> Pesan Masuk
          </button>
        </nav>

        <div className="p-6 border-t border-gray-800">
          <button onClick={handleLogout} className="w-full bg-red-500/10 text-red-400 border border-red-500/20 py-3 rounded-xl font-bold hover:bg-red-500 hover:text-white transition flex justify-center items-center gap-2">
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Top */}
        <header className="bg-white shadow-sm px-8 py-5 flex justify-between items-center border-b border-gray-100 z-10">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">
            Dashboard / {activeTab === 'services' ? 'Kelola Layanan' : activeTab === 'pages' ? 'Kelola Halaman' : 'Pesan Masuk'}
          </h1>
          <a href="/" target="_blank" className="text-sm font-semibold text-blue-600 hover:underline bg-blue-50 px-4 py-2 rounded-lg">
            Lihat Website &rarr;
          </a>
        </header>

        {/* Area Konten (Scrollable) */}
        <div className="flex-1 p-8 overflow-y-auto">
          
          {/* TAB SERVICES */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">{editId ? 'Edit Layanan' : 'Tambah Layanan Baru'}</h2>
              
              <form onSubmit={simpanService} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Judul Layanan</label>
                  <input type="text" placeholder="Misal: Web Development" value={formTitle} onChange={e => setFormTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Singkat</label>
                  <input type="text" placeholder="Penjelasan singkat layanan" value={formDesc} onChange={e => setFormDesc(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ikon / Gambar</label>
                  <div className="flex items-center gap-4">
                    <input type="file" onChange={handleFileChange} accept="image/*" className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    {preview && <img src={preview} className="w-12 h-12 object-cover rounded shadow-sm" />}
                  </div>
                </div>
                <div className="md:col-span-2 flex gap-3 mt-2">
                  <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md">{editId ? 'Update Data' : 'Simpan Layanan'}</button>
                  {editId && <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-400 transition">Batal</button>}
                </div>
              </form>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm">
                      <th className="p-4 border-b rounded-tl-lg">Ikon</th>
                      <th className="p-4 border-b">Judul Layanan</th>
                      <th className="p-4 border-b">Deskripsi</th>
                      <th className="p-4 border-b rounded-tr-lg">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50 border-b border-gray-100 transition">
                        <td className="p-4">{s.icon_url ? <img src={`http://127.0.0.1:8000/storage/${s.icon_url}`} className="w-12 h-12 object-cover rounded-lg shadow-sm" /> : <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">No Img</div>}</td>
                        <td className="p-4 font-bold text-gray-800">{s.title}</td>
                        <td className="p-4 text-gray-600 text-sm">{s.description}</td>
                        <td className="p-4 space-x-3">
                          <button onClick={() => { setEditId(s.id); setFormTitle(s.title); setFormDesc(s.description); setPreview(s.icon_url ? `http://127.0.0.1:8000/storage/${s.icon_url}` : null); }} className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-200 transition">Edit</button>
                          <button onClick={() => hapusData('services', s.id)} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-red-200 transition">Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB PAGES */}
          {activeTab === 'pages' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">{editId ? 'Edit Halaman' : 'Tambah Halaman Baru'}</h2>
              <form onSubmit={simpanPage} className="flex flex-col gap-5 mb-10 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Judul Halaman</label>
                  <input type="text" placeholder="Misal: About Us" value={formTitle} onChange={e => setFormTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Isi Konten</label>
                  <textarea placeholder="Tulis konten halaman di sini..." value={formContent} onChange={e => setFormContent(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" rows="6" required></textarea>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md w-fit">{editId ? 'Update Halaman' : 'Simpan Halaman'}</button>
                  {editId && <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-400 transition">Batal</button>}
                </div>
              </form>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm">
                      <th className="p-4 border-b rounded-tl-lg">ID</th>
                      <th className="p-4 border-b">Judul Halaman</th>
                      <th className="p-4 border-b rounded-tr-lg">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 border-b border-gray-100 transition">
                        <td className="p-4 text-gray-500 font-mono text-sm">#{p.id}</td>
                        <td className="p-4 font-bold text-gray-800">{p.title}</td>
                        <td className="p-4 space-x-3">
                          <button onClick={() => { setEditId(p.id); setFormTitle(p.title); setFormContent(p.content); }} className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-200 transition">Edit</button>
                          <button onClick={() => hapusData('pages', p.id)} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-red-200 transition">Hapus</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB MESSAGES */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Kotak Masuk (Pesan Kontak)</h2>
              {messages.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <p className="text-5xl mb-4">📭</p>
                  <p>Belum ada pesan yang masuk dari pengunjung.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {messages.map(m => (
                    <div key={m.id} className="p-6 border border-gray-200 rounded-xl bg-gray-50 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-4 border-b border-gray-200 pb-4">
                        <div>
                          <p className="font-bold text-lg text-gray-800">{m.subject}</p>
                          <p className="text-sm text-blue-600 font-medium mt-1">Dari: {m.name} <span className="text-gray-400 font-normal">({m.email})</span></p>
                        </div>
                        <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">{new Date(m.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{m.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}