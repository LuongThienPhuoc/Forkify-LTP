import { API_URL, API_SEARCH_RESULTS, RESULTS_PER_PAGE, KEY } from './config.js'
import { getJSON, sendJSON } from './helper.js'
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RESULTS_PER_PAGE
    },
    bookmarks: []
}

const createRecipeObject = (data) => {
    const { recipe } = data.data;
    return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key })
    }
}

const localStorageBookmarked = () => {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const loadRecipe = async (id) => {
    try {
        const data = await getJSON(`${API_URL}/${id}`)
        const { recipe } = data.data
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients
        }

        if (state.bookmarks.some(bookmark => bookmark.id === id)) {
            state.recipe.bookmarked = true
        } else {
            state.recipe.bookmarked = false
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const loadSearchResults = async (query) => {
    try {
        state.search.query = query
        const data = await getJSON(`${API_SEARCH_RESULTS}?search=${query}`)
        console.log(data.data.recipes)
        state.search.results = data.data.recipes.map(recipe => {
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url
            }
        })
        state.search.page = 1
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const getSearchResultsPage = (page = state.search.page) => {
    state.search.page = page
    return state.search.results.slice((page - 1) * 10, page * 10 - 1)
}

export const updateServing = (amount) => {

    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * amount) / state.recipe.servings
    })

    state.recipe.servings = amount
}

export const addBookmark = (recipe) => {
    state.bookmarks.push(recipe);
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true
    localStorageBookmarked()
}

export const deleteBookmark = (id) => {
    const index = state.bookmarks.findIndex(el => el.id === id)
    state.bookmarks.splice(index, 1);
    if (id === state.recipe.id) state.recipe.bookmarked = false
    localStorageBookmarked()
}

const init = () => {
    const bookmarks = localStorage.getItem('bookmarks');
    if (bookmarks) {
        state.bookmarks = JSON.parse(bookmarks)
    }
    console.log(JSON.parse(bookmarks))
}

init()

export const uploadRecipe = async (newRecipe) => {
    try {
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
            .map(ing => {
                const ingArr = ing[1].replaceAll(' ', '').split(',');
                if (ingArr.length !== 3) throw new Error('Wrong format')

                const [quantity, unit, description] = ingArr
                return { quantity: quantity ? +quantity : null, unit, description }
            })

        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: newRecipe.cookingTime,
            servings: newRecipe.servings,
            ingredients
        }

        const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe)
        state.recipe = createRecipeObject(data);
        addBookmark(state.recipe)
        console.log(data)
    } catch (err) {
        throw (err)
    }
}