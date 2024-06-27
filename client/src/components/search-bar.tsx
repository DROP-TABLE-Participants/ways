import React, {useEffect, useState} from 'react';
import '../styles/component-styles/search-bar.scss';
import {useDebounce} from "use-debounce";

interface SearchBarProps {
    onSearch: (query: string) => void;
    query: string;
}

function SearchBar( props: SearchBarProps ) {
    const [query, setQuery] = useState(props.query);
    const [value] = useDebounce(query, 500);

    useEffect(() => {
        props.onSearch(value);
    }, [props, value]);
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
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