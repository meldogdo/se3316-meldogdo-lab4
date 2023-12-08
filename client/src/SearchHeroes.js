import React, { useState } from 'react';


const SearchHeroes = () => {
    const [searchParams, setSearchParams] = useState({ name: '', race: '', power: '', publisher: '' });
    const [searchResults, setSearchResults] = useState([]);
    const [selectedHero, setSelectedHero] = useState(null);

    const handleChange = (e) => {
        // Trim whitespace and convert to lowercase for soft-matching
        const value = e.target.value.trim().toLowerCase();
        setSearchParams({ ...searchParams, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSelectedHero(null); // Reset selected hero on new search
        try {
            const query = new URLSearchParams(searchParams).toString();
            const response = await fetch(`http://localhost:4000/api/heros/search?${query}`, {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
             
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleDetailsClick = (hero) => {
        setSelectedHero(hero);
    };

    const searchOnDDG = (heroName) => {
        const url = `https://duckduckgo.com/?q=${encodeURIComponent(heroName)}`;
        window.open(url, '_blank');
    };



    return (
        <div>
            <h2>Search Heroes</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" value={searchParams.name} onChange={handleChange} placeholder="Name" />
                <input name="race" value={searchParams.race} onChange={handleChange} placeholder="Race" />
                <input name="power" value={searchParams.power} onChange={handleChange} placeholder="Power" />
                <input name="publisher" value={searchParams.publisher} onChange={handleChange} placeholder="Publisher" />
                <button type="submit">Search</button>
            </form>

            {searchResults.length > 0 && (
                <ul>
                    {searchResults.map((hero, index) => (
                        <li key={index}>
                            {hero.name} - {hero.publisher}
                            <button onClick={() => handleDetailsClick(hero)}>Show Details</button>
                            <button onClick={() => searchOnDDG(hero.name)}>Search on DDG</button>
                            {selectedHero && selectedHero.id === hero.id && (
                                <div>
                                    <p>Race: {hero.Race}</p>
                                    <p>Gender: {hero.Gender}</p>
                                    <p>Height: {hero.Height}</p>
                                    <p>Weight: {hero.Weight}</p>
                                    <p>Eye color: {hero['Eye color']}</p>
                                    <p>Hair color: {hero['Hair color']}</p>
                                    <p>Alignment: {hero.Alignment}</p>
                                    <p>Powers: {hero.superPowers.join(', ')}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchHeroes;
