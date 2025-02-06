import React from 'react';
import { CiSearch } from "react-icons/ci";
import "./SearchBar.css"


const SearchBar = ({ onSearch }) => {
  return (
    <div className="search-bar">
      <div className='search-bar-card'>
        <CiSearch/>
        <input
          className='serach-input'
          type="text"
          placeholder="Search notes..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;