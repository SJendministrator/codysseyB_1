// ==============================
// Mobile Navigation
// ==============================

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});


// ==============================
// Dark Mode
// ==============================

const themeToggle = document.querySelector(".theme-toggle");
const html = document.documentElement;

themeToggle.addEventListener("click", () => {
    const isDark = html.getAttribute("data-theme") === "dark";

    if (isDark) {
        // Dark → Light
        html.setAttribute("data-theme", "light");

        themeToggle.textContent = "🌙";
        themeToggle.setAttribute(
            "aria-label",
            "다크 모드로 전환"
        );
    } else {
        // Light → Dark
        html.setAttribute("data-theme", "dark");

        themeToggle.textContent = "☀️";
        themeToggle.setAttribute(
            "aria-label",
            "라이트 모드로 전환"
        );
    }
});


// ==============================
// Smooth Scroll
// ==============================

// 여기에 스무스 스크롤 코드


// ==============================
// Scroll Top
// ==============================

// 여기에 맨 위 버튼 코드


// ==============================
// GitHub API
// ==============================

const githubUsername = "SJendministrator";
const apiUrl = `https://api.github.com/users/${githubUsername}/repos`;

const fetchRepositories = async () => {
    const response = await fetch(apiUrl);
    const repos = await response.json();

    const firstRepo = repos[0];

    console.log(firstRepo.name);
    console.log(firstRepo.description);
    console.log(firstRepo.language);
    console.log(firstRepo.html_url);
};

fetchRepositories();


// ==============================
// Contact Form Validation
// ==============================

// 여기에 폼 검증 코드