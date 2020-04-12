import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

import { elements, renderLoader, clearLoader } from './views/base';

/* global state of the app
*   - search object
*   - current recipe object
*   - shopping list object
*   - liked recipes
*/
const state = {};



/** SEARCH CONTROLLER **/
const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput(); // to-do
    console.log(query);

    if (query) {
        // 2) new search object and add to state
        state.search = new Search(query);

        // 3) prepare ui for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);

        try {
            // 4) search for recipes and parse ingredients
            await state.search.getResults();

            // 5) render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            console.log(error);
            alert('Something went wrong!');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', event => {
    // finds the closest element with th 'btn-inline' class
    const button = event.target.closest('.btn-inline');
    if (button) {
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});



/** RECIPE CONTROLLER **/
// this looks for changes in the URL hash
const controlRecipe = async () => {
    // get ID from the url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // prepare the ui for changes if there is an id
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // create new recipe object
        state.recipe = new Recipe(id);

        try {
            // get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calculate servings and time
            state.recipe.calculateTime();
            state.recipe.calculateServings();

            // render recipe
            clearLoader();
            console.log(state.recipe);
            recipeView.renderRecipe(state.recipe);

        } catch (error) {
            console.log(error);
            alert('Error processing recipe :(');
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

