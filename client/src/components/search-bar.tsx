import React, { useState } from 'react';
import '../styles/component-styles/search-bar.scss';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

function SearchBar( onSearch: SearchBarProps ) {
    const [query, setQuery] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSearch = () => {
        onSearch.onSearch(query);
    };

    return (
        <div className="search-container">
        <input
            type="text"
            value={query}
            onChange={handleInputChange}
            className="search-input"
            placeholder="Яйца, мляко, хляб..."
        />
        </div>
    );
};

export default SearchBar;