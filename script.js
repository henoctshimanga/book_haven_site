// ================================
// SUBSCRIBE FEATURE WITH VALIDATION
// ================================

// Returns true only for strings that match  name@domain.tld
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

document.querySelectorAll("footer form").forEach(function(form) {

    const input  = form.querySelector("input[type='email']");
    const button = form.querySelector(".subscribe-btn");

    if (!input || !button) return;

    // Inject a message span as the last child of the flex form
    // (flex-basis:100% in CSS keeps it on its own row)
    const msg = document.createElement("span");
    msg.className = "subscribe-msg";
    msg.setAttribute("aria-live", "polite");   // announced to screen readers
    form.appendChild(msg);

    // ── helpers ──────────────────────────────

    function showError(text) {
        msg.textContent = text;
        msg.className = "subscribe-msg subscribe-msg--error";
        input.classList.add("input-error");
        input.classList.remove("input-success");
        input.setAttribute("aria-invalid", "true");
    }

    function showSuccess(text) {
        msg.textContent = text;
        msg.className = "subscribe-msg subscribe-msg--success";
        input.classList.add("input-success");
        input.classList.remove("input-error");
        input.removeAttribute("aria-invalid");
        input.value = "";

        // Auto-clear the success state after 4 s
        setTimeout(function() {
            msg.textContent = "";
            msg.className = "subscribe-msg";
            input.classList.remove("input-success");
        }, 4000);
    }

    function clearMsg() {
        msg.textContent = "";
        msg.className = "subscribe-msg";
        input.classList.remove("input-error", "input-success");
        input.removeAttribute("aria-invalid");
    }

    // ── listeners ────────────────────────────

    // Dismiss error as soon as the user starts correcting
    input.addEventListener("input", function() {
        if (input.classList.contains("input-error")) {
            clearMsg();
        }
    });

    button.addEventListener("click", function(event) {
        event.preventDefault();

        const value = input.value.trim();

        if (value === "") {
            showError("Please enter your email address.");
            input.focus();
            return;
        }

        if (!isValidEmail(value)) {
            showError("Please enter a valid email address (e.g. name@example.com).");
            input.focus();
            return;
        }

        showSuccess("Thank you for subscribing!");
    });
});


// ================================
// NOTIFICATION MODAL
// ================================

// Inject one reusable notification modal into every page at load time.
// No HTML changes needed — the element is created here and appended to <body>.
(function () {
    const tpl = document.createElement("div");
    tpl.innerHTML =
        '<div id="notif-modal" class="modal-overlay" role="dialog" ' +
            'aria-modal="true" aria-labelledby="notif-title" hidden>' +
          '<div class="modal-box notif-box">' +

            '<div class="modal-header notif-header">' +
              '<h3 id="notif-title"></h3>' +
              '<button type="button" id="notif-close" aria-label="Close">&times;</button>' +
            '</div>' +

            '<div class="modal-body notif-body">' +
              '<p id="notif-message"></p>' +
            '</div>' +

            '<div class="modal-footer notif-footer">' +
              '<button type="button" id="notif-ok">OK</button>' +
            '</div>' +

          '</div>' +
        '</div>';
    document.body.appendChild(tpl.firstElementChild);
}());

const notifModal   = document.getElementById("notif-modal");
const notifTitle   = document.getElementById("notif-title");
const notifMessage = document.getElementById("notif-message");
const notifClose   = document.getElementById("notif-close");
const notifOk      = document.getElementById("notif-ok");

const NOTIF_CONFIG = {
    success: { label: "✓  Success" },
    info:    { label: "ℹ  Info"    },
    warning: { label: "⚠  Warning" },
    error:   { label: "✕  Error"   }
};

// Opens the notification modal.
// type: "success" | "info" | "warning" | "error"  (default "info")
function showNotif(message, type) {
    type = NOTIF_CONFIG[type] ? type : "info";

    const box = notifModal.querySelector(".notif-box");

    // Swap type modifier class
    Object.keys(NOTIF_CONFIG).forEach(function (t) {
        box.classList.remove("notif-box--" + t);
    });
    box.classList.add("notif-box--" + type);

    notifTitle.textContent   = NOTIF_CONFIG[type].label;
    notifMessage.textContent = message;

    notifModal.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    notifOk.focus();
}

function closeNotif() {
    notifModal.setAttribute("hidden", "");
    document.body.style.overflow = "";
}

notifClose.addEventListener("click", closeNotif);
notifOk.addEventListener("click", closeNotif);

// Click the dark backdrop to close
notifModal.addEventListener("click", function (e) {
    if (e.target === notifModal) { closeNotif(); }
});

// Escape key to close
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !notifModal.hasAttribute("hidden")) {
        closeNotif();
    }
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

        showNotif('"' + itemName + '" has been added to your cart.', "success");
    });
});


// ================================
// VIEW CART MODAL
// ================================

const viewCartButton = document.getElementById("view-cart");
const cartModal      = document.getElementById("cart-modal");

if (viewCartButton && cartModal) {

    const modalBody     = document.getElementById("modal-body");
    const modalTotal    = document.getElementById("modal-total");
    const modalClose    = document.getElementById("modal-close");
    const modalCloseBtn = document.getElementById("modal-close-btn");

    // Build and open the modal
    function openCartModal() {

        const cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];

        // Clear previous content
        modalBody.innerHTML = "";

        if (cartItems.length === 0) {

            modalBody.innerHTML = "<p>Your cart is empty.</p>";
            modalTotal.textContent = "Total: $0.00";

        } else {

            let total = 0;

            cartItems.forEach(function(item) {

                const row = document.createElement("div");
                row.className = "cart-item-row";
                row.innerHTML =
                    `<span class="cart-item-name">${item.name}</span>` +
                    `<span class="cart-item-price">$${parseFloat(item.price).toFixed(2)}</span>`;
                modalBody.appendChild(row);
                total += parseFloat(item.price);
            });

            modalTotal.textContent = `Total: $${total.toFixed(2)}`;
        }

        cartModal.removeAttribute("hidden");
        document.body.style.overflow = "hidden";  // prevent background scroll
        modalClose.focus();
    }

    // Close the modal and restore focus
    function closeCartModal() {
        cartModal.setAttribute("hidden", "");
        document.body.style.overflow = "";
        viewCartButton.focus();
    }

    // Button listeners
    viewCartButton.addEventListener("click", openCartModal);
    modalClose.addEventListener("click", closeCartModal);
    modalCloseBtn.addEventListener("click", closeCartModal);

    // Click outside the box to close
    cartModal.addEventListener("click", function(e) {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });

    // Escape key to close
    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape" && !cartModal.hasAttribute("hidden")) {
            closeCartModal();
        }
    });
}


// Clear Cart Button
const clearCartButton = document.getElementById("clear-cart");

if (clearCartButton) {

    clearCartButton.addEventListener("click", function() {

        sessionStorage.removeItem("cart");

        cart = [];

        showNotif("Your cart has been cleared.", "info");
    });
}


// Process Order Button
const processOrderButton = document.getElementById("process-order");

if (processOrderButton) {

    processOrderButton.addEventListener("click", function() {

        sessionStorage.removeItem("cart");

        cart = [];

        showNotif("Thank you for your order! We will be in touch soon.", "success");
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

        showNotif("Thank you for your message! We will get back to you soon.", "success");

        contactForm.reset();
    });
}
