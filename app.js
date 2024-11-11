//Je vais détailler chaque morceau de code pour mieux comprendre


let inputSearch = document.getElementById('moviesInput'); // l'input
let boutonSearch = document.getElementById('boutonRecherche'); //le bouton pour l'envoyer
let textForSearch = document.querySelector(".textAfterInput"); //le texte à changer après chaque recherche

async function fetchGenreIDsForHover() {
    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=1d7f2a93c1fcb1dc9f968d6ff487fedb', {
        headers: { 'Accept': 'application/json' }
    });
    const data = await response.json(); //même principe, mais on utilise des await 
    const genres = {};
    data.genres.forEach(genre => {
        genres[genre.id] = genre.name; // genres[genre.id] : on remplace genres[0] par genre.id et on le fait égal à genre.name si j'ai bien compris
        
    })
    return genres;
};

boutonSearch.addEventListener("click",function() {
    let inputValue = inputSearch.value; // je récupère l'entré de l'input
    textForSearch.textContent = `Results for "${inputValue}"` //je change le texte
    // je récupère tout les films qui comprennent mon input dans son nom
    fetchGenreIDsForHover().then(genres => {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=1d7f2a93c1fcb1dc9f968d6ff487fedb&query=${inputValue}`, {
            headers: { 'Accept': 'application/json' }
        })
            .then(response => response.json()) //je transforme en json pour le lire
            .then(data => { //si je met data.id(ou autre) ça marche pas car l'id est compris dans results, donc je dois parcourir results et trouver l'id là-bas.
                console.log(data);
                let wrapper = document.querySelector('.swiper-wrapper-results'); // la div ou je vais mettre toutes les images
                wrapper.innerHTML = ''; // faut vider avant de commencer
    
                data.results.forEach(movie => {
                    const imageURL = `<img src="https://image.tmdb.org/t/p/original${movie.poster_path}">`; //l'url de l'image pour chaque film
                    const slide = document.createElement("div"); // slide pour chaque film
                    const genreIDs = movie.genre_ids
                    const movieGenres = genreIDs.map(id => genres[id]).join(', ');
                    const movieInfo = //le hover. pour le genre, je dois récupérer les id, puis taper le genre correspondant à l'id.
                    `<div class="movie-info">
                        <h2>${movie.title}</h2>
                        <h3>${movie.release_date.split('-')[0]}</h3> 
                        <h4>${movieGenres}</h4>
                        <span>&#9733;</span>
                        <p>${movie.vote_average}</p>
                    </div>
                    `;
                    slide.classList.add("swiper-slide");
                    slide.innerHTML = `${imageURL}${movieInfo}`;
                    wrapper.appendChild(slide);


                    slide.addEventListener("click", async function() {
                        const overlay = document.querySelector(".overlay");
                        overlay.style.display = "flex";
        
                        const infosFilm = `
                        <div class="imageFilm">${imageURL}</div>
                        <div class="infoTop">
                            <h1>${movie.title}</h1>
                            <p class="dateMovie">${movie.release_date.split('-')[0]}</p>
                            <div class="memeLigne">
                            <span>&#9733;</span> <p class="notes">${movie.vote_average}</p>
                            </div>
                            <h2>${movieGenres}</h2>
                        </div>
                        `;
                        
                        const popUp = document.querySelector(".pop-up");
                        popUp.innerHTML = `${infosFilm}`;
                        
                        const movieID = movie.id;
        
                        async function fetchMovieDetails(movieId) {
                            const detailsFetch = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=1d7f2a93c1fcb1dc9f968d6ff487fedb`);
                            const detailsData = await detailsFetch.json();
                            const description = detailsData.overview;
                            
                            const castFetch = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=1d7f2a93c1fcb1dc9f968d6ff487fedb`);
                            const castData = await castFetch.json();
                            const castResults = castData.cast.slice(0,5).map(member => member.name);
                        
                            return `
                                <div class="desc">
                                <p>Description : ${description}</p>
                                <p>Cast : ${castResults}</p>
                                </div>
                                `;
                        }
                        const descriptionDuFilm = await fetchMovieDetails(movieID);
                        popUp.innerHTML += descriptionDuFilm;
        
        
                        overlay.addEventListener("click", function(event) {
                            if (event.target === overlay) { // Vérifie que le clic a eu lieu directement sur l'overlay, pas sur un élément enfant
                                overlay.style.display = "none";
                            }
                        });
                    });
                });
    
                //configuration swiper
                new Swiper('.swiper-container-results', {
                    slidesPerView: 4,
                    spaceBetween: 2,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                })
            })
            .catch(error => console.log('Error:', error));
        })
});



fetchGenreIDsForHover().then(genres => {
    //je récupère les latest releases
// je fais +- la même chose que pour le fetch précédent
fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=1d7f2a93c1fcb1dc9f968d6ff487fedb', {
    headers: { 'Accept': 'application/json'}
})
    .then(response => response.json())
    .then(data => {
        let wrapperLatest = document.querySelector('.swiper-wrapper-latest');// je rajoute un latest à la fin de chaque nom pour différencier
        wrapperLatest.innerHTML = '';
        
        data.results.forEach(movie => {
            const imageUrlLatest = `<img src="https://image.tmdb.org/t/p/original${movie.poster_path}">`;
            const slideLatest = document.createElement("div");
            const genreIDs = movie.genre_ids
                    const movieGenres = genreIDs.map(id => genres[id]).join(', ');
                    const movieInfo = //le hover. pour le genre, je dois récupérer les id, puis taper le genre correspondant à l'id.
                    `<div class="movie-info">
                        <h2>${movie.title}</h2>
                        <h3>${movie.release_date.split('-')[0]}</h3> 
                        <h4>${movieGenres}</h4>
                        <span>&#9733;</span>
                        <p>${movie.vote_average}</p>
                    </div>
                    `;
            slideLatest.classList.add("swiper-slide");
            slideLatest.innerHTML = `${imageUrlLatest}${movieInfo}`;
            wrapperLatest.appendChild(slideLatest);

            


            slideLatest.addEventListener("click", async function() {
                const overlay = document.querySelector(".overlay");
                overlay.style.display = "flex";

                const infosFilm = `
                <div class="imageFilm">${imageUrlLatest}</div>
                <div class="infoTop">
                    <h1>${movie.title}</h1>
                    <p class="dateMovie">${movie.release_date.split('-')[0]}</p>
                    <div class="memeLigne">
                    <span>&#9733;</span> <p class="notes">${movie.vote_average}</p>
                    </div>
                    <h2>${movieGenres}</h2>
                </div>
                `;
                
                const popUp = document.querySelector(".pop-up");
                popUp.innerHTML = `${infosFilm}`;
                
                const movieID = movie.id;

                async function fetchMovieDetails(movieId) {
                    const detailsFetch = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=1d7f2a93c1fcb1dc9f968d6ff487fedb`);
                    const detailsData = await detailsFetch.json();
                    const description = detailsData.overview;
                    
                    const castFetch = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=1d7f2a93c1fcb1dc9f968d6ff487fedb`);
                    const castData = await castFetch.json();
                    const castResults = castData.cast.slice(0,5).map(member => member.name);
                
                    return `
                        <div class="desc">
                        <p>Description : ${description}</p>
                        <p>Cast : ${castResults}</p>
                        </div>
                        `;
                }
                const descriptionDuFilm = await fetchMovieDetails(movieID);
                popUp.innerHTML += descriptionDuFilm;


                overlay.addEventListener("click", function(event) {
                    if (event.target === overlay) { // Vérifie que le clic a eu lieu directement sur l'overlay, pas sur un élément enfant
                        overlay.style.display = "none";
                    }
                });
            });
            


            





        })

        new Swiper('.swiper-container-latest', {
            slidesPerView: 4,
            spaceBetween: 2,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        })
    })
    .catch(err => console.log(err));
})



// je dois d'abord récupérer l'id des films pour savoir le genre, 
// ensuite je pourrais filtrer avec l'id
let comedyID = '';
let dramaID = '';
let actionID = '';
let romanceID = '';
let fantasyID = '';
let animationID = '';
// je dois mettre dans une fonction asynchrone pour que les valeurs des ID soit disponible en dehors du fetch
// je vais optimiser ma fonction, je la change 

async function fetchGenreIDs() {
    const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=1d7f2a93c1fcb1dc9f968d6ff487fedb', {
        headers: { 'Accept': 'application/json' }
    });
    const data = await response.json(); //même principe, mais on utilise des await 

    data.genres.forEach(movie => {
        if (movie.name === "Comedy") {
            comedyID = movie.id;
        }
        if (movie.name === "Drama") {
            dramaID = movie.id;
        }
        if (movie.name === "Action") {
            actionID = movie.id;
        }
        if(movie.name === "Romance") {
            romanceID = movie.id;
        }
        if(movie.name === "Fantasy") {
            fantasyID = movie.id;
        }
        if(movie.name === "Animation") {
            animationID = movie.id;
        }
    });
}
let genreArray = ["comedy","drama","action","romance","fantasy","animation"];

for(let i=0 ; i<genreArray.length ; i++) {
    let bouton = document.getElementById(genreArray[i]);
    bouton.addEventListener("click", function() {
        fetchGenreIDs().then(() => {
            let id = '';

            // j'enlève toutes les classes actives avant de commencer 
            genreArray.forEach(genre => {
                document.getElementById(genre).classList.remove("active");
            });

            // j'ajoute au bouton cliqué
            bouton.classList.add("active");
            if(genreArray[i] === "comedy") {
                id = comedyID;
            } 
            else if(genreArray[i] === "drama") {
                id = dramaID;
            }
            else if(genreArray[i] === "action") {
                id = actionID;

            }
            else if(genreArray[i] === "romance") {
                id = romanceID;
                
            }
            else if(genreArray[i] === "fantasy") {
                id = fantasyID;
                
            }
            else if(genreArray[i] === "animation") {
                id = animationID;
                
            }
            fetchGenreIDsForHover().then(genres => {
                fetch(`https://api.themoviedb.org/3/discover/movie?api_key=1d7f2a93c1fcb1dc9f968d6ff487fedb&with_genres=${id}`, {
                    headers: { 'Accept': 'application/json'} //les films de comedy sont récupérer 
                    })
                    .then(response => response.json())
                    .then(data => {
                        let wrapperGenre = document.querySelector('.swiper-wrapper-genre'); // la div ou je vais mettre toutes les images
                        wrapperGenre.innerHTML = ''; // faut vider avant de commencer
                        data.results.forEach(movie => {
                            const imageUrlGenre = `<img src="https://image.tmdb.org/t/p/original${movie.poster_path}">`;
                            const slideGenre = document.createElement("div"); // slide pour chaque film
                                const genreIDs = movie.genre_ids; // je récupére les id du film
                                const movieGenres = genreIDs.map(id => genres[id]).join(', ');
                                const movieInfo = //le hover. pour le genre, je dois récupérer les id, puis taper le genre correspondant à l'id.
                                `<div class="movie-info">
                                    <h2>${movie.title}</h2>
                                    <h3>${movie.release_date.split('-')[0]}</h3> 
                                    <h4>${movieGenres}</h4>
                                    <span>&#9733;</span>
                                    <p>${movie.vote_average}</p>
                                </div>
                                `;
                            slideGenre.classList.add("swiper-slide");
                            slideGenre.innerHTML = `${imageUrlGenre}${movieInfo}`
                            wrapperGenre.appendChild(slideGenre);



                            slideGenre.addEventListener("click", async function() {
                                const overlay = document.querySelector(".overlay");
                                overlay.style.display = "flex";
                
                                const infosFilm = `
                                <div class="imageFilm">${imageUrlGenre}</div>
                                <div class="infoTop">
                                    <h1>${movie.title}</h1>
                                    <p class="dateMovie">${movie.release_date.split('-')[0]}</p>
                                    <div class="memeLigne">
                                    <span>&#9733;</span> <p class="notes">${movie.vote_average}</p>
                                    </div>
                                    <h2>${movieGenres}</h2>
                                </div>
                                `;
                                
                                const popUp = document.querySelector(".pop-up");
                                popUp.innerHTML = `${infosFilm}`;
                                
                                const movieID = movie.id;
                
                                async function fetchMovieDetails(movieId) {
                                    const detailsFetch = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=1d7f2a93c1fcb1dc9f968d6ff487fedb`);
                                    const detailsData = await detailsFetch.json();
                                    const description = detailsData.overview;
                                    
                                    const castFetch = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=1d7f2a93c1fcb1dc9f968d6ff487fedb`);
                                    const castData = await castFetch.json();
                                    const castResults = castData.cast.slice(0,5).map(member => member.name);
                                
                                    return `
                                        <div class="desc">
                                        <p>Description : ${description}</p>
                                        <p>Cast : ${castResults}</p>
                                        </div>
                                        `;
                                }
                                const descriptionDuFilm = await fetchMovieDetails(movieID);
                                popUp.innerHTML += descriptionDuFilm;
                
                
                                overlay.addEventListener("click", function(event) {
                                    if (event.target === overlay) { // Vérifie que le clic a eu lieu directement sur l'overlay, pas sur un élément enfant
                                        overlay.style.display = "none";
                                    }
                                });
                            });
                        })
            
                        new Swiper('.swiper-container-genre', {
                            slidesPerView: 4,
                            spaceBetween: 2,
                            navigation: {
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            },
                        })
                    })
            })
        })
    })
}

const boutonComedy = document.getElementById('comedy');
boutonComedy.classList.add("active");
fetchGenreIDsForHover().then(genres => {
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=1d7f2a93c1fcb1dc9f968d6ff487fedb&with_genres=35`, {
        headers: { 'Accept': 'application/json'} //les films de comedy sont récupérer 
        })
        .then(response => response.json())
        .then(data => {
            let wrapperGenre = document.querySelector('.swiper-wrapper-genre'); // la div ou je vais mettre toutes les images
            wrapperGenre.innerHTML = ''; // faut vider avant de commencer
            data.results.forEach(movie => {
                const imageUrlGenre = `<img src="https://image.tmdb.org/t/p/original${movie.poster_path}">`;
                const slideGenre = document.createElement("div"); // slide pour chaque film
                    const genreIDs = movie.genre_ids; // je récupére les id du film
                    const movieGenres = genreIDs.map(id => genres[id]).join(', ');
                    const movieInfo = //le hover. pour le genre, je dois récupérer les id, puis taper le genre correspondant à l'id.
                    `<div class="movie-info">
                        <h2>${movie.title}</h2>
                        <h3>${movie.release_date.split('-')[0]}</h3> 
                        <h4>${movieGenres}</h4>
                        <span>&#9733;</span>
                        <p>${movie.vote_average}</p>
                    </div>
                    `;
                slideGenre.classList.add("swiper-slide");
                slideGenre.innerHTML = `${imageUrlGenre}${movieInfo}`
                wrapperGenre.appendChild(slideGenre);



                slideGenre.addEventListener("click", async function() {
                    const overlay = document.querySelector(".overlay");
                    overlay.style.display = "flex";
    
                    const infosFilm = `
                    <div class="imageFilm">${imageUrlGenre}</div>
                    <div class="infoTop">
                        <h1>${movie.title}</h1>
                        <p class="dateMovie">${movie.release_date.split('-')[0]}</p>
                        <div class="memeLigne">
                        <span>&#9733;</span> <p class="notes">${movie.vote_average}</p>
                        </div>
                        <h2>${movieGenres}</h2>
                    </div>
                    `;
                    
                    const popUp = document.querySelector(".pop-up");
                    popUp.innerHTML = `${infosFilm}`;
                    
                    const movieID = movie.id;
    
                    async function fetchMovieDetails(movieId) {
                        const detailsFetch = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=1d7f2a93c1fcb1dc9f968d6ff487fedb`);
                        const detailsData = await detailsFetch.json();
                        const description = detailsData.overview;
                        
                        const castFetch = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=1d7f2a93c1fcb1dc9f968d6ff487fedb`);
                        const castData = await castFetch.json();
                        const castResults = castData.cast.slice(0,5).map(member => member.name);
                    
                        return `
                            <div class="desc">
                            <p>Description : ${description}</p>
                            <p>Cast : ${castResults}</p>
                            </div>
                            `;
                    }
                    const descriptionDuFilm = await fetchMovieDetails(movieID);
                    popUp.innerHTML += descriptionDuFilm;
    
    
                    overlay.addEventListener("click", function(event) {
                        if (event.target === overlay) { // Vérifie que le clic a eu lieu directement sur l'overlay, pas sur un élément enfant
                            overlay.style.display = "none";
                        }
                    });
                });
            })

            new Swiper('.swiper-container-genre', {
                slidesPerView: 4,
                spaceBetween: 2,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            })
        })
})
























