function toggleEdit(spanId, inputId) {
  const span = document.getElementById(spanId);
  const input = document.getElementById(inputId);

  if (input.style.display === "none") {
    input.value = span.textContent.trim();
    span.style.display = "none";
    input.style.display = "inline-block";
    input.focus();
  } else {
    span.textContent = input.value;
    span.style.display = "inline-block";
    input.style.display = "none";
  }
}

window.onload = () => {
  document.getElementById("edit-name-button").onclick = () => toggleEdit("profile-name", "name-input");
  document.getElementById("edit-username-button").onclick = () => toggleEdit("username", "username-input");
  document.getElementById("edit-address-button").onclick = () => toggleEdit("address-text", "address-input");
  document.getElementById("edit-email-button").onclick = () => toggleEdit("email-text", "email-input");
  document.getElementById("edit-payment-button").onclick = () => toggleEdit("payment-text", "payment-input");
};
