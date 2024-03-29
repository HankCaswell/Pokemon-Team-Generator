import { useState, useEffect } from 'react';
import axios from "axios";
import './App.css';

function App() {
  const [pokemonData, setPokemonData] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState('');
  const [pokemonDetails, setPokemonDetails] = useState(null)
  const [error, setError] = useState(null);


  useEffect(() => {
    if(selectedPokemon) {
      const fetchPokemonDetails = async () => {
        try{
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`);
          setPokemonDetails(response.data)
        }
        catch (error) {
            setError(error.message)
          }
        };
        fetchPokemonDetails();
      }
    }, [selectedPokemon]);

  
  const getRandomPokemonNumber = () => {
    return Math.floor(Math.random() * 800) + 1; // Adjust max number if API's total number of Pokemon changes
  };

  const getpokemon = async (randomPokemonNumber) => {
    try {
      
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomPokemonNumber}`);
      const data = response.data;
      setPokemonData([data]); // Set an array with a single Pokemon object
      getFivePokemon(data.types[0].type.name);
    } catch (error) {
      setError(error.message);
      
    }
  };

  const getFivePokemon = async (pokemonType) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/type/${pokemonType}`);
      let pokemons = response.data.pokemon.map(p => p.pokemon);
  
      // Generate an array of random, unique indices based on the pokemons array length
      let indices = [];
      while (indices.length < 6 && indices.length < pokemons.length) {
        let randIndex = Math.floor(Math.random() * pokemons.length);
        if (!indices.includes(randIndex)) {
          indices.push(randIndex);
        }
      }
  
      // Fetch details for the randomly selected Pokemon
      const pokemonDetails = await Promise.all(indices.map(async (index) => {
        const pokemonUrl = pokemons[index].url;
        const res = await axios.get(pokemonUrl);
        return res.data;
      }));
  
      setPokemonData(pokemonDetails);
      
    } catch (error) {
      setError(error.message);
    }
  };
  

  const handleFetchPokemon = () => {
    const randomPokemonNumber = getRandomPokemonNumber();
    getpokemon(randomPokemonNumber);
  };

  return (
    
    
    <div className="container">
      <h1>Pokemon Theme Team</h1>
      <button onClick={handleFetchPokemon} className="fetch-btn">GET POKEMON
      </button>
      
      

      {pokemonData && (
        <>
      <select value={selectedPokemon} onChange={(e) => setSelectedPokemon(e.target.value)} className="pokemon-select">
      <option value="">Select a Pokémon</option>
      {pokemonData.map((pokemon) => (
        <option key={pokemon.name} value={pokemon.name}>
          {pokemon.name.toUpperCase()}
        </option>
      ))}
    </select>

    {pokemonDetails  && (
      <table className='pokemon-details'>
        <tbody>
          <tr>
            <th>Name</th>
            <td>{pokemonDetails.name.toUpperCase()}</td>
          </tr>
          <tr>
            <th>Weight</th>
            <td>{pokemonDetails.weight}</td>
          </tr>
          <tr>
            <th>Height</th>
            <td>{pokemonDetails.height}</td>
          </tr>
          <tr>
            <th>HP</th>
            <td>{pokemonDetails.stats[0].base_stat}</td>
          </tr>
          <tr>
            <th>HP</th>
            <td>{pokemonDetails.stats[0].base_stat}</td>
          </tr>
          <tr>
            <th>Attack</th>
            <td>{pokemonDetails.stats[1].base_stat}</td>
          </tr>
          <tr>
            <th>Defense</th>
            <td>{pokemonDetails.stats[2].base_stat}</td>
          </tr>
          <tr>
            <th>Special Attack</th>
            <td>{pokemonDetails.stats[3].base_stat}</td>
          </tr>
          <tr>
            <th>Special Defense</th>
            <td>{pokemonDetails.stats[4].base_stat}</td>
          </tr>
          <tr>
            <th>Speed</th>
            <td>{pokemonDetails.stats[5].base_stat}</td>
          </tr>
        </tbody>
      </table>
    )}
        <div className="pokemonImages">
          {pokemonData.map((pokemon) => (
            <div key={pokemon.name}>
              <img src={pokemon.sprites.front_default} alt={pokemon.name}/>
              <h3>{pokemon.name.toUpperCase()}</h3>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
    
  );
}

export default App;

