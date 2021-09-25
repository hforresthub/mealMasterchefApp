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


// namespace app
const masterChef = {};

// namespace variables
masterChef.categories = []
masterChef.meals = [];
masterChef.tempMeals = [];
masterChef.categoriesWrapper = document.querySelector('ul.categoriesWrapper');
masterChef.mealSelectionsWrapper = document.querySelector('ul.mealSelectionsWrapper');
masterChef.buttonsContainer = document.querySelector('.buttonsContainer');
masterChef.h2Instruction = document.querySelector('h2');
masterChef.theMeal = document.querySelector('.theMeal');

// functions
masterChef.displayMealInfo = (meal) => {
	console.log(meal);
	masterChef.mealSelectionsWrapper.innerHTML = '';
	masterChef.h2Instruction.classList.add('hideElement');

	masterChef.theMeal.innerHTML = `
		<h4>${meal.strMeal}</h4>
		<div class="imageContainer">
			<img src="${meal.strMealThumb}" alt="${meal.strMeal}">
		</div>
		<div class="textContent">
			<ul class="ingredients">
			</ul>
			<div class="mealPrepInstructions">
				<ul class="mealPrepSteps">
				</ul>
			</div>
		</div>
		<div class="videoContent">
		</div>
		`
		// <iframe width="420" height="315" src="${meal.strYoutube.replace('watch?v=', 'embed/')}"></iframe>
	const ingredientsUl = document.querySelector('.ingredients');

	let n = 1;
	for (ingredient in meal) {
		if (ingredient == `strIngredient${n}`) {
			if (meal[ingredient] != '' || meal[ingredient] != '') {
				const ingredientLi = document.createElement('li');
				ingredientLi.innerHTML = meal[ingredient];
				ingredientsUl.append(ingredientLi);
			}
			n++;

		}
	}

	const mealPrepStepsArr = meal.strInstructions.replaceAll('\r', '').split('\n');
	console.log(mealPrepStepsArr);
	const mealPrepSteps = document.querySelector('.mealPrepSteps');
	for (step of mealPrepStepsArr) {
		const newLi = document.createElement('li');
		if (step !== '') {
			newLi.textContent = step;
			mealPrepSteps.append(newLi);
		}
	}

	if (meal.strYoutube) {
		const video = document.createElement('iframe');
		const videoContent = document.querySelector('.videoContent');
		video.src = meal.strYoutube.replace('watch?v=', 'embed/');
		videoContent.append(video);
	}

}

masterChef.getMealById = (id) => {
	// get the meal
	const url = new URL('https://www.themealdb.com/api/json/v1/1/lookup.php')
	url.search = new URLSearchParams({
		i: id
	});

	fetch(url).then((response) => {
		return response.json();
	}).then((jsonResults) => {
		const meal = jsonResults.meals[0];
		masterChef.displayMealInfo(meal);

	});

}

masterChef.displayMeals = () => {
	masterChef.buttonsContainer.classList.remove('hideElement');
	document.querySelector('.newMealsButton').classList.remove('hideElement')
	masterChef.categoriesWrapper.innerHTML = "";
	masterChef.mealSelectionsWrapper.innerHTML = "";
	masterChef.h2Instruction.innerHTML = "Here are your meals! 😎"
	masterChef.h2Instruction.classList.remove('hideElement');
	const randomMeals = [];

	if (masterChef.tempMeals.length != 0) {
		for (let i = 0; i < Math.min(3, masterChef.tempMeals.length + 1); i++) {
			const randomNumberIndex = Math.floor(Math.random() * masterChef.tempMeals.length);
			randomMeals.push(masterChef.tempMeals.splice(randomNumberIndex, 1)[0]);
		}
	} else {
		// throw error message
		masterChef.h2Instruction.innerHTML = "You're out of meals";
	}

	randomMeals.forEach((meal) => {
		const mealLi = document.createElement('li');
		mealLi.classList.add(meal.idMeal);
		mealLi.innerHTML = `
            <h3 class="${meal.idMeal}">${meal.strMeal}</h3>
            <div class="imageContainer">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="${meal.idMeal}" />
            </div>
        `;
		masterChef.mealSelectionsWrapper.append(mealLi);
	});
}

masterChef.getMealsByCategory = (category) => {
	// get the categories
	const url = new URL('https://www.themealdb.com/api/json/v1/1/filter.php')
	url.search = new URLSearchParams({
		c: category
	});

	fetch(url).then((response) => {
		return response.json();
	}).then((jsonResults) => {
		masterChef.meals = jsonResults.meals;
		masterChef.tempMeals = masterChef.meals.slice(0, masterChef.meals.length);
		masterChef.displayMeals();

	});
}

masterChef.displayCategories = () => {
	masterChef.mealSelectionsWrapper.innerHTML = ''
	masterChef.theMeal.innerHTML = '';
	masterChef.h2Instruction.classList.remove('hideElement');
	masterChef.h2Instruction.innerHTML = "Click on a Category to get your 3 random meals! 😁"
	masterChef.categories.forEach((category) => {
		const categoryLi = document.createElement('li');
		categoryLi.innerHTML = `
            <h3 class="${category.strCategory}">${category.strCategory}</h3>
            <div class="imageContainer">
                <img src="${category.strCategoryThumb}" alt="${category.strCategory} meal" class="${category.strCategory}" />
            </div>
        `
		categoryLi.classList.add(`${category.strCategory}`);
		masterChef.categoriesWrapper.append(categoryLi);
	});
}


masterChef.getCategories = () => {
	// get the categories
	const url = new URL('https://www.themealdb.com/api/json/v1/1/categories.php')
	fetch(url).then((response) => {
		return response.json();
	}).then((jsonResults) => {
		masterChef.categories = jsonResults.categories;
		masterChef.displayCategories();
	});
}

masterChef.init = () => {
	masterChef.getCategories();
	masterChef.categoriesWrapper.addEventListener('click', (event) => {
		if (event.target.tagName != "UL") {
			const mealType = event.target.className;
			masterChef.getMealsByCategory(mealType.toLowerCase());
		}
	})
	masterChef.buttonsContainer.addEventListener('click', (event) => {
		if (event.target.className.includes("backToCategoryButton")) {
			masterChef.buttonsContainer.classList.add('hideElement');
			masterChef.displayCategories()
		} else if (event.target.className.includes("newMealsButton")) {
			masterChef.buttonsContainer.classList.remove('hideElement');
			masterChef.displayMeals()
		}
	})
	masterChef.mealSelectionsWrapper.addEventListener('click', (event) => {
		if (event.target.tagName != "UL") {
			document.querySelector('.newMealsButton').classList.add('hideElement');
			const showTheMeal = event.target.className;
			masterChef.getMealById(showTheMeal);
		}
	})
}


masterChef.init();