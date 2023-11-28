let favId = [];
const ul = document.querySelector('ul');
const row = document.getElementById('row');
const favContainer = document.getElementById('fav-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const detailsPage = document.getElementById('details');
const favLink = document.getElementById('fav-link');
const favMenu = document.getElementById('fav-menu');
const favClose = document.getElementById('close-btn');
// SEARCH SECTION

// function for displaying meals on the website
function renderMeals(name) {
  let mealsdata = fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data;
    }).then(data => {
      let row = document.getElementById('row');
      row.innerHTML = '';
      // console.log(data.meals);
      data.meals.map((meal) => {
        row.innerHTML += `
        <div class="col-sm-12 col-md-6 col-lg-4 col-xl-4 meal-item">
        <div class="card">
          <img
            src="${meal.strMealThumb}"
            class="card-img-top"
            alt="..."
          />
          <div class="card-body">
            <h5 class="card-title">${meal.strMeal}</h5>
            <div class="more">
              <button class="more-btn" data-id=${meal.idMeal} id='more-btn'>
                More
              </button>
                
                <button id='fav-add' data-id=${meal.idMeal}>Fav</button>
            </div>
          </div>
        </div>
      </div>
        `;

      })
    });
}

searchInput.addEventListener('input', (event) => {
  let results = [];
  const inputText = event.target.value;
  fetch("https://www.themealdb.com/api/json/v1/1/search.php?s")
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data;
    }).then(data => {
      // console.log(data.meals);
      let mealsName = data.meals.map(meal => {
        return meal.strMeal;
      })
      if (inputText.length) {
        results = mealsName.filter((item) => {
          return item.toLowerCase().includes(inputText.toLowerCase());
        })
        // console.log(results);
        renderSuggestions(results);
        if(!results.length){
            ul.innerHTML = '';
        }
      }
    })

})
// function for displaying search suggestions
function renderSuggestions(results) {
  const content = results.map((result) => {
    return `<li onClick=selectInput(this)>${result}</li>`;
  }).join('');
  ul.innerHTML = content;
}
// function for selecting search suggestion to input box.
function selectInput(item) {
  searchInput.value = item.innerText;
  ul.innerHTML = '';
}

searchBtn.addEventListener('click', () => {
  ul.innerHTML = '';
  let input = searchInput.value;
  renderMeals(input);
  searchInput.value = '';
})
// handling meal card events
row.addEventListener('click', cardEvents);
function cardEvents(event) {
  if (event.target.id === 'fav-add') {
    const id = event.target.getAttribute('data-id');
    addAndRemoveFav(id);
    renderFavourites();
  }
  if (event.target.id === 'more-btn') {
    const id = event.target.getAttribute('data-id');
    detailsPage.classList.add('details-show');
    renderdetails(id);
  }
}

// fAVOURITES SECTION

// function for adding and removing meals to favourites
function addAndRemoveFav(id) {
  if (!favId.includes(id)) {
    favId.push(id);
    alert('Meal Addes to favourites');
  }
  else {
    favId.splice(favId.indexOf(id), 1);
    alert('Meal removed from favourites');
  }
  localStorage.setItem('fav',JSON.stringify(favId));
}
// function for rendering favourites
function renderFavourites() {
  let favLocal =localStorage.getItem('fav');
  favId = JSON.parse(favLocal);
  favContainer.innerHTML = '';
  favId.forEach((fav) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${fav}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        return data;
      })
      .then(data => {
        data.meals.map((meal) => {
          favContainer.innerHTML += `
            <div class="fav-item">
              <img src="${meal.strMealThumb}" alt="">
              <p class="meal-name">${meal.strMeal}</p>
              <i class="fa-solid fa-trash" id="fav-delete" data-id=${meal.idMeal}></i>
            </div>
          `
        })
      })
  })
}
// handling delete button in meal card of favourites
favContainer.addEventListener('click', (e) => {
  if (e.target.id === 'fav-delete') {
    const id = e.target.getAttribute('data-id');
    addAndRemoveFav(id);
    renderFavourites();
  }
})
//handling events on clicking My favourites link
favLink.addEventListener('click', showFav);
function showFav() {
  renderFavourites();
  favMenu.classList.add('show');
}
//to close favourites
favClose.addEventListener('click', closeFav);
function closeFav() {
  favMenu.classList.remove('show');
}

// DETAILS SECTION

//function for diplaying details
function renderdetails(id) {
  detailsPage.innerHTML='';
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data;
    })
    .then((data) => {
      console.log();
      data.meals.map((meal) => {
        detailsPage.innerHTML = `
          <div class="close-det">
          <i class="fa-solid fa-xmark" id='close-details'></i>
          </div>
        <div class="head">
          <h3>${meal.strMeal}</h3>
          <p>${meal.strCategory}</p>
        </div>
        <div class="instructions">
          <h4>Instructions</h4>
          <p>
          ${meal.strInstructions}
          </p>
        </div>
        <img
        src="${meal.strMealThumb}" 
        alt="">
        <p class="order-btn">Order Now</p>
          `
      })
    })
}
// to close details page
detailsPage.addEventListener('click',(e)=>{
  
  if(e.target.id === 'close-details'){
    detailsPage.classList.remove('details-show');
  }
})