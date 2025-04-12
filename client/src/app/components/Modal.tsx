'use client';

import React, { useState, useEffect } from 'react';
import { useModal } from '../../contexts/ModalContext';
import { useAnalytics } from '@/contexts/AnalyticsContext';

const Modal = () => {
  const { isModalOpen, closeModal } = useModal();
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(''); // 'success', 'error', 'processing' or empty
  const [analysisId, setAnalysisId] = useState('');
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const { setAnalyticsData } = useAnalytics();

  // Clean up polling when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Stop polling when modal closes
  useEffect(() => {
    if (!isModalOpen && pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }, [isModalOpen, pollingInterval]);

  if (!isModalOpen) return null;

  // Poll for analysis status
  const startPolling = (id: string) => {
    // Clear any existing polling
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    
    // Set up new polling interval
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/analysis-status/${id}`);
        const data = await response.json();
        
        console.log("Polling update:", data);
        
        if (data.status === 'complete') {
          // Analysis is complete
          clearInterval(interval);
          setPollingInterval(null);
          
          // Process the results
          if (data.avgPerformanceScore !== undefined) {
            console.log("Analysis complete, setting data:", data);
            setAnalyticsData(data);
            
            // Store in localStorage for persistence
            localStorage.setItem('lastAnalysisId', id);
            localStorage.setItem('lastAnalysisData', JSON.stringify(data));
            
            setMessage(`Success! Your website analysis has been completed.`);
            setStatus('success');
            
            // Close modal after success
            setTimeout(() => {
              setUrl('');
              setMessage('');
              setAnalysisId('');
              closeModal();
            }, 3000);
          } else {
            setMessage(`Error: Results data is incomplete`);
            setStatus('error');
          }
        } else if (data.status === 'failed') {
          // Analysis failed
          clearInterval(interval);
          setPollingInterval(null);
          setMessage(`Error: ${data.error || 'Analysis failed'}`);
          setStatus('error');
        } else {
          // Still processing
          setMessage(`Analysis in progress. This may take several minutes...`);
          setStatus('processing');
        }
      } catch (error) {
        console.error("Error polling for status:", error);
        setMessage(`Error checking analysis status: ${error.message}`);
        setStatus('error');
      }
    }, 5000); // Check every 5 seconds
    
    setPollingInterval(interval);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      setMessage('Please enter a URL');
      setStatus('error');
      return;
    }
    
    // Save URL to localStorage for AutomationDetails component
    localStorage.setItem('analyzedUrl', url);
    
    setIsSubmitting(true);
    setMessage('Starting website analysis. This may take several minutes...');
    setStatus('processing');
    
    try {
      const response = await fetch('http://localhost:8000/api/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      const data = await response.json();
      console.log("Received initial response:", data);
      
      if (response.ok && data.analysisId) {
        // Store the analysis ID
        setAnalysisId(data.analysisId);
        
        // Start polling for results
        startPolling(data.analysisId);
        
        setMessage(`Analysis started. Results will appear when processing is complete...`);
        setStatus('processing');
      } else {
        setMessage(`Error: ${data.detail || 'Unknown error occurred'}`);
        setStatus('error');
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error("API request failed:", error);
      setMessage(`Failed to submit: ${error.message}`);
      setStatus('error');
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
                disabled={isSubmitting || status === 'processing'}
              />
            </div>
            
            {message && (
              <div className={`mb-4 p-3 rounded-md ${
                status === 'error' ? 'bg-red-100 text-red-700' : 
                status === 'success' ? 'bg-green-100 text-green-700' : 
                status === 'processing' ? 'bg-blue-100 text-blue-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {message}
                {status === 'processing' && (
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 px-12 rounded-md text-white py-2 hover:bg-blue-700 disabled:bg-blue-300"
                disabled={isSubmitting || status === 'processing'}
              >
                {(isSubmitting || status === 'processing') ? 'Processing...' : 'Run'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Modal;