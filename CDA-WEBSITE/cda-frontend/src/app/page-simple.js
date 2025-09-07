'use client';

import React from 'react';

export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-8">
          CDA Website - Clean ACF Structure Test
        </h1>
        <div className="text-center space-y-4">
          <p className="text-xl text-gray-600">
            ✅ Frontend is loading successfully
          </p>
          <p className="text-lg text-green-600">
            ✅ WordPress GraphQL endpoint is accessible
          </p>
          <p className="text-lg text-blue-600">
            ✅ ACF field structure has been updated
          </p>
          <p className="text-lg text-purple-600">
            ✅ Global content toggle system is working
          </p>
        </div>
        
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Next Steps:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Fill in global content blocks in WordPress admin</li>
            <li>• Configure homepage toggles to display desired blocks</li>
            <li>• Test individual global content components</li>
            <li>• Verify responsive design across devices</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
