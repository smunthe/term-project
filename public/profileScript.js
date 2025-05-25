
console.log("🐛 profileScript.js is loaded and running!");
async function loadSessionData() {
  try {
    const res = await fetch('/api/session', {
      method: 'GET',
      credentials: 'include'
    });

    const data = await res.json();

    if (!data.loggedIn) {
      window.location.href = '/login';
      return;
    }
    // Change to yellow (matches your CSS)
    document.body.style.backgroundColor = "#FFFFDB";
    const user = data.user;
    console.log("✅ Session data loaded:", user);
    // Set Profile Header
    document.getElementById("profilePic").src = user.pfp || '/default-pfp.png';
    console.log("👀 Loaded user:", user);
    document.getElementById("profileName").textContent = user.firstName || "No name!";    document.getElementById("profileEmail").textContent = `Email: ${user.email}`;

   
    document.getElementById("profileAddress").textContent = `🏠 Address: ${user.shippingAddress}`;
    document.getElementById("profilePayment").textContent = `💳 Payment Method: ${user.paymentMethod}`;

    
    if (user.previouslyOrdered && user.previouslyOrdered !== "empty") {
  try {
    const orders = JSON.parse(user.previouslyOrdered);
    const orderList = document.getElementById("orderList");

    orders.slice(0, 2).forEach(order => {
      const div = document.createElement("div");
      div.className = "order";
      div.innerHTML = `
        <img src="${order.items[0].image}" alt="${order.items[0].name}" />
        <div>
          <p><strong>${order.items[0].name}</strong> × ${order.items[0].quantity}</p>
          <p>$${order.items[0].price}</p>
          <p>🗓️ ${order.date}</p>
          <p>📦 Delivered! </p>
        </div>
      `;
      orderList.appendChild(div);
    });    

    
  } catch (e) {
    console.error("❌ Failed to parse previouslyOrdered JSON:", e);
  }
}

  const favorites = JSON.parse(user.wishList || '[]');
  const allProductsRes = await fetch('/api/products'); 
  const allProducts = await allProductsRes.json();

  const favoritesGrid = document.getElementById("favoritesGrid");
  favoritesGrid.innerHTML = '';

  favorites.forEach(productId => {
    const item = allProducts.find(p => p.id === productId);
    if (!item) return;

    const div = document.createElement("div");
    div.className = "favorite-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <p>${item.name}</p>
      <form method="POST" action="/favorites/toggle">
        <input type="hidden" name="productId" value="${item.id}" />
        <button type="submit">❌ Remove</button>
      </form>
      <form method="POST" action="/shopingcart/add">
        <input type="hidden" name="productId" value="${item.id}" />
        <input type="hidden" name="quantity" value="1" />
        <button type="submit">🛒 Add to Cart</button>
      </form>
    `;
    favoritesGrid.appendChild(div);
});

  } catch (err) {
   console.error("❌ SESSION FETCH FAILED:", err);
  alert("Session error: " + err); 
  window.location.href = '/login';
  }
};
window.onload = () => {
  loadSessionData();
};