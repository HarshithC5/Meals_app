const searchBar = document.querySelector(".search-food");
const searchResults = document.querySelector(".results");
const mealDetails = document.querySelector(".details");
const fav = document.querySelector(".fav");

let counter = 1;

//Getting meals list from first letter
searchBar.addEventListener("input", async (e) => {
    const searchValue = e.target.value;
    const firstLetter = searchValue[0]; //To get the first letter in the search bar

    searchResults.textContent = "";
    if (searchValue.length === 0) {
        searchResults.style.display = "none";
        return;
    }
    
    //fetching data using API using first letter
    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}` 
    );

    const data = await response.json(); // Converting data into JSON format

    let searchLimit = 1;

    //limiting the no. of meals to 10 to be shown on screen
    for (let meal of data.meals) {
        if (searchLimit > 10) {
            break;
        }
        searchLimit++;

        const mealName = meal.strMeal;

        if (mealName.includes(searchValue)){ 

            const li = document.createElement("li");
            li.textContent = meal.strMeal;
            searchResults.appendChild(li);

        }
        
    }

    // Display results if greater than 0
    if (searchResults.children.length > 0) {
        searchResults.style.display = "flex";
    } else {
        searchResults.style.display = "none";
    }
});

//event listener for searched results
searchResults.addEventListener("click", async (e) => {
    mealDetails.style.display = "grid";

    const food = e.target.textContent;

    //search API with food
    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`
    );
    const data = await response.json();

    mealDetails.textContent = "";

    //creating image element
    const image = document.createElement("img");
    image.className = "image";
    image.src = data.meals[0].strMealThumb;

    const title = document.createElement("div");
    title.className = "title";

    //creating title element
    const text = document.createElement("div");
    text.className = "text";
    text.textContent = data.meals[0].strMeal;

    const name = data.meals[0].strMeal;

    //favourites icon
    const icon = document.createElement("img");
    let flag = false;

    //checking the local storage for the meal name, if its present or not
    for (let i = 0; i < window.localStorage.length; i++) {
        if (JSON.parse(localStorage.getItem(localStorage.key(i))) == name) {
            //if present
            flag = true;
            break;
        }
    }

    if (!flag) {
        icon.src = "./images/favourite-unfilled.png";
    } else {
        icon.src = "./images/favourite-filled.png";
    }

    icon.className = "icon";

    title.appendChild(text);
    title.appendChild(icon);

    //creating instructions element
    const ins = document.createElement("div");
    ins.className = "instructions";
    ins.textContent = data.meals[0].strInstructions;

    mealDetails.appendChild(image);
    mealDetails.appendChild(title);
    mealDetails.appendChild(ins);

    searchBar.value = "";
    searchResults.style.display = "none"; //To empty the search bar once one item is clicked

    //event listener for favourites button
    icon.addEventListener("click", (e) => {
        const meal = e.target.parentElement.firstChild.textContent;

        let flag = false;
        let key;

        //searching in local storage
        for (let i = 0; i < window.localStorage.length; i++) {
            if (JSON.parse(localStorage.getItem(localStorage.key(i))) == meal) {
                flag = true;
                key = i;
                break;
            }
        }

        //added to favourites
        if (!flag) {
            icon.src = "./images/favourite-filled.png";
            window.localStorage.setItem(counter, JSON.stringify(meal));
            counter++;
        } else {
            icon.src = "./images/favourite-unfilled.png";
            window.localStorage.removeItem(localStorage.key(key));
        }
    });
});

//Loading the Favourites
function loadFav() {
    mealDetails.textContent = "";

    const title = document.createElement("div");
    title.className = "favTitle";
    title.textContent = "Favourites";
   
    mealDetails.appendChild(title);

    //printing all the elements in local storage
    for (let i = 0; i < window.localStorage.length; i++) {
        const name = JSON.parse(localStorage.getItem(localStorage.key(i)));

        const favSection = document.createElement("div");
        favSection.className = "favSection";

        const button = document.createElement("img");
        button.className = "delBtn";
        button.src = "./images/delete-sign.png";

        const ele = document.createElement("div");
        ele.className = "favMeals";
        ele.textContent = name;

        favSection.appendChild(ele);
        favSection.appendChild(button);
        mealDetails.appendChild(favSection);   
    }
}

//favorites tab
fav.addEventListener("click", () => {
    mealDetails.style.display = "flex";
    loadFav();
});

//delete button in favorites
mealDetails.addEventListener("click", (e) => {
    const classBtn = e.target.className;

    if (classBtn !== "delBtn") {
        return;
    }

    const food = e.target.parentElement.children[0].textContent;

    let key;

    //looping through local storage for finding the element
    for (let i = 0; i < window.localStorage.length; i++) {
        if (JSON.parse(localStorage.getItem(localStorage.key(i))) == food) {
            key = i;
            break;
        }
    }

    window.localStorage.removeItem(localStorage.key(key));

    loadFav();
});