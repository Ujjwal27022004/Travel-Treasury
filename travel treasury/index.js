document.getElementById("navbar-toggle").addEventListener("click", function () {
    var navbarMenu = document.getElementById("navbar-menu");
    var expanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !expanded);
    navbarMenu.style.display = expanded ? "none" : "flex";
});

// -------------------------Content change time to time -----------------------------------

const words = ["Expense Tracking and Categorization", "Budget Creation and Monitoring", "Visual Reports and Analytics","Goal Setting and Tracking"];
let currentIndex = 0;

function changeContent() {
  const contentElement = document.getElementById('features');
  contentElement.innerText = ` ${words[currentIndex]}`;
  currentIndex = (currentIndex + 1) % words.length;  // Cycle through the words
}

// Change content every 3 seconds
setInterval(changeContent, 3000);
// -------------------------Content change time to time end -----------------------------------

// --------scrolling------------
document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll("header a");

  navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
          e.preventDefault();

          const targetId = this.getAttribute("href").substring(1); // Get the target section ID
          const targetSection = document.getElementById(targetId); // Get the target section

          if (targetSection) {
              window.scrollTo({
                  top: targetSection.offsetTop,
                  behavior: "smooth", // Smooth scrolling effect
              });
          }
      });
  });
});
