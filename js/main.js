// ==============================
// Mobile Navigation
// event → class state → menu render
// ==============================

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(
    ".nav-menu a, .hero-buttons a, .logo"
);

const closeMobileMenu = () => {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "메뉴 열기");
};

navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");

    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute(
        "aria-label",
        isOpen ? "메뉴 닫기" : "메뉴 열기"
    );
});


// ==============================
// Theme
// localStorage state → CSS theme render
// ==============================

const themeToggle = document.querySelector(".theme-toggle");
const html = document.documentElement;
const savedTheme = localStorage.getItem("portfolio-theme");

const renderTheme = (theme) => {
    const isDark = theme === "dark";

    html.setAttribute("data-theme", theme);

    themeToggle.textContent = isDark ? "☀️" : "🌙";

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "라이트 모드로 전환" : "다크 모드로 전환"
    );
};

const initialTheme =
    savedTheme || html.getAttribute("data-theme") || "light";

renderTheme(initialTheme);

themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");

    const nextTheme =
        currentTheme === "dark" ? "light" : "dark";

    localStorage.setItem("portfolio-theme", nextTheme);

    renderTheme(nextTheme);
});


// ==============================
// Smooth Scroll
// click event → target section scroll
// ==============================

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || !targetId.startsWith("#")) {
            return;
        }

        const targetSection = document.querySelector(targetId);

        if (!targetSection) {
            return;
        }

        event.preventDefault();

        targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        closeMobileMenu();
    });
});


// ==============================
// Scroll UI
// scroll position → header/top-button render
// ==============================

const header = document.querySelector(".header");
const scrollTopButton = document.querySelector("#scroll-top");

const scrollThreshold = 300;
const headerThreshold = 60;

const renderScrollUi = () => {
    const scrollY = window.scrollY;

    header.classList.toggle(
        "scrolled",
        scrollY >= headerThreshold
    );

    scrollTopButton.classList.toggle(
        "show",
        scrollY >= scrollThreshold
    );
};

window.addEventListener(
    "scroll",
    renderScrollUi,
    { passive: true }
);

scrollTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

renderScrollUi();


// ==============================
// Reveal Animation
// observer state → visible class render
// ==============================

const revealTargets = document.querySelectorAll(
    ".section-title, " +
    ".about-content, " +
    ".skill-card, " +
    ".projects .container, " +
    ".contact .container"
);

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");

            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.2
    }
);

revealTargets.forEach((target) => {
    target.classList.add("reveal");
    revealObserver.observe(target);
});


// ==============================
// GitHub Projects
// request state → project UI render
// ==============================

const githubUsername = "SJendministrator";

const apiUrl =
    `https://api.github.com/users/${githubUsername}/repos` +
    "?sort=updated&per_page=100";

const projectStatus =
    document.querySelector(".project-status");

const projectList =
    document.querySelector(".project-list");

const retryButton =
    document.querySelector(".retry-button");

let githubApiState = "idle";
let lastGithubApiError = null;


// ==============================
// GitHub API Safety
// GitHub text → escaped HTML
// ==============================

const escapeHtml = (value = "") => {
    return String(value).replace(
        /[&<>'"]/g,
        (character) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            "\"": "&quot;"
        })[character]
    );
};

const getSafeRepositoryUrl = (url) => {
    return url?.startsWith("https://github.com/")
        ? url
        : "https://github.com/";
};


// ==============================
// GitHub Project Render
// state → UI
// ==============================

const renderProjects = (
    state,
    repositories = []
) => {
    githubApiState = state;

    projectList.innerHTML = "";

    retryButton.hidden = state !== "error";


    // Loading
    if (state === "loading") {
        projectStatus.innerHTML =
            '<span class="loading-spinner" aria-hidden="true"></span>' +
            " 프로젝트를 불러오는 중...";

        return;
    }


    // Error
    if (state === "error") {
        projectStatus.textContent =
            "프로젝트를 불러올 수 없습니다. " +
            "잠시 후 다시 시도해 주세요.";

        return;
    }


    // Empty
    if (repositories.length === 0) {
        projectStatus.textContent =
            "표시할 프로젝트가 없습니다.";

        return;
    }


    // Success
    projectStatus.textContent =
        `${repositories.length}개의 프로젝트를 표시하고 있습니다.`;

    projectList.innerHTML = repositories
        .map((repository) => {
            const {
                name,
                description,
                language,
                html_url: url,
                stargazers_count: stars
            } = repository;

            const safeDescription = escapeHtml(
                description ||
                "프로젝트 설명이 아직 등록되지 않았습니다."
            );

            const languageLabel = escapeHtml(
                language || "Code"
            );

            const repositoryName = escapeHtml(name);

            const projectUrl =
                getSafeRepositoryUrl(url);

            return `
                <article class="project-card">
                    <div class="project-card__meta">
                        <span>${languageLabel}</span>
                        <span aria-label="스타 ${stars}개">
                            ★ ${stars}
                        </span>
                    </div>

                    <h3>${repositoryName}</h3>

                    <p>${safeDescription}</p>

                    <a
                        class="project-link"
                        href="${projectUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub에서 보기
                        <span aria-hidden="true">↗</span>
                    </a>
                </article>
            `;
        })
        .join("");
};


// ==============================
// GitHub API Request
// async / await → loading / success / error
// ==============================

const fetchRepositories = async (
    requestUrl = apiUrl
) => {
    renderProjects("loading");

    lastGithubApiError = null;

    try {
        const response = await fetch(
            requestUrl,
            {
                headers: {
                    Accept:
                        "application/vnd.github+json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `GitHub API request failed: ${response.status}`
            );
        }

        const repositories =
            await response.json();

        const publicRepositories =
            repositories.filter(
                ({ fork, archived }) =>
                    !fork && !archived
            );

        renderProjects(
            "success",
            publicRepositories
        );

    } catch (error) {
        lastGithubApiError = error;

        console.error(error);

        renderProjects("error");
    }
};

retryButton.addEventListener(
    "click",
    fetchRepositories
);


// ==============================
// Browser Console Debug
// 개발용 GitHub API 상태 확인
// ==============================

const debugRepository = {
    name: "github-api-debug-success",
    description:
        "브라우저 콘솔에서 GitHub API 성공 상태를 확인하기 위한 샘플 저장소입니다.",
    language: "JavaScript",
    html_url: "https://github.com/",
    stargazers_count: 1
};

window.portfolioDebug = Object.freeze({
    github: Object.freeze({

        status: () => ({
            state: githubApiState,
            lastError:
                lastGithubApiError?.message ?? null
        }),

        reload: () => {
            fetchRepositories();
        },

        simulateSuccess: () => {
            lastGithubApiError = null;

            renderProjects(
                "success",
                [debugRepository]
            );
        },

        simulateEmpty: () => {
            lastGithubApiError = null;

            renderProjects(
                "success",
                []
            );
        },

        requestNotFound: () => {
            fetchRepositories(
                "https://api.github.com/users/" +
                "this-user-does-not-exist-portfolio-debug/repos"
            );
        }
    })
});


// ==============================
// Contact Form
// input state → validation → message render
// ==============================

const contactForm =
    document.querySelector("#contact-form");

const formSuccess =
    document.querySelector("#form-success");

const fields = [
    ...contactForm.querySelectorAll(
        "input, textarea"
    )
];


// ASCII 이메일 형식 검사
const emailPattern =
    /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;


// ==============================
// Field Validation
// input → validation state → error UI
// ==============================

const validateField = (field) => {
    const fieldGroup =
        field.closest(".form-group");

    const errorMessage =
        fieldGroup.querySelector(
            ".error-message"
        );

    let message = "";

    const value =
        field.value.trim();


    // Empty field
    if (!value) {
        message =
            `${field.previousElementSibling.textContent.trim()}` +
            "을(를) 입력해 주세요.";
    }


    // Invalid email
    else if (
        field.type === "email" &&
        !emailPattern.test(value)
    ) {
        message =
            "올바른 이메일 형식을 입력해 주세요.";
    }


    field.classList.toggle(
        "is-invalid",
        Boolean(message)
    );

    field.setAttribute(
        "aria-invalid",
        String(Boolean(message))
    );

    errorMessage.textContent =
        message;

    return !message;
};


// ==============================
// Input Event
// ==============================

fields.forEach((field) => {
    field.addEventListener(
        "input",
        () => {
            validateField(field);

            formSuccess.textContent = "";
        }
    );
});


// ==============================
// Submit Event
// ==============================

contactForm.addEventListener(
    "submit",
    (event) => {
        event.preventDefault();

        const isFormValid =
            fields
                .map(validateField)
                .every(Boolean);


        // Validation failed
        if (!isFormValid) {
            formSuccess.textContent =
                "입력 내용을 확인해 주세요.";

            formSuccess.classList.remove(
                "is-success"
            );

            return;
        }


        // Validation success
        const { name } =
            contactForm.elements;

        formSuccess.textContent =
            `${name.value.trim()}님, ` +
            "메시지가 준비되었습니다. " +
            "빠르게 답변드릴게요!";

        formSuccess.classList.add(
            "is-success"
        );

        contactForm.reset();

        fields.forEach((field) => {
            field.setAttribute(
                "aria-invalid",
                "false"
            );

            field.classList.remove(
                "is-invalid"
            );
        });
    }
);


// ==============================
// Initial GitHub Request
// ==============================

fetchRepositories();