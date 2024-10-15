import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('chicken');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getRecipes();
  }, [query]);

  const getRecipes = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.get(
        `https://api.edamam.com/search?q=${query}&app_id=39bd7e25&app_key=
        276c698d0bc67f00fd620a11f3914547`
      );
      setRecipes(response.data.hits);
    } catch (error) {
      setErrorMsg('An error occurred while fetching recipes. Please try again.');
    }
    setIsLoading(false);
  };

  const updateSearch = e => {
    setSearch(e.target.value);
  };

  const getSearch = e => {
    e.preventDefault();
    setQuery(search);
    setSearch('');
  };

  return (
    <div className="App">
      <form onSubmit={getSearch} className="search-form">
        <input
          type="text"
          className="search-bar"
          placeholder="Search for recipes"
          value={search}
          onChange={updateSearch}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {isLoading && <div className="loading">Loading recipes...</div>}
      {errorMsg && <div className="error">{errorMsg}</div>}
      {!isLoading && !errorMsg && recipes.length === 0 && (
        <div className="no-results">No Results Found For "{query}"</div>
      )}
      {!isLoading &&
        !errorMsg &&
        recipes.length > 0 &&
        recipes.map(recipe => (
          <div key={recipe.recipe.label} className="recipe">
            <h2 className="recipe-title">{recipe.recipe.label}</h2>
            <img
              src={recipe.recipe.image}
              alt={recipe.recipe.label}
              className="recipe-image"
            />
            <div className="recipe-details">
              <div className="recipe-ingredients">
                <h3 className="details-title">Ingredients:</h3>
                <ul className="ingredients-list">
                  {recipe.recipe.ingredients.map(ingredient => (
                    <li key={ingredient.text} className="ingredient">
                      {ingredient.text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="recipe-nutrition">
                <h3 className="details-title">Nutrition:</h3>
                <ul className="nutrition-list">
                  <li className="nutrition-item">
                    Calories: {Math.round(recipe.recipe.calories)} kcal
                  </li>
                  <li className="nutrition-item">
                    Total Fat: {Math.round(recipe.recipe.totalNutrients.FAT.quantity)} g
                  </li>
                  <li className="nutrition-item">
                    Protein: {Math.round(recipe.recipe.totalNutrients.PROCNT.quantity)} g
                  </li>
                  <li className="nutrition-item">
                    Carbs: {Math.round(recipe.recipe.totalNutrients.CHOCDF.quantity)} g
                  </li>
                </ul>
              </div>
            </div>
            <a
              href={recipe.recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="recipe-link"
            >
              View Recipe
            </a>
          </div>
        ))}
    </div>
  );
}

export default App;
