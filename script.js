// ================================
// SUBSCRIBE FEATURE
// ================================

document.querySelectorAll(".subscribe-btn").forEach(function(button) {
    button.addEventListener("click", function(event) {
        event.preventDefault();
        alert("Thank you for subscribing.");
    });
});


// ================================
// SHOPPING CART WITH sessionStorage
// ================================

let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

// Add to Cart Buttons
document.querySelectorAll(".add-cart").forEach(function(button) {

    button.addEventListener("click", function() {

        const itemName = this.dataset.item;
        const itemPrice = this.dataset.price;

        const item = {
            name: itemName,
            price: itemPrice
        };

        cart.push(item);

        sessionStorage.setItem("cart", JSON.stringify(cart));

        alert("Item added to the cart.");
    });
});


// View Cart Button
const viewCartButton = document.getElementById("view-cart");

if (viewCartButton) {

    viewCartButton.addEventListener("click", function() {

        let cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];

        let message = "Shopping Cart:\n\n";

        if (cartItems.length === 0) {

            message += "Your cart is empty.";

        } else {

            cartItems.forEach(function(item, index) {

                message += `${index + 1}. ${item.name} - $${item.price}\n`;

            });
        }

        alert(message);
    });
}


// Clear Cart Button
const clearCartButton = document.getElementById("clear-cart");

if (clearCartButton) {

    clearCartButton.addEventListener("click", function() {

        sessionStorage.removeItem("cart");

        cart = [];

        alert("Cart cleared.");
    });
}


// Process Order Button
const processOrderButton = document.getElementById("process-order");

if (processOrderButton) {

    processOrderButton.addEventListener("click", function() {

        sessionStorage.removeItem("cart");

        cart = [];

        alert("Thank you for your order.");
    });
}



// ================================
// CONTACT FORM WITH localStorage
// ================================

const contactForm = document.getElementById("contact-form");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const customerInfo = {

            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            message: document.getElementById("message").value,
            customOrder: document.getElementById("custom-order").checked
        };

        localStorage.setItem(
            "customerOrder",
            JSON.stringify(customerInfo)
        );

        alert("Thank you for your message.");

        contactForm.reset();
    });
}
