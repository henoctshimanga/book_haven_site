// Subscribe button alert on all pages
document.querySelectorAll("footer button").forEach(function(button) {
  button.addEventListener("click", function(event) {
    event.preventDefault();
    alert("Thank you for subscribing.");
  });
});

// Gallery page buttons
document.querySelectorAll(".add-cart").forEach(function(button) {
  button.addEventListener("click", function() {
    alert("Item added to the cart.");
  });
});

const clearCartButton = document.getElementById("clear-cart");
if (clearCartButton) {
  clearCartButton.addEventListener("click", function() {
    alert("Cart cleared.");
  });
}

const processOrderButton = document.getElementById("process-order");
if (processOrderButton) {
  processOrderButton.addEventListener("click", function() {
    alert("Thank you for your order.");
  });
}

// Contact form submit alert
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function(event) {
    event.preventDefault();
    alert("Thank you for your message.");
  });
}
