document.getElementById("searchInput").addEventListener("input", async (e) => {
  const query = e.target.value;
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const results = await res.json();

  const suggestionBox = document.getElementById("searchSuggestions");
  suggestionBox.innerHTML = "";
  results.forEach(product => {
    const a = document.createElement("a");
    a.href = `/product/${product.id}`;
    a.textContent = product.name;
    a.style.padding = "5px";
    a.style.display = "block";
    a.style.textDecoration = "none";
    a.style.color = "#333";
    suggestionBox.appendChild(a);
  });
});
