// ! DOM
const tabTitle = document.getElementById("tabTitle");
const app = document.getElementById("app");
const warn = document.getElementById("warning");

// ! Globals
let userList = [];
let indexUser;
const token = JSON.parse(sessionStorage.getItem("token"));
const API = "http://www.omdbapi.com/?i=tt3896198&apikey=f9c9cdc8";
const APIdetailsMovie = "http://www.omdbapi.com/?i=";
const APIkey = "&apikey=f9c9cdc8";

// ! Functions

const createNavBar = () => {
  const header = document.createElement("HEADER");
  header.setAttribute("id", "menu");
  header.classList.add("header");
  header.innerHTML = `
  <h1 class="app__main-title">FilmApp</h1>
  <input type="checkbox" id="main-menu__toggle" class="main-menu__toggle" />
      <nav class="main-menu">
        <ul class="main-menu__list">
          <li class="main-menu__items">
            <a href="./app.html" data-action="home" class="main-menu__links">
            <span class="material-icons">
              home
            </span>
            Home
            </a>
          </li>
          <li class="main-menu__items">
            <a href="#" data-action="fav" class="main-menu__links">
              <span class="material-icons">
                favorite
              </span>
            My Movies
            </a>
          </li>
          <li class="main-menu__items">
            <a href="#" data-action="out" class="main-menu__links">
              <span class="material-icons">
                exit_to_app
              </span>
            Log Out
            </a>
          </li>
        </ul>
      </nav>
      <label for="main-menu__toggle" class="main-menu__toggle-label">
        <span class="main-menu__bar"></span>
      </label>
      `;
  app.append(header);
};

const createSearchForm = () => {
  const searchForm = document.createElement("SECTION");
  searchForm.classList.add("search-form__container");
  searchForm.innerHTML = `
  <form method="get" class="search-form" id="search-form">
        <div class="search-form__field">
          <input
            type="search"
            name="search"
            class="search-form__input"
            id="search"
            placeholder="Search Movie"
          />
        </div>
        <div class="search-form__field">
          <button type="submit" class="btn-search">
            <span class="material-icons">
              search
            </span>
          </button>
        </div>
      </form>
  `;
  app.append(searchForm);
};

const createMoviesContainer = () => {
  const moviesContainer = document.createElement("SECTION");
  moviesContainer.classList.add("movies-container");
  moviesContainer.setAttribute("id", "movies");

  app.append(moviesContainer);
};

const getMovies = (searchText) => {
  axios({
    method: "GET",
    url: `${API}&s=${searchText}`,
  })
    .then((res) => {
      let movies = res.data.Search;
      let output = "";
      movies.forEach((movie) => {
        output += `
        <div class="movie__card">
          <div class="movie__poster">
            <img class="movie__poster-img" src="${movie.Poster}" />
          </div>
          <h2 class="movie__title">${movie.Title}</h2>
          <div class="movie__footer">
            <button data-action="details" data-imdbID="${movie.imdbID}" class="movie__footer-btn">Movie Details</button>
            <button data-action="add" data-imdbID="${movie.imdbID}" class="movie__footer-btn">Add to Fav</button>
          </div>
        </div>
        `;
      });
      showMovie.innerHTML = output;
    })
    .catch((err) => console.log(err));
};

const addMov = () => {
  localStorage.setItem("users", JSON.stringify(userList));
};

const addFavMovie = (imdbID) => {
  userList = JSON.parse(localStorage.getItem("users"));

  indexUser = userList.findIndex((element) => {
    if (element.username === token.username) return element.username;
  });

  if (userList[indexUser].favMovies.includes(imdbID)) {
    warn.classList.remove("warning-out");
    warn.classList.add("warning", "warning-error");
    warn.innerHTML = `<p>The movie exists in favorites</p>`;
    setTimeout(() => {
      warn.classList.remove("warning", "warning-error");
      warn.classList.add("warning-out");
      warn.innerHTML = "";
    }, 2000);
  } else {
    userList[indexUser].favMovies += `,${imdbID}`;

    // Convert to Array
    userList[indexUser].favMovies = userList[indexUser].favMovies.split(",");

    // Clean empty elements
    // ? Lo uso porque me genera un elemento vacío siempre.
    userList[indexUser].favMovies = userList[indexUser].favMovies.filter(
      (elem) => elem.length > 0
    );
    warn.classList.remove("warning-out");
    warn.classList.add("warning", "warning-correct");
    warn.innerHTML = `<p>The movie is added to favorites</p>`;
    setTimeout(() => {
      warn.classList.remove("warning", "warning-correct");
      warn.classList.add("warning-out");
      warn.innerHTML = "";
    }, 2000);
    addMov();
  }
};

const showFavMovie = () => {
  userList = JSON.parse(localStorage.getItem("users"));
  indexUser = userList.findIndex((element) => {
    if (element.username === token.username) return element.username;
  });

  const movieID = userList[indexUser].favMovies;
  const favMov = [];

  if (movieID.length <= 0) {
    let output = `
    <h3 class="app__error-title">There are no favorite movies</h3>
    `;
    showMovie.innerHTML = output;
  } else {
    for (let i = 0; i < movieID.length; i++) {
      let id = movieID[i];
      axios({
        method: "GET",
        url: `${APIdetailsMovie}${id}&s=${APIkey}`,
      })
        .then((res) => {
          let m = res.data;
          favMov.push(m);
          let output = "";
          favMov.forEach((movie) => {
            output += `
        <div class="movie__card">
          <div class="movie__poster">
            <img class="movie__poster-img" src="${movie.Poster}" />
          </div>
          <h2 class="movie__title">${movie.Title}</h2>
          <div class="movie__footer">
            <button data-action="details" data-imdbID="${movie.imdbID}" class="movie__footer-btn">Movie Details</button>
            <button data-action="unfollow" data-imdbID="${movie.imdbID}" class="movie__footer-btn">Unfollow</button>
          </div>
        </div>
        `;
          });
          showMovie.innerHTML = output;
        })
        .catch((err) => console.log(err));
    }
  }
};

const deleteFavMovie = (imdbID) => {
  userList = JSON.parse(localStorage.getItem("users"));

  indexUser = userList.findIndex((element) => {
    if (element.username === token.username) return element.username;
  });
  const favIndex = userList[indexUser].favMovies.indexOf(imdbID);
  userList[indexUser].favMovies.splice(favIndex, 1);
  warn.classList.remove("hidden");
  warn.classList.add("warning", "warning-correct");
  warn.innerHTML = `<p>Removed the movie from favorites</p>`;
  setTimeout(() => {
    warn.classList.remove("warning", "warning-correct");
    warn.classList.add("hidden");
    warn.innerHTML = "";
  }, 2000);
  addMov();
  showFavMovie();
};

const modal = document.createElement("DIV");
const createModalViewMovies = (imdbID) => {
  modal.classList.add("modal", "hidden");
  modal.setAttribute("id", "modal");

  axios({
    method: "GET",
    url: `${APIdetailsMovie}${imdbID}&s=${APIkey}`,
  })
    .then((res) => {
      let movie = res.data;
      modal.innerHTML = `
      <div class="modal__content">
        <div class="modal__content-left">
          <img src="${movie.Poster}" class="modal__poster" />
        </div>
        <div class="modal__content-rigth">
          <h2>${movie.Title}</h2>
          <ul class="modal__list-group">
            <li class="list-group__item"><strong>Director: </strong> ${movie.Director} </li>
            <li class="list-group__item"><strong>Production: </strong> ${movie.Production} </li>
            <li class="list-group__item"><strong>Runtime: </strong> ${movie.Runtime} </li>
            <li class="list-group__item"><strong>Year: </strong> ${movie.Year} </li>
            <li class="list-group__item"><strong>Genre: </strong> ${movie.Genre} </li>
            <li class="list-group__item"><strong>Rated: </strong> ${movie.Rated} </li>
            <li class="list-group__item"><strong>Rating: </strong> ${movie.imdbRating} </li>
            <li class="list-group__item"><strong>Actors: </strong> ${movie.Actors} </li>
          </ul>
        </div>
        <div class="modal__content-plot">
          <h3 class="plot-title">Plot:</h3>
          <p class="plot-text">${movie.Plot}</p>
          <button data-action="close-modal" class="modal-btn">Back</button>
        </div>
      </div>
      `;
      app.append(modal);
    })
    .catch((err) => console.log(err));
};

//  Main content
const showApp = () => {
  //  Check session
  if (!token) {
    //  Tab Error
    tabTitle.textContent = "Access Denied";

    //  Show Error Message App
    app.innerHTML = `
    <h1 class="app__main-title app__error">FilmApp</h1>
    <h2 class="app__error-title">403 Forbidden</h2>
    <h3 class="app__error-title">You Are not logged</h3>
    <h3 class="app__error-title">
    <a href="./index.html" class="app__error">Click here to back to log</a>
    </h3>
    `;
  } else {
    // Tab Username
    tabTitle.textContent = `Welcome ${token.username}`;
    // Content
    createNavBar();
    createSearchForm();
    createMoviesContainer();
  }
};

// ! Events

// Load App
document.addEventListener("DOMCOntentLoaded", showApp());

// Dynamic Nodes and Events
const searchForm = document.getElementById("search-form");
const showMovie = document.getElementById("movies");

// Navigation menu events
const menu = document.getElementById("menu");
if (menu) {
  menu.addEventListener("click", (e) => {
    const actionMenu = e.target.dataset.action;
    switch (actionMenu) {
      case "fav":
        showFavMovie();
        break;
      case "out":
        sessionStorage.removeItem("token");
        location.replace("./index.html");
        break;

      default:
        break;
    }
  });
}

// Show details or Add to fav movies
if (showMovie) {
  showMovie.addEventListener("click", (e) => {
    e.preventDefault();
    const imdbID = e.target.dataset.imdbid;
    const btnAction = e.target.dataset.action;

    // Check buttons to action
    switch (btnAction) {
      case "details":
        createModalViewMovies(imdbID);
        break;
      case "add":
        addFavMovie(imdbID);
        addMov();
        break;
      case "unfollow":
        deleteFavMovie(imdbID);
        break;

      default:
        break;
    }
  });
}

// Show Modal Movie Details
document.addEventListener("click", (e) => {
  if (e.target.dataset.action === "close-modal")
    modal.classList.remove("modal");
});

// Send Search Query
if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchText = document.getElementById("search").value;
    getMovies(searchText);
  });
}
