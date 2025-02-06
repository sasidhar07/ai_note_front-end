import React, { useState, useRef, useEffect } from 'react';
import "./NoteCreator.css";
import Cookies from "js-cookie"

const NoteCreator = ({ onNoteCreated }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorder = useRef(null);
  const fileInputRef = useRef();

  useEffect(() => {
    return () => {
      if (mediaRecorder.current) {
        mediaRecorder.current.stream?.getTracks().forEach(track => track.stop());
      }
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
  
      const audioChunks = [];
      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };
  
      mediaRecorder.current.onstop = () => {
        if (audioChunks.length > 0) {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          setAudioBlob(audioBlob);
        }
      };
  
      mediaRecorder.current.onerror = (e) => {
        console.error("Audio recording error:", e.error);
        setIsRecording(false);
      };
  
      mediaRecorder.current.start();
      setIsRecording(true);
  
      setTimeout(() => {
        stopRecording();
      }, 60000);
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && !image && !audioBlob) return; 
  
    try {
      const formData = new FormData();
      formData.append("title", `Note ${new Date().toLocaleString()}`);
      formData.append("content", text);
      formData.append("type", image ? "image" : (audioBlob ? "audio" : "text"));
  
      if (image) {
        formData.append("image", image);
      }
  
      if (audioBlob) {
        formData.append("audio", audioBlob, "note-audio.wav"); 
      }
  
      const token = Cookies.get("jwt_token"); 
  
      const response = await fetch("https://ai-notes-backend-0c9d.onrender.com/api/notes", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save note");
      }
  
      setText("");
      setImage(null);
      setImagePreview(null);
      setAudioBlob(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onNoteCreated();
    } catch (error) {
      console.error("Error creating note:", error.message);
    }
  };
  

  return (
    <div className="note-creator">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label htmlFor="note-textarea">Write a note:</label>
        <textarea
          id="note-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note..."
        />

        <label htmlFor="image-upload">Upload Image:</label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
        />

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" width="100" />
          </div>
        )}

        <div className="button-group">
          <button type="submit" disabled={!text && !image && !audioBlob}>
            Save Note
          </button>
          <button
            type="button"
            className={`record-button ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteCreator;