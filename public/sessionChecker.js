window.onload = async () => {
  try {
    const res = await fetch('/api/session', {
      method: 'GET',
      credentials: 'include'
    });

    const data = await res.json();

    if (data.loggedIn) {
      const user = data.user;

      // Hide login icon
      const loginIcon = document.getElementById("loginIcon");
      if (loginIcon) loginIcon.style.display = "none";

      // Show and set PFP
      const pfpIcon = document.getElementById("pfpIcon");
      const pfpImage = document.getElementById("pfpImage");

      if (pfpIcon && pfpImage) {
        pfpIcon.style.display = "inline-block";
        pfpImage.src = user.pfp && user.pfp !== "empty" ? user.pfp : "/default-pfp.png";
      }

    } else {
      // If logged out, show login and hide PFP
      const loginIcon = document.getElementById("loginIcon");
      const pfpIcon = document.getElementById("pfpIcon");

      if (loginIcon) loginIcon.style.display = "inline-block";
      if (pfpIcon) pfpIcon.style.display = "none";
    }

  } catch (err) {
    console.error("❌ Session check failed:", err);
  }
};
