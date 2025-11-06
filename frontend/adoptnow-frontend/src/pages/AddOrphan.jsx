import { useState } from 'react';

export default function AddOrphan() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    photo: null,
  });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const data = new FormData();
    data.append('name', formData.name);
    data.append('age', formData.age);
    data.append('location', formData.location);
    if (formData.photo) data.append('photo', formData.photo);

    try {
      const res = await fetch('http://localhost:5000/api/children', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        setMessage('✅ Orphan added successfully!');
        setFormData({ name: '', age: '', location: '', photo: null });
      } else {
        setMessage(result.message || 'Failed to add orphan');
      }
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>Add New Orphan</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Name</label><br />
        <input name="name" value={formData.name} onChange={handleChange} required /><br />

        <label>Age</label><br />
        <input name="age" type="number" value={formData.age} onChange={handleChange} required /><br />

        <label>Location</label><br />
        <input name="location" value={formData.location} onChange={handleChange} required /><br />

        <label>Photo</label><br />
        <input name="photo" type="file" accept="image/*" onChange={handleChange} /><br />

        <button type="submit" style={{ marginTop: 10 }}>Add Orphan</button>
      </form>
    </div>
  );
}
