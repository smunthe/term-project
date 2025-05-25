window.onload = async () => {
  try {
    const res = await fetch('/api/session', {
      method: 'GET',
      credentials: 'include'
    });

    const data = await res.json();

    if (data.loggedIn) {
      const user = data.user;

      const loginIcon = document.getElementById("loginIcon");
      if (loginIcon) loginIcon.style.display = "none";

      const pfpIcon = document.getElementById("pfpIcon");
      const pfpImage = document.getElementById("pfpImage");

      if (pfpIcon && pfpImage) {
        pfpIcon.style.display = "inline-block";
        pfpImage.src = user.pfp && user.pfp !== "empty" ? user.pfp : "/default-pfp.png";
      }

    } else {
      const loginIcon = document.getElementById("loginIcon");
      const pfpIcon = document.getElementById("pfpIcon");

      if (loginIcon) loginIcon.style.display = "inline-block";
      if (pfpIcon) pfpIcon.style.display = "none";
    }

    const searchInput = document.getElementById("searchInput");
    const suggestionBox = document.getElementById("searchSuggestions");

    if (searchInput && suggestionBox) {
      searchInput.addEventListener("input", async () => {
        const query = searchInput.value.trim();
        if (query.length < 1) {
          suggestionBox.innerHTML = "";
          return;
        }

        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const suggestions = await res.json();

        suggestionBox.innerHTML = "";
        suggestions.forEach(product => {
          const li = document.createElement("li");
          li.innerHTML = `<a href="/product/${product.id}">${product.name}</a>`;
          suggestionBox.appendChild(li);
        });
      });
    }

  } catch (err) {
    console.error("❌ Session check failed:", err);
  }
};
