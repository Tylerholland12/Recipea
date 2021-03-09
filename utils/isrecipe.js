// Import spoonacular
const recipe = require('spoonacular_api');

// check to see if recipe exists
module.exports = (address) => {
    if (!recipe.utils.recipe(address)) {
        throw new Error("incorrect recipe name");

    }
    return true;
}