document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("navbar-container");
    if (!container) return;

    try {
        const response = await fetch("/components/navbar.html", { cache: "no-store" });
        if (!response.ok) throw new Error("Navbar could not be loaded.");
        container.innerHTML = await response.text();

        const page = window.location.pathname.split("/").pop() || "home.html";
        let active = "";
        if (page === "home.html" || page === "index.html" || page === "") active = "home";
        else if (page === "tools.html" || page === "tool.html" || page === "beats.html") active = "tools";
        else if (page === "membership.html" || page === "subscription.html" || page === "payment-method.html") active = "plans";
        else if (page === "admin.html" || page === "admin-editor.html" || page === "admin-subadmins.html" || page === "subadmin.html") active = "dashboard";
        else if (page === "profile.html") active = "profile";

        const dash = document.getElementById("dashboardNav");
        if (dash && localStorage.cs_token) {
            const me = await api("/api/me");
            const role = me.user?.role;
            if (role === "admin") {
                dash.hidden = false;
                dash.href = "/admin.html";
                dash.querySelector(".nav-label").textContent = "Dashboard";
            } else if (role === "subadmin") {
                dash.hidden = false;
                dash.href = "/subadmin.html";
                dash.querySelector(".nav-label").textContent = "Dashboard";
            }
        }

        document.querySelectorAll("[data-nav]").forEach(function (link) {
            if (link.getAttribute("data-nav") === active && !link.hidden) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        });
    } catch (error) {
        console.error("ClearSky navbar error:", error);
    }
});
