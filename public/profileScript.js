
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
    document.body.style.backgroundColor = "#e3f2fd";
    const user = data.user;
    console.log("✅ Session data loaded:", user);
    // Set Profile Header
    document.getElementById("profilePic").src = user.pfp || '/default-pfp.png';
console.log("👀 Loaded user:", user);
document.getElementById("profileName").textContent = user.firstName || "No name!";    document.getElementById("profileEmail").textContent = `Email: ${user.email}`;

    // Set Personal Info
    document.getElementById("profileAddress").textContent = `🏠 Address: ${user.shippingAddress}`;
    document.getElementById("profilePayment").textContent = `💳 Payment Method: ${user.paymentMethod}`;

    // Example: Parse and insert recent orders (if stored as JSON)
    if (user.previouslyOrdered && user.previouslyOrdered !== "empty") {
  try {
    const orders = JSON.parse(user.previouslyOrdered);
    const orderList = document.getElementById("orderList");

    orders.slice(0, 2).forEach(order => {
      const div = document.createElement("div");
      div.className = "order";
      div.innerHTML = `
        <img src="${order.image}" alt="${order.name}" />
        <div>
          <p><strong>${order.name}</strong></p>
          <p>Purchased on: ${order.date}</p>
          <p>Status: ${order.status}</p>
        </div>
      `;
      orderList.appendChild(div);
    });
  } catch (e) {
    console.error("❌ Failed to parse previouslyOrdered JSON:", e);
  }
}

    // Example: Fill Favorites (if stored in DB later)
    const favorites = user.favorites || [
      { name: "Dream House", image: "/assets/productImages/dreamHouse.png" },
      { name: "Dream Partner", image: "/assets/productImages/DreamPartner.png" },
      { name: "Nightmare Protection", image: "/assets/productImages/NightmareProtection.png" },
      { name: "Dream Car", image: "/assets/productImages/DreamCar.png" },
      { name: "Dream Pet", image: "/assets/productImages/DreamPet.png" },
      { name: "Dream Scenario", image: "/assets/productImages/DreamScenario.png" }
    ];

    const favoritesGrid = document.getElementById("favoritesGrid");
    favorites.forEach(item => {
      const div = document.createElement("div");
      div.className = "favorite-item";
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <p>${item.name}</p>
      `;
      favoritesGrid.appendChild(div);
    });

  } catch (err) {
   console.error("❌ SESSION FETCH FAILED:", err);
  alert("Session error: " + err); // 🔍 you’ll actually see it now
  window.location.href = '/login';
  }
};
window.onload = () => {
  loadSessionData();
};