const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API

const count = 6;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;


let resultsArray = [];
let favorites = {};

function showContent(page) {
    window.scrollTo({ top: 0, behavior: 'instant'});
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
};


// What is refactoring?

function createDOMNodes(page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    console.log('Current Array', page, currentArray);
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');

        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';

        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        
        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;

        // Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add To Favorites';
            // saveText.onclick(`saveFavorites('${result.url}')`) doesn't work.
            saveText.setAttribute('onclick', `saveFavorites('${result.url}')`);
        } else {
            saveText.textContent = 'Remove Favorite';
            // saveText.onclick(`saveFavorites('${result.url}')`) doesn't work.
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        
        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');

        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;

        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;

        // Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
};


function updateDOM(page) {
    // Get Favorites from localStorage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        console.log('favorites from localStorage', favorites);
    };
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
};



// Get Images From NASA API

async function getNasaPictures() {
    // Show Loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        // console.log('resultsArray', resultsArray);
        updateDOM('results');
    } catch (error) {
        // Catch Error Here - can choose to console log error -
    };
};


// Add result to favorites
function saveFavorites(itemUrl) {
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            // ce nu inteleg: de ce nu salveaza doua obiecte identice(cu acelasi URL), si fara a doua conditie
            // we are creating an object within an object that has the key itemUrl
            favorites[itemUrl] = item;

            // Show Save Confirmation for 2 Seconds
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            // Set Favorites in localStorage
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        };
    });
};

// Remove item from favorites
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        // Set Favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    };
};


// imperative programming - guiding the computer step by step - this style, although intuitive and useful, can be bug prone. Hard to keep track as code gets bigger and bigger. So the alternative is declarative programming.

// declarative programming - (HTML is declarative) - (Frameworks give a higher level of abstraction - React, Angular, Vue) - 

// 
// On Load

getNasaPictures();