// Create an app object (app)

// Initialize preset data in the dedicated properties
// - apiURL
// https://www.themealdb.com/api/json/v1/1/categories.php  (display categories)
// https://www.themealdb.com/api/json/v1/1/filter.php?c=beef  (food by categories)
// https://www.themealdb.com/api/json/v1/1/lookup.php?i=52874  (search by ID number)
// - userQuery


// MVP
// Give user food categories to choose from "The Meal DB" api
// display 3 random food from that category 

// STRETCH GOALS
// Once user clicks one of the 3 food options, display prep instructions and ingredients
// When displaying the meal, display video as well

// Pseudo Code
// Create an app object (app)
// Create an init method to setup and start the application
// Make an Api method (getCategory) to display all the food categories user can choose from
// diplay the categories as images appened inside 'li's
// each 'li' will have images and title
// using a forEach loop, event listeners will be added to the 'Li's
// Based on the userInput, make another API call which takes the user input as a parameter.
// When the API call is successful, randomly select 3 meals to display to the user from all the food in that category.
// using Math.floor(Math.random) generate 3 random numbers
// use conditionals to make sure the 3 numbers aren't the same 
// using the 3 random numbers, select 3 random meal from the category
// append the meals inside another ul
// the meals will display an image and title inside li
// If the API call fails, display an error message

// console.log("Hello, world!");

// namespace app
const masterChef = {};

// namespace variables
masterChef.categories = []
masterChef.meals = [];
masterChef.tempMeals = [];
masterChef.categoriesWrapper = document.querySelector('ul.categoriesWrapper');
masterChef.mealSelectionsWrapper = document.querySelector('ul.mealSelectionsWrapper');
masterChef.buttonsContainer = document.querySelector('.buttonsContainer');


masterChef.displayMeals = () => {
	masterChef.categoriesWrapper.innerHTML = "";
	masterChef.mealSelectionsWrapper.innerHTML = "";
	const randomMeals = [];

	if (masterChef.tempMeals.length != 0) {
		for (let i = 0; i < Math.min(3, masterChef.tempMeals.length + 1); i++) {
			const randomNumberIndex = Math.floor(Math.random() * masterChef.tempMeals.length);
			randomMeals.push(masterChef.tempMeals.splice(randomNumberIndex, 1)[0]);
		}
	} else {
		// throw error message
		masterChef.mealSelectionsWrapper.innerHTML = "You're out of meals";
	} 
	console.log(masterChef.tempMeals);

	randomMeals.forEach((meal) => {
		const mealLi = document.createElement('li');
		mealLi.classList.add(meal.idMeal);
		mealLi.innerHTML = `
            <h2 class="${meal.idMeal}">${meal.strMeal}<h2>
            <div class="imageContainer">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="${meal.idMeal}" />
            </div>
        `;
		console.log(meal.idMeal);
		console.log(mealLi);
		masterChef.mealSelectionsWrapper.append(mealLi);
	});


	masterChef.buttonsContainer.classList.toggle('hideButton');
}

// functions
masterChef.getMealsByCategory = (category) => {
	// get the categories
	const url = new URL('https://www.themealdb.com/api/json/v1/1/filter.php')
	url.search = new URLSearchParams({
		c: category
	});

	fetch(url).then((response) => {
		return response.json();
	}).then((jsonResults) => {
		// console.log(jsonResults.meals);
		masterChef.meals = jsonResults.meals;
		masterChef.tempMeals = masterChef.meals.slice(0, masterChef.meals.length);
		masterChef.displayMeals();

	});
}

masterChef.displayCategories = () => {
	masterChef.mealSelectionsWrapper.innerHTML = ''
	masterChef.categories.forEach((category) => {
		const categoryLi = document.createElement('li');
		categoryLi.innerHTML = `
            <h2 class="${category.strCategory}">${category.strCategory}<h2>
            <div class="imageContainer">
                <img src="${category.strCategoryThumb}" alt="${category.strCategory} meal" class="${category.strCategory}" />
            </div>
        `
		categoryLi.classList.add(`${category.strCategory}`);
		// console.log(categoryLi);
		masterChef.categoriesWrapper.append(categoryLi);
	});
}


masterChef.getCategories = () => {
	// get the categories
	const url = new URL('https://www.themealdb.com/api/json/v1/1/categories.php')
	fetch(url).then((response) => {
		return response.json();
	}).then((jsonResults) => {
		// console.log(jsonResults.categories);
		masterChef.categories = jsonResults.categories;
		masterChef.displayCategories();
	});
}

masterChef.init = () => {
	// console.log('💪😎🎶🐱‍🏍🐱‍👤');
	masterChef.getCategories();
	masterChef.categoriesWrapper.addEventListener('click', (event) => {
		if (event.target.tagName != "UL") {
			const mealType = event.target.className;
			// console.log(mealType.toLowerCase());
			masterChef.getMealsByCategory(mealType.toLowerCase());

			// console.log(event.target.className);
			// if (event.target.className === )

		}
	})
	masterChef.buttonsContainer.addEventListener('click', (event) => {
		console.log(event.target.className);
		if (event.target.className === "backToCategory") {
			masterChef.buttonsContainer.classList.toggle('hideButton');
			masterChef.displayCategories()
		} else if (event.target.className === "newMeals") {
			masterChef.buttonsContainer.classList.toggle('hideButton');
			masterChef.displayMeals()
		}
	})
}


masterChef.init();