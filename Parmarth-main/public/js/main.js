/*Navbar*/
const toggleBtn = document.querySelector(".menu-btn")
const sidebar = document.querySelector(".nav-links")

toggleBtn.addEventListener("click", function(){
    sidebar.classList.toggle("show-sidebar")
})