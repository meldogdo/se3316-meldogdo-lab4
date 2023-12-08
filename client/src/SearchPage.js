import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchHeroes from './SearchHeroes';

const SearchPage = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Check if token is missing
        if (!token) {
            navigate('/'); // Redirect to login if token is missing
        }
        // Optionally, you can add further validation for token's integrity or expiry
    }, [navigate, token]); // Dependencies for useEffect

    // If token is present, render the search component
    return (
        <div>
            {token ? (
                <div>
                    <nav>
                        {/* other navigation links */}
                        <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>
                            Logout
                        </button>
                    </nav>
                    <SearchHeroes />
                </div>
            ) : (
                <p>Please log in to search heroes.</p>
            )}
        </div>
    );
};

export default SearchPage;
