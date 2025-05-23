document.getElementById("loginForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        const payload = {
          username: document.getElementById("username").value,
          password: document.getElementById("password").value
        };

        try {
          const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
          });

          const data = await res.json();
          if (data.success) {
            console.log("✅ Login worked. Redirecting...");
            window.location.href = "/profile";
          } else {
            alert("Login failed");
          }
        } catch (err) {
          console.error("Login error:", err);
          alert("Login error");
        }
      });
