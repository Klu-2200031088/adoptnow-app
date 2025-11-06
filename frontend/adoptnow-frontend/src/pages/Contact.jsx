import { useState } from 'react';

export default function Contact() {
  const [contact, setContact] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = e => {
    setContact(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('✅ Message sent! We will get back soon.');
        setContact({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('❌ ' + (data.message || 'Failed to send message'));
      }
    } catch (err) {
      setStatus('❌ Error: ' + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h1>Contact Us</h1>
      {status && <p>{status}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Your name"
          value={contact.name}
          onChange={handleChange}
          required
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />
        <input
          name="email"
          type="email"
          placeholder="Your email"
          value={contact.email}
          onChange={handleChange}
          required
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />
        <input
          name="subject"
          placeholder="Subject"
          value={contact.subject}
          onChange={handleChange}
          required
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />
        <textarea
          name="message"
          placeholder="Message"
          value={contact.message}
          onChange={handleChange}
          rows={4}
          required
          style={{ display: 'block', marginBottom: 10, width: '100%' }}
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}
