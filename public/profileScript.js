window.onload = () => {
  setTimeout(loadSessionData, 100); // wait 100ms after load
};

async function loadSessionData() {
  try {
    const res = await fetch('/api/session', {
      method: 'GET',
      credentials: 'include'
    });

    const data = await res.json();

    if (!data.loggedIn) {
      window.location.href = '/login.html';
      return;
    }

    const user = data.user;
    console.log("✅ Session data loaded:", user);
    // Set Profile Header
    document.getElementById("profilePic").src = user.pfp || '/default-pfp.png';
    document.getElementById("profileName").textContent = user.firstName;
    document.getElementById("profileEmail").textContent = `Email: ${user.email}`;

    // Set Personal Info
    document.getElementById("profileAddress").textContent = `🏠 Address: ${user.shippingAddress}`;
    document.getElementById("profilePayment").textContent = `💳 Payment Method: ${user.paymentMethod}`;

    // Example: Parse and insert recent orders (if stored as JSON)
    if (user.previouslyOrdered) {
      const orders = JSON.parse(user.previouslyOrdered); // Must be stored as JSON string
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
    console.error("Session fetch failed:", err);
    window.location.href = '/login.html';
  }
};
