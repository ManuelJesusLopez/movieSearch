// ! DOM
const form = document.getElementById("form");
const formInfo = document.getElementById("form-info");

// ! Globals
let userList = [];
let token = {};
const userIsValid = {
  username: false,
  password: false,
  checkUser: false,
};

const errorInfo = document.createElement("P");

// ! Functions

// Validate and Show Error Info
const validateLogInFields = () => {
  const formValues = Object.values(userIsValid);
  const valid = formValues.findIndex((value) => value === false);

  const fragment = document.createDocumentFragment();
  switch (valid) {
    case -1:
      errorInfo.classList.remove("error");
      errorInfo.classList.add("correct");
      errorInfo.textContent = "Created User! Please Log in.";
      fragment.append(errorInfo);

      form.reset();
      break;
    case 0:
      errorInfo.classList.remove("correct");
      errorInfo.classList.add("error");
      errorInfo.textContent = "Insert a correct Username";
      fragment.append(errorInfo);
      break;
    case 1:
      errorInfo.classList.remove("correct");
      errorInfo.classList.add("error");
      errorInfo.textContent = "Insert a correct Password";
      fragment.append(errorInfo);
      break;

    default:
      break;
  }
  formInfo.append(fragment);
};

// Create new user data
const addNewUser = (username, password) => {
  const newUser = {
    username: username,
    password: btoa(password),
    favMovies: [],
  };
  userList.push(newUser);
  return newUser;
};

// Add user data to local storage
const addUser = () => {
  localStorage.setItem("users", JSON.stringify(userList));
};

// Check if the username exist in the local storage
const checkUserExist = (username) => {
  const fragment = document.createDocumentFragment();
  userList = JSON.parse(localStorage.getItem("users"));
  if (userList === null) {
    userList = [];
    userIsValid.checkUser = true;
  } else {
    userList.forEach((element) => {
      if (element.username === username) {
        errorInfo.classList.remove("correct");
        errorInfo.classList.add("error");
        errorInfo.textContent = "The username is used. Choose other username.";
        fragment.append(errorInfo);
        userIsValid.checkUser = false;
      } else {
        userIsValid.checkUser = true;
      }
    });
  }
  formInfo.append(fragment);
};

// Check if user exist in local store for login
const checkUserLog = (username, password) => {
  const fragment = document.createDocumentFragment();
  userList = JSON.parse(localStorage.getItem("users"));

  if (userList === null) {
    errorInfo.classList.remove("correct");
    errorInfo.classList.add("error");
    errorInfo.textContent = "Register User. Please!";
    fragment.append(errorInfo);
  } else {
    userList.forEach((element) => {
      const decodePass = atob(element.password);
      // Check user to redirect to the app
      if (element.username === username && decodePass === password) {
        token = {
          token: 1,
          username: username,
        };
        location.replace("./app.html");
      } else {
        errorInfo.classList.remove("correct");
        errorInfo.classList.add("error");
        errorInfo.textContent = "The username or password is not correct";
        fragment.append(errorInfo);
      }
    });
  }
  formInfo.append(fragment);
};

// Add token to session storage
const createSession = () => {
  sessionStorage.setItem("token", JSON.stringify(token));
};

// ! Events

// Validate Forms Fields
form.addEventListener("change", (e) => {
  e.preventDefault();
  if (e.target.type === "text") {
    if (e.target.value.trim().length > 0) userIsValid.username = true;
    else userIsValid.username = false;
  }
  if (e.target.type === "password") {
    if (e.target.value.trim().length > 0) userIsValid.password = true;
    else userIsValid.password = false;
  }
});

// Send form and add user
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = e.target.username.value;
  const password = e.target.password.value;

  validateLogInFields();
  checkUserExist(username);

  // Add user to localStore
  if (
    userIsValid.username === true &&
    userIsValid.password === true &&
    userIsValid.checkUser === true
  ) {
    addNewUser(username, password);
    userIsValid.username = false;
    userIsValid.password = false;
    userIsValid.checkUser = false;
    form.reset();
  }

  addUser();
});

// Animate label
form.addEventListener("click", (e) => {
  const target = e.path[1].childNodes[1].name;
  if (target === "username" || target === "password") {
    const field = document.getElementById(`${target}-label`);
    field.classList.add("form__label-active");
  }
});

//  Launch App
form.addEventListener("click", (e) => {
  if (e.target.innerText.trim() === "Enter") {
    checkUserLog(username.value, password.value);
    validateLogInFields();
    if (token) createSession();
  }
});
