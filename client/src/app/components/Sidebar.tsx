'use client'
import React, { useEffect, useState } from 'react';

const Sidebar = () => {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:8000/api/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error('Error fetching message:', err);
        setMessage('Failed to load message');
      });
  }, []);

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
};

export default Sidebar;
