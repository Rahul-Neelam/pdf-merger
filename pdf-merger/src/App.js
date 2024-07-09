import axios from 'axios';
import { useState } from 'react';
import './App.css';

function App() {
  const [fileInputs, setFileInputs] = useState([{ id: 1, file: null }]);
  const [merging, setMerging] = useState(false);

  const handleFileChange = (id, e) => {
    const newFileInputs = fileInputs.map(input => 
      input.id === id ? { ...input, file: e.target.files[0] } : input
    );
    setFileInputs(newFileInputs);
  };

  const handleAddInput = () => {
    setFileInputs([...fileInputs, { id: Date.now(), file: null }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const files = fileInputs.map(input => input.file).filter(file => file);
    if (files.length === 0) return;

    setMerging(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('pdfFiles', file));

    try {
      const response = await axios.post('http://localhost:5000/merge', formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'merged.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error merging PDFs:', error);
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="App">
      <h1>PDF Merger</h1>
      <form onSubmit={handleSubmit}>
        {fileInputs.map(input => (
          <div key={input.id} className="input-group">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(input.id, e)}
              required
            />
            {fileInputs.length > 1 && (
              <button type="button" className="add-button" onClick={handleAddInput}>
                +
              </button>
            )}
          </div>
        ))}
        <button type="submit" disabled={merging}>
          {merging ? 'Merging...' : 'Merge PDFs'}
        </button>
      </form>
    </div>
  );
}

export default App;
