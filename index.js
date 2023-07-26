//making an API to take fruits inputted and show the nutritional value (calories) of the fruits/fruit salad

const fruitForm = document.querySelector("#inputSection form");
const fruitList = document.querySelector("#fruitSection ul");
const fruitNutrition = document.querySelector("#nutritionSection p");
const createForm = document.querySelector("#createForm");

let cal = 0;
let fruitCal = {};

fruitForm.addEventListener("submit", extractFruit);
createForm.addEventListener("submit", createNewFruit);

function extractFruit(event) {
	event.preventDefault();
	fetchFruitData(event.target.fruitInput.value);
	event.target.fruitInput.value = "";
}
//there's gonna be an event, for the target of the value of the fruitinput id
// after you've logged it, turn it to an empty string (which clears the form input box)

function fetchFruitData(fruit) {
	fetch(`https://fruitsaladbackend.onrender.com/${fruit}`)
		.then((resp) => resp.json())
		.then((data) => addFruit(data))
		.catch((event) => console.log(event));
}

function addFruit(fruit) {
	const li = document.createElement("li"); // how to create element
	li.textContent = fruit.name; // created a fruit list element
	li.addEventListener("click", removeFruit, { once: true }); // creates an event to remove the fruit once you click it
	fruitList.appendChild(li); // adds the list item to the fruit list

	fruitCal[fruit.name] = fruit.nutritions.calories; //telling fruitCal - the empty object - to access the calories by going through fruit.nutritions.calories;
	console.log(fruitCal);

	cal += fruit.nutritions.calories;
	fruitNutrition.textContent = cal;
}

function removeFruit(event) {
	const fruitName = event.target.textContent;
	cal -= fruitCal[fruitName];
	fruitNutrition.textContent = cal;
	event.target.remove();
}

async function createNewFruit(event) {
	event.preventDefault();

	const data = { name: event.target.fruitInput.value };

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify(data),
	};

	const response = await fetch(
		"https://fruitsaladbackend.onrender.com",
		options
	);

	let messageStatus = document.querySelector("#message");
	if (response.status === 201) {
		event.target.fruitInput.value = "";
		messageStatus.textContent = "Fruit successfully created";
		setTimeout(() => {
			messageStatus.textContent = "";
		}, 4000); // counts in milliseconds, if there's no message, the message will clear itself
	} else {
		event.target.fruitInput.value = "";
		messageStatus.textContent =
			"This fruit already exists. Please add a different fruit";
		setTimeout(() => {
			messageStatus.textContent = "";
		}, 4000);
	}
}
