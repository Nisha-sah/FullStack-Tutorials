// script.js
const menuButton = document.getElementById("menu-button");
const navMenu = document.querySelector(".Navbar ul");

menuButton.addEventListener("click", () => {
  navMenu.classList.toggle("show-menu");
});
