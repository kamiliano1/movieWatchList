
const searchBar = document.getElementById("search-bar")
const movieList = document.getElementById("movie-list")
const myWatchList = document.getElementById("my-watchlist")
const webDescription = document.getElementById("nav-disc").innerText
const startInformation = document.getElementById("start-info")
let setMoviesHtml
let myWatchListId = JSON.parse(localStorage.getItem("myList")) || []
// localStorage.clear()
if (webDescription === "Search for movies") {
    render(myWatchListId)
} else {
    const searchBtn = document.getElementById("search-btn")
    searchBtn.addEventListener("click",(event)=>{
        event.preventDefault()  
        if (searchBar.value.length< 3){
            startInformation.innerText 
                ="At leats 3 characters are required."
        } else {
            fetch(`https://www.omdbapi.com/?apikey=9f7b9458&type=movie&s="${searchBar.value}"`)
            .then(res => res.json())
            .then(data =>{
                if (data.Response==="False") {
                    movieList.innerHTML =`            
                    <img src = "icons/empty-search-icon.png" id="start-icon">
                    <h1 id="start-info">Unable to find what you’re looking for. Please try another search.</h1>` 
                } else {
                    const moviesID = data.Search.map(mov=>{
                    return mov.imdbID
                    })
                render(moviesID)
                }
            }) 
        }
    
    })
}

function render(movieId) {
    setMoviesHtml = ""
    movieId.length=== 0 ? document.getElementById("my-watchlist").innerHTML = 
    `<h1 id="watchlist-info">Your watchlist is looking a little empty...</h1>
            <div class="watchlist-line">
                <a href="./index.html" id="nav-disc"><img class="watchlist-icons" src="./icons/add-white.png">
                <h2 id="watchlist-add-movies">Let’s add some movies!</h2></a>
            </div>` : ""
    movieId.map(id=>{
            fetch(`https://www.omdbapi.com/?apikey=9f7b9458&i=${id}`)
            .then(response => response.json())
            .then(data =>{
                data.watchList = myWatchListId.indexOf(id) === -1 ? false : true
                let watchListText = data.watchList ? "Remove" : "Watchlist"
                let watchListImage = data.watchList ? "icons/remove-white.png" : "icons/add-white.png"
                const { Poster, Title, imdbRating, Runtime, Genre, Plot, watchList } = data
                setMoviesHtml += `
                <div class="film-container">
                    <div class="poster-container">
                        <img class ="film-img" src="${Poster === "N/A"? 'images/NotAvailable.png': Poster}">
                    </div>
                    <div class="film-detail">
                        <div class="film-details-section">
                            <h3 class="film-title">${Title}</h3>
                            <img class="star-icon" src ="icons/star.png">
                            <p class="film-details">${imdbRating}</p>
                        </div>
                        <div class="film-details-section">
                            <p class="film-details">${Runtime}</p>
                            <p class="film-details">${Genre}</p>
                        <div class="watchlist-section" id="${id}">
                            <img class="film-icons" src="${watchListImage}" 
                            onclick=favoriteList("${id}")>
                            <p class="film-details">${watchListText}</p>
                            </div>
                        </div>
                        <p class="film-disc">
                        ${Plot}
                        </p>
                    </div>
                </div>
                <span class="underline"></span>
                `
                webDescription === "My watchlist" ? movieList.innerHTML = setMoviesHtml 
                : myWatchList.innerHTML = setMoviesHtml
            }) 
    })
}
function favoriteList(id) {
    if (myWatchListId.indexOf(id)=== -1) {
        myWatchListId.push(id)
        document.getElementById(id).children[0].src = "icons/remove-white.png"
        document.getElementById(id).children[1].innerText = "Remove"
    } else {
        myWatchListId.splice(myWatchListId.indexOf(id),1)
        document.getElementById(id).children[0].src = "icons/add-white.png"
        document.getElementById(id).children[1].innerText = "Watchlist"
    }
    localStorage.setItem("myList", JSON.stringify(myWatchListId))
    webDescription === "Search for movies" ? render(myWatchListId) : ""
}
