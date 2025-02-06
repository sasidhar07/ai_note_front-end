import React, { useState } from 'react';
import "./NoteList.css"
import Cookies from "js-cookie"
const NoteList = ({ notes, onNoteClick, onDelete }) => {
  const [playingAudio, setPlayingAudio] = useState(null);

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('Copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
  
    const token = Cookies.get('jwt_token'); 
  
    try {
      const response = await fetch(`https://ai-notes-backend-0c9d.onrender.com/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
  
      onDelete(); 
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };
  

  return (
    <div className='NoteListCard'>
      {notes.map(note => (
        <div key={note._id} className="note-container">
          <div 
            className="note-content"
            onClick={() => onNoteClick(note)}
          >
            <p>
              {note.content.substring(0, 100)}
              {note.content.length > 100 && '...'}
            </p>
          </div>

          {note.audio && (
            <audio
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
          )}

          <div className="button-container">
            <button
              onClick={() => handleCopy(note.content)}
              className="copy-button"
            >
              Copy
            </button>
            <button
              onClick={() => handleDelete(note._id)}
              className="delete-button"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;