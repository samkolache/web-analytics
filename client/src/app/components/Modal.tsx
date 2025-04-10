'use client';

import React, { useState } from 'react';
import { useModal } from '../../contexts/ModalContext';
import { useAnalytics } from '@/contexts/AnalyticsContext';

const Modal = () => {
  const { isModalOpen, closeModal } = useModal();
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(''); // 'success', 'error', or empty
  const { setAnalyticsData } = useAnalytics();

  if (!isModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      setMessage('Please enter a URL');
      setStatus('error');
      return;
    }
    
    setIsSubmitting(true);
    setMessage('Starting website analysis. This may take several minutes for complex sites...');
    setStatus('');
    
    try {
      const response = await fetch('http://localhost:8000/api/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store the analytics data in context
        if (data && data.length > 0) {
          console.log("Setting analytics data:", data[0]);
          setAnalyticsData(data[0]); // Store the first object from the array
        }
        
        setMessage(`Success! Your website analysis has been completed.`);
        setStatus('success');
        
        // Close modal after success
        setTimeout(() => {
          setUrl('');
          setMessage('');
          closeModal();
        }, 3000);
      } else {
        setMessage(`Error: ${data.detail || 'Unknown error occurred'}`);
        setStatus('error');
      }
    } catch (error) {
      setMessage(`Failed to submit: ${error.message}`);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay - Fixed position covers the entire viewport */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={closeModal}
      >
        {/* Modal - Centered with flexbox */}
        <div
          className="bg-white max-w-lg w-full rounded-md p-6 m-4 z-50"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Run Analytics</h2>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col max-w-full gap-2 mb-4">
              <label htmlFor="url">Enter URL to run analytics</label>
              <input
                type="text"
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="rounded-md p-2 border border-gray-300 focus:border-blue-500 focus:outline-none"
                disabled={isSubmitting}
              />
            </div>
            
            {message && (
              <div className={`mb-4 p-3 rounded-md ${
                status === 'error' ? 'bg-red-100 text-red-700' : 
                status === 'success' ? 'bg-green-100 text-green-700' : 
                'bg-blue-100 text-blue-700'
              }`}>
                {message}
              </div>
            )}
            
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 px-12 rounded-md text-white py-2 hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Run'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Modal;