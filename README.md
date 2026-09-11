# Vanilla JavaScript Portfolio

순수 HTML, CSS, JavaScript로 구현한 반응형 개인 포트폴리오 웹사이트입니다.  
프레임워크나 UI 라이브러리 없이 HTML 구조, CSS 레이아웃, JavaScript 이벤트와 상태 관리, GitHub API 연동을 직접 구현했습니다.

## 1. 프로젝트 소개

이 프로젝트는 개인 정보를 소개하고, 기술 스택과 프로젝트를 보여주며, GitHub 저장소를 API로 불러와 동적으로 표시하는 포트폴리오 사이트입니다.

주요 목표는 다음과 같습니다.

- HTML5 시맨틱 태그를 활용한 웹 페이지 구조 설계
- CSS Grid와 Flexbox를 활용한 반응형 레이아웃 구현
- JavaScript를 활용한 사용자 인터랙션 구현
- `localStorage`를 활용한 다크 모드 상태 저장
- GitHub REST API를 활용한 프로젝트 목록 동적 렌더링
- `IntersectionObserver`를 활용한 스크롤 노출 애니메이션
- 문의 폼 입력값 검증 및 오류 메시지 처리
- GitHub Pages를 활용한 배포

---

## 2. 최종 결과물

### 주요 화면

- Hero
- About Me
- Skills
- Projects
- Contact
- Footer

### 주요 인터랙션

- 반응형 햄버거 메뉴
- 다크 모드 전환
- 다크 모드 설정 저장
- 부드러운 페이지 스크롤
- 스크롤 위치에 따른 네비게이션 스타일 변경
- Scroll Top 버튼
- 스크롤 노출 애니메이션
- GitHub API 프로젝트 목록 출력
- GitHub API 로딩 / 성공 / 오류 / 빈 상태 처리
- 문의 폼 유효성 검사

---

## 3. 스크린샷

### Desktop

| 라이트 모드 | 다크 모드 |
| --- | --- |
| ![데스크톱 라이트 모드](images/desktop_light.png) | ![데스크톱 다크 모드](images/desktop_dark.png) |

### Mobile

| 라이트 모드 | 다크 모드 | 모바일 메뉴 |
| --- | --- | --- |
| ![모바일 라이트 모드](images/mobile_light.png) | ![모바일 다크 모드](images/mobile_dark.png) | ![모바일 메뉴](images/mobile_menu.png) |

---

## 4. 사용 기술

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- CSS Grid
- Flexbox

### API

- GitHub REST API

### 개발 도구

- Visual Studio Code
- Live Server
- Google Chrome

### 배포

- GitHub Pages

---

## 5. 주요 기능

### 5.1 반응형 네비게이션

PC와 모바일 환경에 맞춰 네비게이션을 다르게 표시합니다.

- 데스크톱: 가로형 네비게이션
- 모바일: 햄버거 메뉴
- 메뉴 항목 클릭 시 해당 섹션으로 부드럽게 이동
- 메뉴 선택 후 모바일 메뉴 자동 닫기

CSS는 모바일 우선 방식으로 작성하고 `768px`, `1024px` 기준으로 화면 구성을 확장했습니다.

---

### 5.2 다크 모드

화면의 테마를 라이트 / 다크 모드로 전환할 수 있습니다.

```text
사용자 클릭
    ↓
theme 상태 변경
    ↓
data-theme 변경
    ↓
CSS 변수 변경
    ↓
화면 테마 변경
```

선택한 테마는 `localStorage`에 저장하여 페이지를 다시 열어도 유지됩니다.

---

### 5.3 GitHub API 프로젝트 연동

GitHub REST API를 사용하여 저장소 목록을 가져옵니다.

API 형식:

```text
https://api.github.com/users/{본인아이디}/repos
```

현재 프로젝트에서는 다음과 같은 방식으로 저장소를 요청합니다.

```text
fetch()
  ↓
GitHub API 요청
  ↓
응답 확인
  ↓
저장소 데이터 필터링
  ↓
프로젝트 카드 생성
  ↓
화면 출력
```

JavaScript에서는 `async/await`와 `try/catch`를 사용하여 비동기 요청과 오류를 처리합니다.

또한 Fork 저장소와 Archived 저장소는 프로젝트 목록에서 제외합니다.

---

### 5.4 GitHub API 상태 처리

API 요청 결과에 따라 사용자에게 현재 상태를 표시합니다.

| 상태 | 처리 |
| --- | --- |
| Loading | 프로젝트를 불러오는 중이라는 메시지 표시 |
| Success | GitHub 저장소를 프로젝트 카드로 출력 |
| Empty | 표시할 프로젝트가 없다는 메시지 표시 |
| Error | 오류 메시지와 다시 시도 버튼 표시 |

GitHub API의 비인증 요청에는 요청 횟수 제한이 있기 때문에 API 오류가 발생하더라도 페이지 전체가 깨지지 않도록 별도로 처리합니다.

---

### 5.5 Contact Form

문의 폼에는 다음 입력 항목을 사용합니다.

- 이름
- 이메일
- 메시지

입력값을 확인한 후 문제가 있는 경우 각 필드 주변에 오류 메시지를 표시합니다.

검증 항목:

- 필수 입력 여부
- 이메일 형식
- 메시지 입력 여부

모든 입력값이 정상인 경우 성공 메시지를 표시합니다.

---

### 5.6 Scroll UI

스크롤 위치에 따라 추가적인 UI 기능을 제공합니다.

- 네비게이션 스타일 변경
- Scroll Top 버튼 표시 / 숨김
- Scroll Top 버튼 클릭 시 페이지 상단 이동

현재 기준값:

- Scroll Top 버튼 표시: `300px` 이상
- 네비게이션 스크롤 상태 변경: `60px` 이상

---

### 5.7 Scroll Animation

`IntersectionObserver`를 사용하여 화면에 섹션이 나타날 때 애니메이션을 적용합니다.

주요 대상:

- Section Title
- About
- Skill Card
- Projects
- Contact

Observer의 기본 threshold는 `0.2`로 설정했습니다.

---

## 6. 상태 → 렌더링 구조

프로젝트에서는 기능별 상태를 변경하고 그 상태를 화면에 반영하는 구조를 사용했습니다.

### Dark Mode

```text
사용자 클릭
→ theme 상태 변경
→ data-theme 변경
→ CSS 변수 적용
→ 화면 갱신
```

### GitHub API

```text
API 요청
→ loading
→ success / error / empty
→ 프로젝트 영역 렌더링
```

### Contact Form

```text
입력
→ input 이벤트
→ 값 검증
→ 오류 상태 표시
→ submit
→ 성공 메시지 표시
```

---

## 7. 요구 사항 검증

| 요구 사항 | 구현 내용 |
| --- | --- |
| 시맨틱 HTML | `header`, `nav`, `main`, `section`, `article`, `footer` 사용 |
| 반응형 디자인 | 모바일 우선 + `768px`, `1024px` 브레이크포인트 |
| Flexbox | 네비게이션 및 일부 UI 정렬에 사용 |
| CSS Grid | Skills / Projects 레이아웃에 사용 |
| `auto-fit`, `minmax()` | 카드형 콘텐츠 반응형 배치에 사용 |
| CSS 변수 | `:root`와 `[data-theme="dark"]` 사용 |
| 다크 모드 | JavaScript + `localStorage` |
| 햄버거 메뉴 | 모바일 네비게이션 구현 |
| 부드러운 스크롤 | JavaScript `scrollTo()` 사용 |
| Scroll Top | 스크롤 위치에 따라 버튼 표시 |
| Nav Scroll UI | 일정 스크롤 위치 이후 스타일 변경 |
| IntersectionObserver | 섹션 노출 애니메이션 |
| GitHub API | `fetch`, `async/await`, `try/catch` 사용 |
| API 상태 처리 | Loading / Success / Empty / Error |
| Form Validation | 이름 / 이메일 / 메시지 검증 |
| 이벤트 처리 | `click`, `submit`, `scroll`, `input` 사용 |
| DOM 조작 | `querySelector`, `querySelectorAll`, `classList`, `textContent`, `innerHTML` 사용 |
| ES6+ | `const`, `let`, 화살표 함수, 템플릿 리터럴, 구조 분해, `map`, `filter`, `forEach` 사용 |

---

## 8. 프로젝트 구조

```text
portfolio/
├── index.html
├── README.md
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── common.css
│   ├── components.css
│   ├── responsive.css
│   └── style.css
├── js/
│   └── main.js
└── images/
    ├── profile.jpg
    ├── desktop_dark.png
    ├── desktop_light.png
    ├── mobile_dark.png
    ├── mobile_light.png
    └── mobile_menu.png
```

### CSS 파일 역할

| 파일 | 역할 |
| --- | --- |
| `reset.css` | 기본 브라우저 스타일 초기화 |
| `variables.css` | 색상, 글꼴, 간격 등의 CSS 변수 |
| `common.css` | 공통 레이아웃 및 기본 스타일 |
| `components.css` | 버튼, 카드, 네비게이션 등 컴포넌트 스타일 |
| `responsive.css` | 화면 크기별 반응형 스타일 |
| `style.css` | CSS 파일을 하나로 연결하는 진입점 |

`style.css`에서는 다음과 같이 CSS 파일을 불러옵니다.

```css
@import url("reset.css");
@import url("variables.css");
@import url("common.css");
@import url("components.css");
@import url("responsive.css");
```

---

## 9. JavaScript 구성

`index.html`에서 JavaScript는 `defer` 옵션으로 연결합니다.

```html
<script src="js/main.js" defer></script>
```

`main.js`는 다음 기능으로 구성되어 있습니다.

```text
Mobile Navigation
        ↓
Theme
        ↓
Smooth Scroll
        ↓
Scroll UI
        ↓
IntersectionObserver
        ↓
GitHub API
        ↓
Contact Form Validation
```

각 기능은 별도의 상태와 이벤트를 관리하도록 구성했습니다.

---

## 10. 로컬 실행

### 개발 환경

- Visual Studio Code
- Live Server
- Google Chrome

### 실행 방법

1. 저장소를 Clone합니다.
2. 프로젝트 폴더를 Visual Studio Code에서 엽니다.
3. `index.html`을 Live Server로 실행합니다.
4. Chrome에서 페이지를 확인합니다.

별도의 Node.js 설치나 패키지 설치가 필요하지 않습니다.

---

## 11. GitHub API 확인

GitHub API는 비인증 요청을 사용합니다.

기본적인 API 요청은 다음과 같습니다.

```text
GET https://api.github.com/users/{본인아이디}/repos
```

비인증 GitHub API는 요청 횟수 제한이 있으므로 반복적으로 테스트할 경우 API 요청이 제한될 수 있습니다.

API 오류가 발생하면 프로젝트 영역에서 오류 상태를 표시하고 `다시 시도` 버튼을 제공합니다.

---

## 12. 배포

GitHub Pages를 사용하여 정적 웹사이트로 배포할 수 있습니다.

GitHub 저장소에서 다음 설정을 사용합니다.

```text
Settings
→ Pages
→ Build and deployment
→ Deploy from a branch
→ Branch: main
→ Folder: / (root)
```

배포가 완료되면 GitHub Pages에서 포트폴리오를 확인할 수 있습니다.

### 배포 URL

```text
https://SJendministrator.github.io/codysseyB_1/
```

> 실제 Pages 배포가 완료된 후 접속 여부를 확인해야 합니다.

---

## 13. 적용한 기준값

프로젝트의 주요 인터랙션 기준값은 다음과 같습니다.

| 기능 | 기준값 |
| --- | --- |
| Scroll Top 표시 | `300px` |
| Navigation Scroll 상태 | `60px` |
| IntersectionObserver threshold | `0.2` |
| Projects 기본 최소 카드 너비 | `280px` |
| Skills 기본 최소 카드 너비 | `200px` |
| 반응형 1차 breakpoint | `768px` |
| 반응형 2차 breakpoint | `1024px` |

---

## 14. 제한 사항

- GitHub API는 비인증 방식으로 요청합니다.
- GitHub API 요청 횟수 제한으로 인해 일정 횟수 이상 요청하면 오류가 발생할 수 있습니다.
- Contact Form은 현재 입력값 검증과 성공 메시지 표시를 중심으로 구현되어 있으며, 별도의 이메일 전송 서비스와 연결되어 있지 않습니다.
- GitHub Pages는 정적 웹사이트이므로 별도의 서버 없이 HTML / CSS / JavaScript로 동작합니다.

---

## 15. 학습 목표

이 프로젝트를 통해 다음 내용을 직접 구현하고 학습했습니다.

- 시맨틱 HTML 구조 설계
- CSS 변수와 테마 관리
- Flexbox / Grid 기반 반응형 레이아웃
- 모바일 우선 CSS 작성
- JavaScript 이벤트 처리
- DOM 동적 생성 및 수정
- 상태에 따른 화면 렌더링
- `localStorage` 사용
- `IntersectionObserver` 사용
- Fetch API와 비동기 JavaScript
- REST API 데이터 처리
- Form Validation
- Git / GitHub를 활용한 버전 관리
- GitHub Pages 정적 웹사이트 배포

---

## 16. Repository

GitHub Repository:

`https://github.com/SJendministrator/codysseyB_1`
