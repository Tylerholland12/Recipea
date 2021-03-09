const recipe = require('spoonacular_api');

module.exports = (address) => {
    if (!recipe.utils.recipe(address)) {
        throw new Error("incorrect recipe name");

    }
    return true;
}