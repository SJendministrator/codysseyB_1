// ==============================
// Mobile Navigation: event → class state → menu render
// ==============================

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll('.nav-menu a, .hero-buttons a');

const closeMobileMenu = () => {
    navMenu.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "메뉴 열기");
};

navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
});


// ==============================
// Theme: localStorage state → CSS variable render
// ==============================

const themeToggle = document.querySelector(".theme-toggle");
const html = document.documentElement;
const savedTheme = localStorage.getItem("portfolio-theme");

const renderTheme = (theme) => {
    const isDark = theme === "dark";

    html.setAttribute("data-theme", theme);
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-label", isDark ? "라이트 모드로 전환" : "다크 모드로 전환");
};

renderTheme(savedTheme || html.getAttribute("data-theme") || "light");

themeToggle.addEventListener("click", () => {
    const nextTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";

    localStorage.setItem("portfolio-theme", nextTheme);
    renderTheme(nextTheme);
});


// ==============================
// Smooth Scroll: click event → scroll position update
// ==============================

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (!targetSection) return;

        event.preventDefault();
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        closeMobileMenu();
    });
});


// ==============================
// Scroll UI: scroll position → navigation/top-button render
// ==============================

const header = document.querySelector(".header");
const scrollTopButton = document.querySelector("#scroll-top");
const scrollThreshold = 300;
const headerThreshold = 60;

const renderScrollUi = () => {
    header.classList.toggle("scrolled", window.scrollY >= headerThreshold);
    scrollTopButton.classList.toggle("show", window.scrollY >= scrollThreshold);
};

window.addEventListener("scroll", renderScrollUi, { passive: true });
scrollTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
renderScrollUi();


// ==============================
// Reveal Animation: observer state → visible class render
// ==============================

const revealTargets = document.querySelectorAll(".section-title, .about-content, .skill-card, .projects .container, .contact .container");
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
    });
}, { threshold: 0.2 });

revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
});


// ==============================
// GitHub Projects: request state → project UI render
// ==============================

const githubUsername = "SJendministrator";
const apiUrl = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`;
const projectStatus = document.querySelector(".project-status");
const projectList = document.querySelector(".project-list");
const retryButton = document.querySelector(".retry-button");

const renderProjects = (state, repositories = []) => {
    projectList.innerHTML = "";
    retryButton.hidden = state !== "error";

    if (state === "loading") {
        projectStatus.innerHTML = '<span class="loading-spinner" aria-hidden="true"></span> 프로젝트를 불러오는 중...';
        return;
    }

    if (state === "error") {
        projectStatus.textContent = "프로젝트를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.";
        return;
    }

    if (repositories.length === 0) {
        projectStatus.textContent = "표시할 프로젝트가 없습니다.";
        return;
    }

    projectStatus.textContent = `${repositories.length}개의 프로젝트를 표시하고 있습니다.`;
    projectList.innerHTML = repositories.map((repository) => {
        const { name, description, language, html_url: url, stargazers_count: stars } = repository;
        const safeDescription = description || "프로젝트 설명이 아직 등록되지 않았습니다.";
        const languageLabel = language || "Code";

        return `
            <article class="project-card">
                <div class="project-card__meta">
                    <span>${languageLabel}</span>
                    <span aria-label="스타 ${stars}개">★ ${stars}</span>
                </div>
                <h3>${name}</h3>
                <p>${safeDescription}</p>
                <a class="project-link" href="${url}" target="_blank" rel="noopener noreferrer">GitHub에서 보기 <span aria-hidden="true">↗</span></a>
            </article>
        `;
    }).join("");
};

const fetchRepositories = async () => {
    renderProjects("loading");

    try {
        const response = await fetch(apiUrl, { headers: { Accept: "application/vnd.github+json" } });

        if (!response.ok) throw new Error(`GitHub API request failed: ${response.status}`);

        const repositories = await response.json();
        const publicRepositories = repositories.filter(({ fork, archived }) => !fork && !archived);

        renderProjects("success", publicRepositories);
    } catch (error) {
        console.error(error);
        renderProjects("error");
    }
};

retryButton.addEventListener("click", fetchRepositories);
fetchRepositories();


// ==============================
// Contact Form: input state → validation and message render
// ==============================

const contactForm = document.querySelector("#contact-form");
const formSuccess = document.querySelector("#form-success");
const fields = [...contactForm.querySelectorAll("input, textarea")];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateField = (field) => {
    const errorMessage = field.closest(".form-group").querySelector(".error-message");
    let message = "";

    if (!field.value.trim()) {
        message = `${field.previousElementSibling.textContent.trim()}을(를) 입력해 주세요.`;
    } else if (field.type === "email" && !emailPattern.test(field.value.trim())) {
        message = "올바른 이메일 형식을 입력해 주세요.";
    }

    field.classList.toggle("is-invalid", Boolean(message));
    field.setAttribute("aria-invalid", String(Boolean(message)));
    errorMessage.textContent = message;
    return !message;
};

fields.forEach((field) => {
    field.addEventListener("input", () => {
        validateField(field);
        formSuccess.textContent = "";
    });
});

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const isFormValid = fields.map(validateField).every(Boolean);

    if (!isFormValid) {
        formSuccess.textContent = "입력 내용을 확인해 주세요.";
        return;
    }

    const { name } = contactForm.elements;
    formSuccess.textContent = `${name.value.trim()}님, 메시지가 준비되었습니다. 빠르게 답변드릴게요!`;
    contactForm.reset();
    fields.forEach((field) => field.setAttribute("aria-invalid", "false"));
});
