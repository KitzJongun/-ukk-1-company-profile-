import { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [halaman, setHalaman] = useState('home');
  
  // State Admin
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pesanLogin, setPesanLogin] = useState('');
  const [activeTab, setActiveTab] = useState('services');

  // State Data
  const [services, setServices] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [pages, setPages] = useState([]);
  const [messages, setMessages] = useState([]);

  // State Form Admin
  const [editId, setEditId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImage, setFormImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const ambilData = async () => {
    try {
      const resS = await axios.get('http://127.0.0.1:8000/api/services');
      const resP = await axios.get('http://127.0.0.1:8000/api/portfolios');
      const resPg = await axios.get('http://127.0.0.1:8000/api/pages');
      setServices(resS.data);
      setPortfolios(resP.data);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setPesanLogin('');
    } catch (err) { setPesanLogin('Email atau password salah!'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setHalaman('home');
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

  // ==========================================
  // TAMPILAN ADMIN (SINKRON FIGMA - SUPER KEREN)
  // ==========================================
  if (window.location.pathname === '/admin') {
    // 1. TAMPILAN LOGIN
    if (!token) {
      return (
        <div className="min-h-screen flex font-sans">
          {/* KIRI: Branding Biru */}
          <div className="hidden lg:flex w-1/2 bg-[#1E3A8A] relative flex-col justify-between p-12 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-[#1E3A8A] rounded-lg flex items-center justify-center font-bold text-2xl">C</div>
              <span className="text-2xl font-bold">CompanyPro</span>
            </div>
            <div className="mb-20">
              <p className="text-blue-300 font-semibold tracking-widest text-sm mb-4">— COMPANYPRO ADMIN</p>
              <h1 className="text-5xl font-bold mb-6">CompanyPro.</h1>
              <p className="text-xl text-blue-100 mb-8">Great work starts here.</p>
              <p className="text-blue-200 text-sm max-w-sm">One secure workspace to manage your content, connect your team, and keep your business moving forward.</p>
            </div>
            <div className="flex justify-between text-xs text-blue-300">
              <span>© 2026 CompanyPro</span>
              <span>🔒 Secure admin access</span>
            </div>
          </div>

          {/* KANAN: Form Login Putih */}
          <div className="flex-1 flex items-center justify-center bg-[#F8FAFC] p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
                <p className="text-gray-500 mt-2 text-sm">Sign in to access your CompanyPro admin dashboard.</p>
              </div>
              
              {pesanLogin && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center mb-6">{pesanLogin}</div>}
              
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email address</label>
                  <input type="email" placeholder="admin@companypro.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700">Password</label>
                    <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
                  </div>
                  <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label className="ml-2 text-sm text-gray-600">Remember me</label>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md flex justify-center items-center gap-2">
                  Sign in &rarr;
                </button>
              </form>

              <div className="mt-8 text-center text-xs text-gray-500">
                <p>🛡️ Authorized personnel only. Your data stays secure.</p>
                <div className="mt-6">
                  <a href="/" className="text-blue-600 font-semibold hover:underline flex items-center justify-center gap-2">
                    &larr; Back to website
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 2. TAMPILAN DASHBOARD (SIDEBAR GELAP)
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
        {/* SIDEBAR */}
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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">{editId ? 'Edit Layanan' : 'Tambah Layanan Baru'}</h2>
                </div>
                
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      <nav className="bg-white shadow-sm py-5 sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-6xl flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setHalaman('home')}>
            <div className="w-8 h-8 bg-[#1E3A8A] text-white rounded-lg flex items-center justify-center font-bold text-lg mr-2">C</div>
            <h1 className="text-xl font-bold text-gray-900">CompanyPro</h1>
          </div>
          <div className="hidden md:flex space-x-8 font-medium text-sm text-gray-600">
            <button onClick={() => setHalaman('home')} className={halaman === 'home' ? 'text-blue-600' : 'hover:text-blue-600'}>Home</button>
            <button onClick={() => setHalaman('about')} className={halaman === 'about' ? 'text-blue-600' : 'hover:text-blue-600'}>About Us</button>
            <button onClick={() => setHalaman('services')} className={halaman === 'services' ? 'text-blue-600' : 'hover:text-blue-600'}>Services</button>
            <button onClick={() => setHalaman('portfolio')} className={halaman === 'portfolio' ? 'text-blue-600' : 'hover:text-blue-600'}>Portfolio</button>
            <button onClick={() => setHalaman('contact')} className={halaman === 'contact' ? 'text-blue-600' : 'hover:text-blue-600'}>Contact Us</button>
          </div>
          <button onClick={() => setHalaman('contact')} className="bg-[#1E3A8A] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-800 transition shadow-sm">Get Free Consultation</button>
        </div>
      </nav>

      <main>
        {halaman === 'home' && (
          <div>
            <header className="bg-[#F8FAFC] py-24">
              <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1">
                  <p className="text-blue-600 font-semibold tracking-widest text-xs mb-4">— YOUR DIGITAL GROWTH PARTNER</p>
                  <h2 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                    We Build Digital Solutions <br/>to Grow Your Business
                  </h2>
                  <p className="text-gray-600 text-lg mb-8 max-w-lg leading-relaxed">
                    From bold ideas to powerful digital experiences, we help businesses innovate, connect with customers, and grow with confidence.
                  </p>
                  <div className="flex gap-4">
                    <button onClick={() => setHalaman('services')} className="bg-[#1E3A8A] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-blue-800 transition shadow-md">Explore Our Services &rarr;</button>
                    <button onClick={() => setHalaman('portfolio')} className="bg-white text-[#1E3A8A] border border-gray-300 px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition">View Our Portfolio</button>
                  </div>
                </div>
                <div className="flex-1 hidden md:block">
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team" className="rounded-xl shadow-2xl w-full object-cover h-[400px]" />
                </div>
              </div>
            </header>

            <section className="py-20 bg-white">
              <div className="container mx-auto px-6 max-w-6xl text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Professional Services</h3>
                <p className="text-gray-500 mb-12">The expertise you need. The impact your business deserves.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {services.slice(0, 3).map(s => (
                    <div key={s.id} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition text-left">
                      {s.icon_url ? <img src={`http://127.0.0.1:8000/storage/${s.icon_url}`} className="w-10 h-10 object-cover mb-6" /> : <div className="w-10 h-10 bg-blue-50 rounded mb-6"></div>}
                      <h4 className="font-bold text-xl mb-3 text-gray-900">{s.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6">{s.description}</p>
                      <button onClick={() => setHalaman('services')} className="text-blue-600 text-sm font-semibold hover:underline">Learn more &rarr;</button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="py-20 bg-[#1E3A8A] text-white">
              <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-6">A partner in your next chapter.</h3>
                  <p className="text-blue-100 mb-8 leading-relaxed text-lg">
                    We're a team of designers, developers, and problem-solvers. Since 2016, we've helped ambitious businesses move forward with digital solutions that make a difference.
                  </p>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-6 text-center w-full">
                  <div className="bg-blue-800/50 p-8 rounded-xl border border-blue-700"><p className="text-4xl font-bold mb-2">10+</p><p className="text-sm text-blue-200">Years Experience</p></div>
                  <div className="bg-blue-800/50 p-8 rounded-xl border border-blue-700"><p className="text-4xl font-bold mb-2">150+</p><p className="text-sm text-blue-200">Happy Clients</p></div>
                  <div className="bg-blue-800/50 p-8 rounded-xl border border-blue-700"><p className="text-4xl font-bold mb-2">250+</p><p className="text-sm text-blue-200">Projects Delivered</p></div>
                  <div className="bg-blue-800/50 p-8 rounded-xl border border-blue-700"><p className="text-4xl font-bold mb-2">98%</p><p className="text-sm text-blue-200">Client Satisfaction</p></div>
                </div>
              </div>
            </section>
          </div>
        )}

        {halaman === 'about' && (
          <div className="py-20 bg-white min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="text-4xl font-bold text-gray-900">About Us</h2>
              </div>
              <div className="bg-[#F8FAFC] p-10 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {pages.find(p => p.title.toLowerCase().includes('about'))?.content || 'Please add "About Us" content through the Admin Panel.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {halaman === 'services' && (
          <div className="py-20 bg-white min-h-screen">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="mb-12 text-center">
                <h2 className="text-4xl font-bold text-gray-900">Our Services</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {services.map(s => (
                  <div key={s.id} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                    {s.icon_url ? <img src={`http://127.0.0.1:8000/storage/${s.icon_url}`} className="w-12 h-12 object-cover mb-6" /> : <div className="w-12 h-12 bg-blue-50 rounded mb-6"></div>}
                    <h4 className="font-bold text-xl mb-3 text-gray-900">{s.title}</h4>
                    <p className="text-gray-500 leading-relaxed">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {halaman === 'portfolio' && (
          <div className="py-20 bg-[#F8FAFC] min-h-screen">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="mb-12 text-center">
                <h2 className="text-4xl font-bold text-gray-900">Our Portfolio</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {portfolios.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
                    {p.main_image_url ? <img src={`http://127.0.0.1:8000/storage/${p.main_image_url}`} className="h-56 w-full object-cover" /> : <div className="h-56 bg-gray-200"></div>}
                    <div className="p-6">
                      <p className="text-blue-600 text-xs font-bold mb-2 uppercase tracking-wide">{p.project_date}</p>
                      <h4 className="font-bold text-xl mb-2 text-gray-900">{p.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{p.short_description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {halaman === 'contact' && (
          <div className="py-20 bg-white min-h-screen">
            <div className="container mx-auto px-6 max-w-2xl">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-gray-900">Contact Us</h2>
                <p className="text-gray-500 mt-2">Our professional team is ready to assist you.</p>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                try {
                  await axios.post('http://127.0.0.1:8000/api/contact', {
                    name: form.name.value, email: form.email.value, subject: form.subject.value, message: form.message.value
                  });
                  alert('Message sent successfully!');
                  form.reset();
                } catch (err) { alert('Failed to send message.'); }
              }} className="bg-[#F8FAFC] p-10 rounded-2xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Name</label>
                    <input type="text" name="name" required className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Email</label>
                    <input type="email" name="email" required className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2 text-gray-700">Subject</label>
                  <input type="text" name="subject" required className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold mb-2 text-gray-700">Message</label>
                  <textarea name="message" required rows="4" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#1E3A8A] text-white font-bold py-4 rounded-xl hover:bg-blue-800 transition shadow-md">Send Message</button>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-[#0F172A] text-gray-300 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-gray-800 pb-12">
            
            <div className="pr-4">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-xl mr-3">C</div>
                <h1 className="text-xl font-bold text-white">CompanyPro</h1>
              </div>
              <p className="text-sm leading-relaxed text-gray-400 mb-6">
                Your trusted partner for digital innovation. Building better experiences, together.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="text-sm space-y-3 text-gray-400">
                <li className="hover:text-white cursor-pointer transition">About Us</li>
                <li className="hover:text-white cursor-pointer transition">Our Team</li>
                <li className="hover:text-white cursor-pointer transition">Careers</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Expertise</h4>
              <ul className="text-sm space-y-3 text-gray-400">
                <li className="hover:text-white cursor-pointer transition">Web Development</li>
                <li className="hover:text-white cursor-pointer transition">UI/UX Design</li>
                <li className="hover:text-white cursor-pointer transition">Digital Strategy</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="text-sm space-y-3 text-gray-400">
                <li className="hover:text-white cursor-pointer transition">Portfolio</li>
                <li className="hover:text-white cursor-pointer transition">Contact</li>
                <li className="hover:text-white cursor-pointer transition">Privacy Policy</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center py-6 text-sm text-gray-500">
            <div className="flex gap-6 mb-4 md:mb-0">
              <span className="flex items-center gap-2"><span className="text-lg">✉️</span> bangkitz514@gmail.com</span>
              <span className="flex items-center gap-2"><span className="text-lg">📞</span> 0858-8254-1534</span>
            </div>
            <p>&copy; 2026 CompanyPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}