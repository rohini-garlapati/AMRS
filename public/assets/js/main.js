/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
  navToggle = document.getElementById('nav-toggle'),
  navClose = document.getElementById('nav-close')

/* Menu show */
navToggle.addEventListener('click', () => {
  navMenu.classList.add('show-menu')
})

/* Menu hidden */
navClose.addEventListener('click', () => {
  navMenu.classList.remove('show-menu')
})

var counter = 1
setInterval(function () {
  document.getElementById('radio' + counter).checked = true
  counter++
  if (counter > 3) {
    counter = 1
  }
}, 5000)

/*=============== SEARCH ===============*/
const search = document.getElementById('search'),
  searchBtn = document.getElementById('search-btn'),
  searchClose = document.getElementById('search-close')

/* Search show */
searchBtn.addEventListener('click', () => {
  search.classList.add('show-search')
})

/* Search hidden */
searchClose.addEventListener('click', () => {
  search.classList.remove('show-search')
})

/*=============== LOGIN ===============*/
const login = document.getElementById('login'),
  loginBtn = document.getElementById('login-btn'),
  loginClose = document.getElementById('login-close')

/* Login show */
loginBtn.addEventListener('click', () => {
  login.classList.add('show-login')
})

/* Login hidden */
loginClose.addEventListener('click', () => {
  login.classList.remove('show-login')
})

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#loginform')
  const createAccountForm = document.querySelector('#signupform')

  document.querySelector('#linkSignup').addEventListener('click', (e) => {
    e.preventDefault()
    loginForm.classList.add('form--hidden')
    createAccountForm.classList.remove('form--hidden')
  })
  document.querySelector('#linkLogin').addEventListener('click', (e) => {
    e.preventDefault()
    loginForm.classList.remove('form--hidden')
    createAccountForm.classList.add('form--hidden')
  })
})

function Loginfunc() {
  var email = document.getElementById('email').value
  var pass = document.getElementById('password').value
  if (email == 'dhanihaneesha@gmail.com' && pass == '123456') {
    window.location = 'dashboard.html'
    alert('Login Successful')
  } else {
    alert('Wrong Email or Password')
  }
}
