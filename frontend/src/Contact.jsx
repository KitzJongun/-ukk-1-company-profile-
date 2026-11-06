import axios from 'axios';

export default function Contact() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    try {
      await axios.post('http://127.0.0.1:8000/api/contact', {
        name: form.name.value,
        email: form.email.value,
        subject: form.subject.value,
        message: form.message.value
      });
      alert('Pesan berhasil terkirim!');
      form.reset();
    } catch (err) {
      alert('Gagal mengirim pesan.');
    }
  };

  return (
    <div className="py-20 container mx-auto px-6 max-w-2xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">Hubungi Kami</h1>
      <form className="bg-white p-8 rounded-xl shadow-sm border border-gray-100" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap</label>
            <input type="text" name="name" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" name="email" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Subjek</label>
          <input type="text" name="subject" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Pesan</label>
          <textarea name="message" required rows="4" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition">Kirim Pesan</button>
      </form>
    </div>
  );
}