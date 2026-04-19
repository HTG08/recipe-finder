import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import "./components/Navbar";
import Footer from "./components/Footer";
import "./components/Footer.css";
import RecipeCard from "./components/RecipeCard";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favMeals, setFavMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vegOnly, setVegOnly] = useState(false);
  const [showFavs, setShowFavs] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {}, []);

  useEffect(() => {
    setFavMeals((prev) => {
      const prevIds = new Set(prev.map((m) => m.idMeal));
      const newMeals = recipes.filter(
        (m) => favorites.includes(m.idMeal) && !prevIds.has(m.idMeal),
      );
      const updated = [...prev, ...newMeals].filter((m) =>
        favorites.includes(m.idMeal),
      );
      return updated;
    });
  }, [favorites, recipes]);

  const fetchRecipes = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`,
      );
      const data = await res.json();
      setRecipes(data.meals || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredRecipes = recipes.filter((meal) => {
    if (!vegOnly) return true;
    return meal.strCategory === "Vegetarian";
  });

  return (
    <div className="app">
      <Navbar />

      <div className="container">
        <h1>🍲 Recipe Finder</h1>

        <div className="controls">
          <input
            type="text"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchRecipes()}
          />
          <button onClick={fetchRecipes}>Search</button>
          <button onClick={() => setVegOnly(!vegOnly)}>
            {vegOnly ? "Show All" : "Veg Only"}
          </button>
          <button onClick={() => setShowFavs(true)}>
            ❤️ Favourites ({favorites.length})
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : !hasSearched ? (
          <p>Search for a recipe above to get started 🍴</p>
        ) : filteredRecipes.length === 0 ? (
          <p>No recipes found</p>
        ) : (
          <div className="grid">
            {filteredRecipes.map((meal) => (
              <RecipeCard
                key={meal.idMeal}
                meal={meal}
                isFav={favorites.includes(meal.idMeal)}
                toggleFavorite={toggleFavorite}
                openPopup={setSelectedMeal}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAVOURITES PANEL */}
      {showFavs && (
        <div className="modal-overlay" onClick={() => setShowFavs(false)}>
          <div className="favs-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>❤️ Favourites</h2>
              <button onClick={() => setShowFavs(false)}>✕ Close</button>
            </div>

            <div className="favs-list">
              {favMeals.length === 0 ? (
                <p style={{ padding: "20px", color: "#888" }}>
                  No favourites yet. Heart a recipe to save it here!
                </p>
              ) : (
                favMeals.map((meal) => (
                  <div key={meal.idMeal} className="fav-item">
                    <img src={meal.strMealThumb} alt={meal.strMeal} />
                    <span>{meal.strMeal}</span>
                    <div className="fav-item-actions">
                      <button
                        onClick={() => {
                          setSelectedMeal(meal);
                          setShowFavs(false);
                        }}
                      >
                        View
                      </button>
                      <button onClick={() => toggleFavorite(meal.idMeal)}>
                        ❌
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* RECIPE MODAL */}
      {selectedMeal && (
        <div className="modal-overlay" onClick={() => setSelectedMeal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedMeal.strMeal}</h2>
              <button onClick={() => setSelectedMeal(null)}>✕ Close</button>
            </div>

            <div className="modal-body">
              <div className="modal-image-side">
                <img
                  src={selectedMeal.strMealThumb}
                  alt={selectedMeal.strMeal}
                />
              </div>

              <div className="modal-content-side">
                <h3>Ingredients</h3>
                <ul className="ingredients-list">
                  {Array.from({ length: 20 }, (_, i) => i + 1)
                    .map((i) => ({
                      ingredient: selectedMeal[`strIngredient${i}`],
                      measure: selectedMeal[`strMeasure${i}`],
                    }))
                    .filter(({ ingredient }) => ingredient && ingredient.trim())
                    .map(({ ingredient, measure }, idx) => (
                      <li key={idx}>
                        {measure && measure.trim() ? `${measure.trim()} ` : ""}
                        {ingredient}
                      </li>
                    ))}
                </ul>

                <h3>Instructions</h3>
                <p>{selectedMeal.strInstructions}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
