function RecipeCard({ meal, isFav, toggleFavorite, openPopup }) {
  return (
    <div className="card">
      <img src={meal.strMealThumb} alt={meal.strMeal} />

      <h3>{meal.strMeal}</h3>

      <div className="card-buttons">
        <button onClick={() => openPopup(meal)}>Show Recipe</button>

        <button onClick={() => toggleFavorite(meal.idMeal)}>
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
}

export default RecipeCard;
