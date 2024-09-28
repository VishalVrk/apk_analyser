import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('apk', file);

    try {
      const response = await axios.post('https://android-malware.onrender.com/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysis(response.data);
    } catch (err) {
      setError('Error analyzing APK. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">A Lightweight and Multi-Stage Approach for Android Malware Detection Using Non-Invasive ML</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".apk"
          className="mb-2"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze APK'}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {analysis && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Analysis Results</h2>
          <p>File Name: {analysis.fileName}</p>
          <p>Total Entries: {analysis.totalEntries}</p>
          <h3 className="text-lg font-semibold mt-4 mb-2">Files:</h3>
          <ul className="list-disc pl-5">
            {analysis.files.map((file) => (
              <li key={file.id}>
                {file.name} {file.isDirectory ? '(Directory)' : `(${file.size} bytes)`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}