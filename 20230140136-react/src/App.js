import React, { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5001')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  const name = "Muhammad Irfan Fauzi"; 

  return (
    <div>
      <h1>Integrasi React dan Node.js</h1>
      <p>Pesan dari server: {message || 'Loading...'}</p>
      <h2>Hello, {name}!</h2>
    </div>
  );
}

export default App;
