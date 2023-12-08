import React, { useState, useEffect } from 'react';

const PublicHeroLists = () => {
    const [heroLists, setHeroLists] = useState([]);

    useEffect(() => {
        const fetchHeroLists = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/public-hero-lists'); // Adjust the URL as needed
                const data = await response.json();
                setHeroLists(data);
            } catch (error) {
                console.error('Error fetching public hero lists:', error);
            }
        };

        fetchHeroLists();
    }, []);

    return (
        <div>
            <h3>Public Hero Lists</h3>
            {heroLists.length > 0 ? (
                <ul>
                    {heroLists.map((list, index) => (
                        <li key={index}>
                            <p>Name: {list.name}</p>
                            <p>Creator: {list.creatorNickname}</p>
                            <p>Number of Heroes: {list.heroes.length}</p>
                            <p>Average Rating: {list.averageRating.toFixed(2)}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No public hero lists available.</p>
            )}
        </div>
    );
};
