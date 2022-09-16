import 'core-js/stable'; // Polyfilling anything else
import 'regenerator-runtime/runtime'; // Polyfilling Async-Await
import { MODAL_CLOSE_SEC } from './config';
import * as model from './model';
import addRecipeView from './views/addRecipeView';
import bookmarksView from './views/bookmarksView';
import paginationView from './views/paginationView';
import recipeView from './views/recipeView';
import resultsView from './views/resultsView';
import searchView from './views/searchView';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async () => {
  try {
    // Identify Url Hash
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render Spinner
    recipeView.renderSpinner();

    // 1. Update results to view mark selected search result
    resultsView.update(model.getSearchedResultsPage());

    // 2. Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 3. Loading Recipe
    await model.loadRecipe(id);

    // 4. Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchedResults = async () => {
  try {
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    // Load search results
    await model.loadSearchedResults(query);

    // Render results
    resultsView.render(model.getSearchedResultsPage(1));

    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = goToPage => {
  // Render new results
  resultsView.render(model.getSearchedResultsPage(goToPage));

  // Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = newServings => {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  // Add or Remove a bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe View
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload New Recipe Data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render Bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close Form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchedResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
