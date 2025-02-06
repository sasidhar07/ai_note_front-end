import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoginPage from "./components/Login/login";
import Sidebar from "./components/Sidebar";
import SearchBar from "./components/SearchBar";
import NoteList from "./components/NoteList";
import NoteCreator from "./components/NoteCreator";
import NoteModal from "./components/NoteModal";
import NotFound from "./components/NotFound";
import "./app.css";

const MainContent = () => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState([""]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    Cookies.remove("jwt_token");
    navigate("/login");
  }, [navigate]);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = Cookies.get("jwt_token");
      
      const response = await fetch("https://ai-notes-backend-0c9d.onrender.com/api/notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.statusText}`);
      }

      let data = await response.json();
      
      data = data.sort((a, b) => 
        sortOrder === "asc" 
          ? a.title.localeCompare(b.title) 
          : b.title.localeCompare(a.title)
      );

      setNotes(data);
      setFilteredNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [sortOrder]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSearch = useCallback((query) => {
    if (!query) {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [notes]);

  const handleSortOrderChange = useCallback(() => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  }, []);

  const handleNoteSelect = useCallback((note) => {
    setSelectedNote(note);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedNote(null);
  }, []);

  return (
    <div className="app">
      <div className="sidebar-card">
        <Sidebar />
      </div>
      <div className="right-card">
        <header className="header">
          <SearchBar onSearch={handleSearch} />
          <button
            className="sort-button"
            onClick={handleSortOrderChange}
            aria-label={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
          >
            Sort {sortOrder === "asc" ? "↑" : "↓"}
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </header>
        
        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <NoteList
            notes={filteredNotes}
            onNoteClick={handleNoteSelect}
            onDelete={fetchNotes}
          />
        )}
        
        <NoteCreator onNoteCreated={fetchNotes} />
        
        {selectedNote && (
          <NoteModal
            note={selectedNote}
            onClose={handleModalClose}
            onUpdate={fetchNotes}
          />
        )}
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("jwt_token");
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainContent />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  );
};

export default App;