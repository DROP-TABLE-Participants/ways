import React, { useState } from 'react';

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
        <div>
            <input type="text" value={query} onChange={handleInputChange} />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;