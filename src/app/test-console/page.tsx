'use client';

import { useEffect } from 'react';

export default function TestConsolePage() {
  console.log('🔵 TEST: TestConsolePage component rendered');
  
  useEffect(() => {
    console.log('🔵 TEST: useEffect executed');
    alert('🔵 TEST: Console logging test page loaded!');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Console Log Test Page</h1>
        <p className="text-gray-600 mb-4">
          This page is testing console logging functionality.
        </p>
        <p className="text-sm text-gray-500">
          Check your browser&apos;s developer console for logs.
        </p>
        <button 
          onClick={() => {
            console.log('🔵 TEST: Button clicked!');
            alert('🔵 TEST: Button clicked - check console!');
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Console Log
        </button>
      </div>
    </div>
  );
}
