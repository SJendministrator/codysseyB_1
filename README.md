# Jin's Vanilla Portfolio

외부 프레임워크나 UI 라이브러리 없이 **HTML, CSS, JavaScript**만으로 만든 반응형 포트폴리오 웹사이트입니다. 사용자의 이벤트가 상태를 바꾸고, 그 상태가 DOM 렌더링으로 이어지는 흐름에 집중했습니다.

> **배포 URL:** GitHub Pages 배포 후 `https://<github-username>.github.io/<repository-name>/` 주소를 이곳에 입력하세요.

## 주요 기능

- **반응형 UI:** 모바일 우선으로 작성했으며 768px(태블릿), 1024px(데스크톱)에서 레이아웃을 확장합니다.
- **내비게이션:** 모바일 햄버거 메뉴, 앵커 기반 부드러운 스크롤, 60px 이상 스크롤 시 헤더 배경 변화가 있습니다.
- **테마:** 다크/라이트 모드와 `localStorage`를 이용한 테마 설정 유지 기능을 제공합니다.
- **스크롤 인터랙션:** 300px 이상 스크롤하면 맨 위로 이동하는 버튼이 나타납니다. Intersection Observer의 `threshold: 0.25`로 섹션 등장 애니메이션을 실행합니다.
- **GitHub API:** `SJendministrator` 계정의 저장소를 `fetch`와 `async/await`로 요청합니다. 로딩, 성공, 오류(재시도), 빈 목록 상태를 각각 UI로 렌더링합니다.
- **문의 폼:** 이름·이메일·메시지 필수 입력 및 이메일 형식 검사와 필드별 오류 메시지를 제공합니다.

## 상태 → 렌더링 흐름

1. 테마 버튼 클릭 → `state.theme` 변경 및 localStorage 저장 → `data-theme` 속성/버튼 문구 갱신
2. API 요청 시작·성공·실패 → `state.projectStatus` 및 `state.projects` 변경 → `renderProjects()`가 로딩/카드/오류/빈 상태 렌더링
3. 폼 제출 또는 입력 → 유효성 상태 변경 → 해당 입력 근처의 오류 메시지와 성공 메시지 갱신
4. 스크롤 → 헤더와 맨 위 버튼의 class 변경 → 시각 상태 갱신

## 실행 방법

1. 저장소를 클론합니다.
2. VS Code에서 폴더를 열고 **Live Server** 확장으로 `index.html`을 실행합니다.
3. GitHub API는 비인증 요청 기준 시간당 60회 제한이 있으므로 반복 새로고침은 피하세요.

## 폴더 구조

```text
├── index.html
├── css/
│   ├── style.css
│   ├── variables.css
│   ├── common.css
│   ├── components.css
│   └── responsive.css
├── js/main.js
└── images/profile.jpg
```

## 스크린샷

배포 후 데스크톱, 모바일, 다크 모드 화면을 캡처해 `images/` 폴더에 저장하고 아래에 연결하세요.

- Desktop: `images/portfolio-desktop.png`
- Mobile: `images/portfolio-mobile.png`
- Dark mode: `images/portfolio-dark.png`
