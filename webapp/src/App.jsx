import { useState, useEffect, useCallback } from 'react'
import * as Tone from "tone";
import axios from "axios";

function App() {
  const [audioFile, setAudioFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Initialize Tone.js right away
    Tone.start();
    
    axios.get("http://127.0.0.1:8080/api")
      .then(response => {
        console.log("Response:", response.data); 
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const mp3Files = files.filter(file => file.type === 'audio/mpeg');
    
    if (mp3Files.length > 0) {
      const newFile = mp3Files[0]; // Take just the first file
      setAudioFile(newFile);
      console.log("MP3 file dropped:", newFile);
      
      // Create FormData to properly send the file
      const formData = new FormData();
      formData.append('file', newFile);
      
      axios.post("http://127.0.0.1:8080/split", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          console.log("Response:", response.data); 
        })
        .catch(error => {
          console.error("Error splitting file:", error);
        });
    } else {
      console.log("No MP3 files found in the dropped items");
    }
  }, []);

  const handleFileInputChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    const mp3Files = files.filter(file => file.type === 'audio/mpeg');
    
    if (mp3Files.length > 0) {
      const newFile = mp3Files[0]; // Take just the first file
      setAudioFile(newFile);
      console.log("MP3 file selected:", newFile);
      
      // Create FormData to properly send the file
      const formData = new FormData();
      formData.append('file', newFile);
      
      axios.post("http://127.0.0.1:8080/split", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          console.log("Response:", response.data); 
        })
        .catch(error => {
          console.error("Error splitting file:", error);
        });
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6">Remix Room</h1>
        
        <div 
          className={`w-64 h-48 border-2 border-dashed rounded-lg mb-4 flex flex-col items-center justify-center p-4
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-400'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p className="text-gray-600 text-center mb-2">
            Drop an MP3 file here
          </p>
          <p className="text-gray-400 text-sm text-center">or</p>
          <label className="mt-2 cursor-pointer text-blue-500 hover:text-blue-600">
            Browse files
            <input 
              type="file" 
              accept="audio/mpeg" 
              className="hidden"
              onChange={handleFileInputChange} 
            />
          </label>
        </div>
        
        {audioFile && (
          <div className="w-64 mt-4">
            <h3 className="text-lg font-semibold mb-2">Selected File:</h3>
            <p className="text-sm truncate">{audioFile.name}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App