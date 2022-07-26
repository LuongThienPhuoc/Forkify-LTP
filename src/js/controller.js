import * as model from './model.js'
import recipeView from './view/recipeView'
import searchResultsView from './view/searchResultsView.js';
import resultsView from './view/resultsView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config'

import 'core-js/stable';
import 'regenerator-runtime/runtime'

if (module.hot) {
  module.hot.accept()
}

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

const controlRecipes = async () => {
  try {
    // get id
    const id = window.location.hash.slice(1);
    console.log(id)
    if (!id) return;

    // Loading
    recipeView.renderSpinner()
    await model.loadRecipe(id)

    // Render
    recipeView.render(model.state.recipe)
    bookmarksView.update(model.state.bookmarks)
  } catch (err) {
    recipeView.renderError();
    console.log(err)
  }
}

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner()

    const query = searchResultsView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query)

    // resultsView.render(model.state.search.results)
    resultsView.render(model.getSearchResultsPage(1))

    // Render pagination
    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err)
  }
}

const controlPagination = (goToPage) => {
  resultsView.render(model.getSearchResultsPage(goToPage))
  paginationView.render(model.state.search)
}

const controlServing = (amountServings) => {
  model.updateServing(amountServings)
  // recipeView.render(model.state.recipe)
  recipeView.update(model.state.recipe)
}

const controlAddBookmark = () => {
  // Add or remove
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe)
  } else {
    model.deleteBookmark(model.state.recipe.id)
  }
  recipeView.update(model.state.recipe)
  bookmarksView.render(model.state.bookmarks)
}

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async (newRecipe) => {
  try {
    addRecipeView.renderSpinner()

    await model.uploadRecipe(newRecipe)

    recipeView.render(model.state.recipe)

    addRecipeView.renderMessage()

    bookmarksView.render(model.state.bookmarks)

    setTimeout(() => {
      addRecipeView.toggleClass()
    }, MODAL_CLOSE_SEC * 1000)
  } catch (err) {
    console.error(err)
    addRecipeView.renderError(err.message)
  }
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes)
  recipeView.addHandlerUpdateServings(controlServing)
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchResultsView.addHandlerSearch(controlSearchResults)
  paginationView.addHandlerClick(controlPagination)
  addRecipeView.addHandlerUpload(controlAddRecipe)
}
init()
