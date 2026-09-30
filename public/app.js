async function api(url, method = "GET", body) {
    const options = { method, headers: {} };

    if (localStorage.cs_token) {
        options.headers.Authorization = "Bearer " + localStorage.cs_token;
    }

    if (body !== undefined) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    let data = {};

    try {
        data = await response.json();
    } catch (_) {}

    if (response.status === 401 && url.startsWith("/api/") && data.error === "Login required") {
        data.loginRequired = true;
    }

    return data;
}

function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[char];
    });
}

function isLoggedIn() {
    return Boolean(localStorage.cs_token);
}

function showLoginRequired(target, message) {
    const element = typeof target === "string" ? document.getElementById(target) : target;
    if (!element) return;

    element.innerHTML = "";

    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h2");
    title.textContent = "Sign in to continue";

    const text = document.createElement("p");
    text.className = "muted";
    text.textContent = message || "You need to sign in or log in before you can generate anything.";

    const actions = document.createElement("div");
    actions.className = "auth-choice";

    const login = document.createElement("a");
    login.className = "primary";
    login.href = "/login.html";
    login.textContent = "Log in";

    const signup = document.createElement("a");
    signup.className = "secondary primary";
    signup.href = "/signup.html";
    signup.textContent = "Create account";

    actions.appendChild(login);
    actions.appendChild(signup);
    card.appendChild(title);
    card.appendChild(text);
    card.appendChild(actions);
    element.appendChild(card);
}

async function loadClearSkyBranding() {
    try {
        const response = await fetch("/api/site-settings", { cache: "no-store" });
        if (!response.ok) return;

        const settings = await response.json();
        const brand = settings.brandName || "ClearSky";

        document.querySelectorAll("[data-brand]").forEach(function (element) {
            element.textContent = brand;
        });

        document.querySelectorAll(".brand:not(.global-brand) .brand-name").forEach(function (element) {
            element.textContent = brand;
        });
    } catch (_) {}
}

document.addEventListener("DOMContentLoaded", function () {
    loadClearSkyBranding();
});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(function () {});
}
