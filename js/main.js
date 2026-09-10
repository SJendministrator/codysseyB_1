const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(
  ".nav-menu a, .hero-buttons a, .logo",
);
const header = document.querySelector(".header");
const themeToggle = document.querySelector(".theme-toggle");
const scrollTopButton = document.querySelector("#scroll-top");
const projectStatus = document.querySelector(".project-status");
const projectList = document.querySelector(".project-list");
const retryButton = document.querySelector(".retry-button");
const contactForm = document.querySelector("#contact-form");
const formSuccess = document.querySelector("#form-success");
const formFields = [...contactForm.querySelectorAll("input, textarea")];

const githubUsername = "SJendministrator";
const apiUrl = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=12`;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const state = {
  theme: localStorage.getItem("portfolio-theme") || "dark",
  projects: [],
  projectStatus: "loading",
};

const setTheme = (theme) => {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀" : "☾";
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환",
  );
  themeToggle.setAttribute(
    "title",
    theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환",
  );
  localStorage.setItem("portfolio-theme", theme);
};

const closeMenu = () => {
  navMenu.classList.remove("active");
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "메뉴 열기");
};

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("active");
  navToggle.classList.toggle("active", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
});

themeToggle.addEventListener("click", () => {
  setTheme(state.theme === "dark" ? "light" : "dark");
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId && document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMenu();
  });
});

const updateScrollUi = () => {
  const isScrolled = window.scrollY >= 60;
  header.classList.toggle("scrolled", isScrolled);
  scrollTopButton.classList.toggle("show", window.scrollY >= 300);
};

window.addEventListener("scroll", updateScrollUi, { passive: true });
scrollTopButton.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

const renderProjects = () => {
  projectList.innerHTML = "";
  retryButton.hidden = true;

  if (state.projectStatus === "loading") {
    projectStatus.innerHTML =
      '<span class="spinner" aria-hidden="true"></span> 프로젝트를 불러오는 중...';
    projectStatus.className = "project-status is-loading";
    return;
  }

  if (state.projectStatus === "error") {
    projectStatus.textContent =
      "프로젝트를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.";
    projectStatus.className = "project-status is-error";
    retryButton.hidden = false;
    return;
  }

  if (state.projects.length === 0) {
    projectStatus.textContent = "표시할 프로젝트가 없습니다.";
    projectStatus.className = "project-status is-empty";
    return;
  }

  projectStatus.textContent = `${state.projects.length}개의 프로젝트를 불러왔습니다.`;
  projectStatus.className = "project-status is-success";
  projectList.innerHTML = state.projects
    .map(({ name, description, language, html_url, homepage, updated_at }) => {
      const updatedDate = new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(updated_at));
      const projectDescription =
        description || "프로젝트 설명이 아직 등록되지 않았습니다.";
      const demoLink = homepage
        ? `<a class="project-link" href="${homepage}" target="_blank" rel="noopener noreferrer">Live demo <span aria-hidden="true">↗</span></a>`
        : "";

      return `
            <article class="project-card reveal-item">
                <div class="project-card__top">
                    <span class="project-language">${language || "Code"}</span>
                    <span class="project-date">Updated ${updatedDate}</span>
                </div>
                <h3>${name}</h3>
                <p>${projectDescription}</p>
                <div class="project-links">
                    <a class="project-link" href="${html_url}" target="_blank" rel="noopener noreferrer">View code <span aria-hidden="true">↗</span></a>
                    ${demoLink}
                </div>
            </article>`;
    })
    .join("");
};

const fetchRepositories = async () => {
  state.projectStatus = "loading";
  renderProjects();

  try {
    const response = await fetch(apiUrl, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok)
      throw new Error(`GitHub API request failed: ${response.status}`);

    const repositories = await response.json();
    state.projects = repositories.filter(
      ({ fork, archived }) => !fork && !archived,
    );
    state.projectStatus = "success";
  } catch (error) {
    console.error(error);
    state.projectStatus = "error";
  }

  renderProjects();
};

retryButton.addEventListener("click", fetchRepositories);

const setFieldError = (field, message = "") => {
  const fieldGroup = field.closest(".form-group");
  const errorMessage = fieldGroup.querySelector(".error-message");
  fieldGroup.classList.toggle("has-error", Boolean(message));
  errorMessage.textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
};

const validateField = (field) => {
  const value = field.value.trim();
  let message = "";

  if (!value)
    message = `${field.previousElementSibling.textContent.trim()}을(를) 입력해 주세요.`;
  else if (field.type === "email" && !emailPattern.test(value))
    message = "올바른 이메일 주소를 입력해 주세요.";

  setFieldError(field, message);
  return !message;
};

formFields.forEach((field) =>
  field.addEventListener("input", () => {
    if (field.closest(".form-group").classList.contains("has-error"))
      validateField(field);
    formSuccess.textContent = "";
  }),
);

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const isValid = formFields.map(validateField).every(Boolean);

  if (!isValid) {
    formSuccess.textContent = "입력 내용을 확인해 주세요.";
    formSuccess.classList.remove("is-success");
    return;
  }

  formSuccess.textContent = "메시지가 준비되었습니다. 곧 답변드릴게요!";
  formSuccess.classList.add("is-success");
  contactForm.reset();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 },
);

document
  .querySelectorAll(".reveal")
  .forEach((element) => revealObserver.observe(element));

setTheme(state.theme);
updateScrollUi();
fetchRepositories();
