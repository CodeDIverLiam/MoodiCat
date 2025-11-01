import { useState } from 'react';
import { api } from '../api/client';

export default function AITest() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testAI = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      const result = await api.post('/ai/chat', {
        message: message
      });
      setResponse(JSON.stringify(result.data, null, 2));
    } catch (err) {
      console.error('AI Test Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-bold mb-4">AI API Test</h3>
      
      <div className="mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter test message..."
          className="w-full p-2 border rounded"
        />
      </div>
      
      <button
        onClick={testAI}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test AI'}
      </button>
      
      {error && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      {response && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
}


