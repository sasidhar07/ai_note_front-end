import React, { useState, useRef } from 'react';
import './NoteModal.css';

const NoteModal = ({ note, onClose }) => {
  const [playingAudio, setPlayingAudio] = useState(null);
  const audioRef = useRef(null);
  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('Copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">
            <h2>{note.title}</h2>
            <span className="modal-date">{note.date}</span>
          </div>
          <div className="modal-actions">
            
            <button className="icon-button" onClick={onClose}>
              <span className="close-icon">×</span>
            </button>
          </div>
        </div>

        {note.audio && (
          <div className="my-3">
            <audio
              ref={audioRef}
              controls
              src={`https://ai-notes-backend-0c9d.onrender.com/uploads/${note.audio}`}
              onPlay={(e) => {
                if (playingAudio && playingAudio !== e.target) {
                  playingAudio.pause();
                }
                setPlayingAudio(e.target);
              }}
              onEnded={() => setPlayingAudio(null)}
            />
          </div>
        )}

        <div className="modal-body">
          <div className="transcript-section">
            <div className="transcript-header">
              <h2>Transcript</h2>
              <button onClick={() => handleCopy(note.content)} className="copy-button">Copy</button>
            </div>
            <p className="transcript-content">{note.content}</p>
          </div>

          {note.image && (
            <div className="image-upload-section">
              <div className="image-placeholder">
                <img
                  src={`https://ai-notes-backend-0c9d.onrender.com/${note.image}`}
                  alt="Note"
                  className="note-image"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteModal;