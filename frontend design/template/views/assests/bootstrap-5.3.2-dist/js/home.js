import "./";
import $ from "jquery";

const container = document.querySelector(".horizontal-container");
const tickets = document.querySelectorAll(".ticket");

const btnRight = $("#action-right");
const btnLeft = $("#action-left");

const step = direction => {
  const scrollAmount = direction * 220;
  const ctr = $(".horizontal-container").first();
  ctr.animate({ scrollLeft: `+=${scrollAmount}` }, 200);
};

btnLeft[0].onclick = () => {
  step(-1);
};
btnRight[0].onclick = () => {
  step(1);
};
let scrollDirection = "none";
let scrollOffsetLeft = container.scrollLeft;
let scrollTimeout = null;
container.onscroll = () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  scrollTimeout = setTimeout(function() {
    scrollDirection = "none";
    tickets.forEach(ticket => {
      ticket.classList = "ticket";
    });
  }, 20);

  const currentScrollOffsetLeft = container.scrollLeft;

  if (
    scrollOffsetLeft < currentScrollOffsetLeft &&
    scrollDirection !== "right"
  ) {
    scrollDirection = "right";
    tickets.forEach(ticket => {
      ticket.classList = "ticket moving-right";
    });
  } else if (
    scrollOffsetLeft > currentScrollOffsetLeft &&
    scrollDirection !== "left"
  ) {
    scrollDirection = "left";
    tickets.forEach(ticket => {
      ticket.classList = "ticket moving-left";
    });
  }

  scrollOffsetLeft = currentScrollOffsetLeft;
};
