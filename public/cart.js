const cartPopupBtn = document.getElementById("cartBtn");
const apiCartItems = document.getElementById("cartItems");
const checkoutForm = document.getElementById("checkoutForm");
const loadingIcon = document.querySelector("#loadingIcon");
const closeBtn = document.querySelector(".close");
const cartContent = document.getElementById("cartContent");
const clearCartBtn = document.getElementById("clearCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const totalPriceHTML = document.getElementById("totalPrice");

let cartEmpty = true;
let totalPrice = 0;

// get Items stored in cart on API
async function getCartItems() {
  const res = await fetch("/cart");
  const result = await res.json();
  let cartItems = result.line_items;
  return cartItems;
}

// Display cart information in popup
function generateCartHTML(cartItems) {
  // when cart is empty this shows
  console.log(cartItems)
  if (cartItems.length === 0) {
    cartEmpty = true;
    checkoutBtn.style.display = "none";
    clearCartBtn.style.display = "none";
    return "<p>Your cart is empty.</p>";
  }

  let cartHTML = "";
  totalPrice = 0;
  // Iterate through each item in the cart
  for (const itemID in cartItems) {
    const item = cartItems[itemID];
    const itemHTML = `
      <div class="cartItem">
        <h3 class="itemName">${item.name}: ${item.quantity} | $${item.price.raw * item.quantity}</h3>
      </div>
    `;
    cartHTML += itemHTML;
    // adds price of all items to var
    totalPrice = totalPrice + (item.price.raw * item.quantity);
  }
  // sets displayed total
  totalPriceHTML.innerHTML = `Total: $` + totalPrice;
  // sets the cart total to be pulled in checkout.js
  localStorage.setItem("totalPrice", totalPrice);
  cartEmpty = false;
  // shows checkout button ONLY when there are items in the cart
  checkoutBtn.style.display = "inline-block";
  clearCartBtn.style.display = "inline-block";
  return cartHTML;
}

// show Cart popup
cartPopupBtn.addEventListener("click", async function () {
  // Show the loading icon and hide the checkout form
  loadingIcon.style.display = "block";
  popup.style.display = "block";

  // Generate HTML for the cart items
  const cartItems = await getCartItems();
  const cartHTML = generateCartHTML(cartItems);
  // Hide the loading icon and show the cart items and checkout button
  loadingIcon.style.display = "none";
  cartContent.style.display = "block";
  checkoutForm.style.display = "none";
  apiCartItems.style.display = "block";
  checkoutBtn.style.opacity = "100%";
  apiCartItems.innerHTML = cartHTML;

  // Close popup when X is clicked
  closeBtn.addEventListener("click", function () {
    popup.style.display = "none";
    cartContent.style.display = "none";
    checkoutForm.style.display = "none";
    apiCartItems.style.display = "none";
  });
});

// Checkout Function
checkoutBtn.addEventListener("click", async () => {
  // shows loading icon when api is being called
  loadingIcon.style.display = "block";
  checkoutBtn.style.opacity = "0%";
  try {
    // removes loading icon and displays checkout form
    loadingIcon.style.display = "none";
    checkoutBtn.style.display = "none";
    clearCartBtn.style.display = "none";
    checkoutForm.style.display = "block";
    apiCartItems.style.display = "none";
  } catch (err) {
    console.log(err);
  }
});

clearCartBtn.addEventListener("click", async () => {
  clearCartBtn.innerHTML = " Emptying... "
  try {
    const res = await fetch('/clear');
    const result = await res.json();
    console.log("cart Cleared");
    clearCartBtn.innerHTML = "Empty Cart";
      cartEmpty = true;
      checkoutBtn.style.display = "none";
      clearCartBtn.style.display = "none";
      apiCartItems.innerHTML = "<p>Your cart is empty.</p>";
      totalPriceHTML.innerHTML = `Total: $0`;
  }
  catch (err) {
    console.log(err)
  }
}) 