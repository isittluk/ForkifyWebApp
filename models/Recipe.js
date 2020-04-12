import axios from 'axios';
import { key } from '../js/config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const result = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            console.log(result);
            this.title = result.data.recipe.title;
            this.author = result.data.recipe.publisher;
            this.image = result.data.recipe.image_url;
            this.url = result.data.recipe.source_url;
            this.ingredients = result.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    calculateTime() {
        // assuming that we need 15 mins for each 3 ingredients
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients / 3);
        this.time = periods * 15;
    }

    calculateServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];
        // loop over ingredients and save a value into newIngredients every iteration
        const newIngredients = this.ingredients.map(element => {
            // 1. uniform units

            let ingredient = element.toLowerCase();

            // replace unitsLong with corresponding unitsShort
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2. remove parantheses

            // '/ *\([^]*\) */' is a 'regular expression'
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3. parse ingredients into count, unit and ingredient

            const arrIngredient = ingredient.split(' ');
            const unitIndex = arrIngredient.findIndex(element2 => units.includes(element2));

            let objectIngredient;
            if (unitIndex > -1) {
                // means 'if there is a unit'
                // Ex. 4 1/2 cups, arrayCount will be [4, 1/2] --> 4+1/2
                // Ex. 4 cups, arrayCount will be [4]
                const arrayCount = arrIngredient.slice(0, unitIndex);
                let count;
                if (arrayCount.length === 1) {
                    count = eval(arrIngredient[0].replace('-', '+'));
                } else {
                    count = eval(arrIngredient.slice(0, unitIndex).join('+'));
                }

                objectIngredient = {
                    count,
                    unit: arrIngredient[unitIndex],
                    ingredient: arrIngredient.slice(unitIndex + 1).join(' ')
                };

            }  else if (parseInt(arrIngredient[0], 10)) {
                // means 'there is no unit, but 1st element is a number
                objectIngredient = {
                    count: parseInt(arrIngredient[0], 10),
                    unit: '',
                    ingredient: arrIngredient.slice(1).join(' ')
                }
            }  else if (unitIndex === -1) {
                // means 'if there is no unit and no number in 1st element'
                objectIngredient = {
                    count: 1,
                    unit: '',
                    // ingredient: ingredient 
                    ingredient
                }
            }
            return objectIngredient;
        });
        this.ingredients = newIngredients;
    }





    
}