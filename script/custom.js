// ---------------------------------------------
// GSAP plugin (한 번만)
// ---------------------------------------------
gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------
// header hide on scroll (그대로 사용)
// ---------------------------------------------
const header = document.querySelector("header");
let lastScrollY = window.scrollY;
const threshold = 5;

// ✅ intro pin 구간 end 길이 통일값
const INTRO_END = "+=300%";

// ✅ intro에서는 헤더 기능 잠금
let introLock = true;

window.addEventListener("scroll", () => {
  // intro에서는 무조건 숨김 + 나머지 로직 실행 안 함
  if (introLock) {
    header.classList.add("hide");
    lastScrollY = window.scrollY; // ✅ 값 갱신해서 튐 방지
    return;
  }

  const currentScroll = window.scrollY;
  if (Math.abs(currentScroll - lastScrollY) < threshold) return;

  if (currentScroll > lastScrollY && currentScroll > header.offsetHeight) {
    header.classList.add("hide"); // down
  } else {
    header.classList.remove("hide"); // up
  }

  lastScrollY = currentScroll;
});

// ✅ intro 구간(핀 포함)에서는 헤더 잠금, 벗어나면 해제
ScrollTrigger.create({
  trigger: "#intro",
  start: "top top",
  end: INTRO_END,
  // markers: true,

  onEnter: () => {
    introLock = true;
    header.classList.add("hide"); // 즉시 숨김
    lastScrollY = window.scrollY;
  },
  onEnterBack: () => {
    introLock = true;
    header.classList.add("hide");
    lastScrollY = window.scrollY;
  },

  onLeave: () => {
    introLock = false; // ✅ intro 끝나면 기존 기능 다시 활성화
    header.classList.add("hide"); // 자연스러운 전환용(원하면 제거 가능)
    lastScrollY = window.scrollY;
  },
  onLeaveBack: () => {
    introLock = true; // ✅ intro 위로 완전히 벗어나면(최상단)도 잠금
    header.classList.add("hide");
    lastScrollY = window.scrollY;
  },
});

// ---------------------------------------------
// gnb contact hover (그대로 사용)
// ---------------------------------------------
let contact = document.querySelector(".gnb li:last-child");
contact.addEventListener("mouseenter", () => {
  contact.classList.add("on");
});
contact.addEventListener("mouseleave", () => {
  contact.classList.remove("on");
});

// -----------------------------------
// intro
// -----------------------------------

const pieces = document.querySelectorAll("#intro .pieces .pieceWrap");

const positions = [
  { x: -600, y: -350 }, // 0
  { x: 480, y: -250 }, // 1
  { x: -330, y: -150 }, // 2
  { x: 200, y: 0 }, // 3
  { x: -300, y: 100 }, // 4
  { x: 300, y: 200 }, // 5
  { x: -50, y: 230 }, // 6
  { x: -510, y: 300 }, // 7
];

for (let i = 0; i < pieces.length; i++) {
  gsap.set(pieces[i], {
    x: positions[i].x,
    y: positions[i].y,
  });
}

// -------------------------------------------------
// ✅ viewport 표류 (pieceWrap 고정, viewport만 움직임)
// -------------------------------------------------
const viewports = document.querySelectorAll(
  "#intro .pieces .pieceWrap .viewport"
);

// viewport는 이미 CSS에서 translate(-50%, -50%)로 중앙정렬 중인데,
// GSAP transform 충돌 방지용으로 percent 기반 중앙값을 고정해줌
gsap.set(viewports, { xPercent: -50, yPercent: -50 });

let floatTweens = [];
const RANGE_X = 200; // ✅ pieceWrap 기준 표류 범위
const RANGE_Y = 120;

// ✅ 표류 시작/재시작 함수(스크롤 업해서 intro 다시 들어오면 표류도 다시 켜지게)
function startIntroFloating() {
  // 기존 tween 정리
  floatTweens.forEach((t) => t.kill());
  floatTweens = [];

  viewports.forEach((vp) => {
    const rx = gsap.utils.random(RANGE_X * 0.6, RANGE_X, 1);
    const ry = gsap.utils.random(RANGE_Y * 0.6, RANGE_Y, 1);

    const t = gsap.to(vp, {
      x: () => gsap.utils.random(-rx, rx),
      y: () => gsap.utils.random(-ry, ry),
      rotation: () => gsap.utils.random(-20, 20),
      duration: gsap.utils.random(3, 5),
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      overwrite: "auto",
    });

    floatTweens.push(t);
  });
}

// 최초 1회 표류 시작
startIntroFloating();

// -------------------------------------------------
// intro : viewport 모이기 (임의 좌표 버전)
// -------------------------------------------------

const gatherPositions = [
  { x: -200, y: -200 }, // 0
  { x: 0, y: -202 }, // 1
  { x: 25, y: -95 }, // 2
  { x: 20, y: -62 }, // 3 (중앙 기준)
  { x: 22, y: 40 }, // 4
  { x: 17, y: 110 }, // 5
  { x: -214, y: 225 }, // 6
  { x: -278, y: 197 }, // 7
];

const gatherTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#intro",
    start: "top top",
    end: INTRO_END,
    scrub: 1,
    pin: true,
    // markers: true,

    // 스크롤로 intro pin 진입/복귀 시: 표류 끄기(죽이고 gather가 덮어씀)
    onEnter: () => {
      floatTweens.forEach((t) => t.kill());
    },
    onEnterBack: () => {
      floatTweens.forEach((t) => t.kill());
    },

    // ✅ intro pin 구간을 완전히 벗어나면 표류 다시 시작
    onLeave: () => {
      startIntroFloating();
    },
    onLeaveBack: () => {
      startIntroFloating();
    },
  },
});

gatherTl
  .to(
    viewports,
    {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 0.2, // 스크럽이라 거의 즉시 느낌
      ease: "none", // 스크럽 안정
      overwrite: "auto", // 떠다니던 값 덮어쓰기
      stagger: 0,
    },
    0
  )
  .to(
    pieces,
    {
      x: (i) => gatherPositions[i].x,
      y: (i) => gatherPositions[i].y,
      rotation: 0,
      duration: 1.5,
      ease: "power3.out",
      stagger: {
        each: 0.06,
        from: "center",
      },
    },
    0
  )
  .to(pieces, {
    opacity: 0,
  })
  .to(
    "#intro .intro_logo>img:nth-of-type(4)",
    {
      opacity: 1,
    },
    ">-0.5"
  )
  .to("#intro .intro_logo>img", {
    x: 75,
    scale: "0.7",
  })
  .to(
    "#intro .intro_logo>img:nth-of-type(1)",
    {
      opacity: 1,
    },
    ">"
  )
  .to(
    "#intro .intro_logo>img:nth-of-type(2)",
    {
      opacity: 1,
    },
    ">"
  )
  .to(
    "#intro .intro_logo>img:nth-of-type(3)",
    {
      opacity: 1,
    },
    ">"
  )

  .to(
    "#intro .shade",
    {
      opacity: 0.8,
      x: 60,
      scale: "0.6",
    },
    ">"
  )
  .fromTo(
    "#intro .sectionTitle",
    {
      opacity: 0,
      y: 50,
    },
    {
      opacity: 1,
      y: 0,
    }
  )
  .fromTo(
    "#intro .roll",
    { opacity: 0, width: 0 },
    { opacity: 1, width: "80%" }
  )
  .fromTo(
    "#intro .roll>div>div",
    {
      opacity: 0,
    },
    { opacity: 1 }
  )
  .fromTo(
    "#intro .line",
    {
      width: 0,
    },
    {
      width: "400px",
    }
  )
  .to({}, { duration: 2 })
  .to("#intro", {
    opacity: "0",
  });

const content = document.querySelector("#intro .roll .right .content");

function applyState() {
  const items = Array.from(content.children);
  items.forEach((el) => el.classList.remove("is-active"));
  if (items[1]) items[1].classList.add("is-active");
}

applyState();

let isRunning = false;

function rotateTextSmooth() {
  if (isRunning) return;
  isRunning = true;

  const items = Array.from(content.children);

  // 1) 살짝 위로 + 페이드 아웃(너무 크게 안 움직이게)
  gsap.to(items, {
    y: -10,
    opacity: 0.85,
    duration: 0.45,
    ease: "power3.inOut",
    stagger: 0.02, // ✅ 아주 미세한 시간차가 부드럽게 느껴짐
    onComplete: () => {
      // 2) DOM 순환
      content.appendChild(items[0]);

      // 3) 다음 프레임 준비: 아래에서 올라오는 느낌
      const newItems = Array.from(content.children);
      gsap.set(newItems, { y: 10, opacity: 0.85 });

      applyState();

      // 4) 원위치로 복귀 + 페이드 인
      gsap.to(newItems, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: "power3.out",
        stagger: 0.02,
        onComplete: () => {
          isRunning = false;
        },
      });
    },
  });
}

setInterval(rotateTextSmooth, 2200);

// -----------------------------------
// about
// -----------------------------------
const aboutTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#about",
    start: "top top",
    end: INTRO_END,
    scrub: 1,
    pin: true,
    markers: true,
  },
});
const bgLeft = document.querySelector("#about .bg .left");
const bgRight = document.querySelector("#about .bg .right");
const about_flowText = document.querySelector("#about .flowText");
aboutTl
  .fromTo(
    about_flowText,
    {
      y: 400,
    },
    {
      y: 300,
      opacity: 1,
    }
  )
  .to(bgLeft, {
    x: -300,
  })
  .to(
    bgRight,
    {
      x: 300,
    },
    "<"
  );

// ---------------------------------------------
// works 영역 세팅
// ---------------------------------------------
const works = document.querySelector("#works");
const guide = works.querySelector(".guideLine");
const length = guide.getTotalLength();
const projects = works.querySelector(".projects");
const numList = projects.querySelector("li:nth-child(1)");
const rect1 = projects.querySelector("li:nth-child(2)");
const weatherList = projects.querySelector("li:nth-child(3)");
const rect2 = projects.querySelector("li:nth-child(4)");
const dreamList = projects.querySelector("li:nth-child(5)");
const rect3 = projects.querySelector("li:nth-child(6)");
const todoList = projects.querySelector("li:nth-child(7)");
const rect4 = projects.querySelector("li:nth-child(8)");

const floatItems = gsap.utils.toArray(
  "#works .projectOverview .lists li .itemInner"
);
const linkSvg = document.querySelector("#works .projectOverview .link-svg");
const linkLine = linkSvg.querySelector(".link-line");

// path 초기 세팅
gsap.set(guide, {
  strokeDasharray: length,
  strokeDashoffset: length,
});

// 카드 연결 선 업데이트
function updateLinkLine() {
  if (!projects || !floatItems.length) return;
  const baseRect = projects.getBoundingClientRect();

  const pointsArr = floatItems.map((inner) => {
    const r = inner.getBoundingClientRect();
    const x = r.left + r.width / 2 - baseRect.left;
    const y = r.top + r.height / 2 - baseRect.top;
    return `${x},${y}`;
  });

  if (pointsArr.length > 0) {
    pointsArr.push(pointsArr[0]); // 마지막과 첫 번째 연결
  }

  linkLine.setAttribute("points", pointsArr.join(" "));
}

updateLinkLine();
window.addEventListener("resize", updateLinkLine);
gsap.ticker.add(updateLinkLine);

// 카드들 둥둥이 애니
function startFloating() {
  floatItems.forEach((inner) => {
    gsap.to(inner, {
      x: "+=" + gsap.utils.random(-60, 60),
      y: "+=" + gsap.utils.random(-40, 40),
      rotation: "+=" + gsap.utils.random(-30, 30),
      duration: gsap.utils.random(3, 5, 3),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });
}

// ---------------------------------------------
// 1) projectOverview 전용 타임라인 (pin + scrub)
// ---------------------------------------------
const overviewTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".projectOverview",
    start: "35% center",
    end: "+=3500",
    scrub: 1,
    pin: true,
    onUpdate: updateLinkLine,
    // markers: true,
  },
});

overviewTl
  .fromTo(".flowText", { y: 300 }, { y: 50, width: "1200px" })
  .fromTo(
    guide,
    { opacity: 0 },
    {
      strokeDashoffset: 0,
      opacity: 1,
    },
    0.2
  )
  .fromTo(
    numList,
    { opacity: 0 },
    {
      opacity: 1,
      x: -600,
      y: -320,
      rotation: -30,
    },
    0.6
  )
  .fromTo(rect1, { opacity: 0 }, { opacity: 1, x: 0, y: -310 })
  .fromTo(
    weatherList,
    { opacity: 0 },
    {
      opacity: 1,
      x: 550,
      y: -350,
      rotation: 35,
    },
    0.8
  )
  .fromTo(rect2, { opacity: 0 }, { opacity: 1, x: 500, y: -50 })
  .fromTo(
    dreamList,
    { opacity: 0 },
    {
      opacity: 1,
      x: 490,
      y: 180,
      rotation: 26,
    },
    1
  )
  .fromTo(rect3, { opacity: 0 }, { opacity: 1, x: 0, y: 120 })
  .fromTo(
    todoList,
    { opacity: 0 },
    {
      opacity: 1,
      x: -550,
      y: 220,
      rotation: 26,
    },
    1.2
  )
  .fromTo(rect4, { opacity: 0 }, { opacity: 1, x: -500, y: -40 })
  .add(startFloating, 0);

// ---------------------------------------------
// 2) projectDetail 영역 입장 애니메이션
// ---------------------------------------------
const projectDetail = document.querySelector(
  ".interactive-project .projectDetail"
);
const projectWrap = projectDetail.querySelector(".projectWrap");
const projectDetail_title = projectDetail.querySelector(".titleWrap");

const enterTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".interactive-project .projectDetail",
    start: "20% 70%",
    end: "90% 50%",
    scrub: 3,
    // markers: true,
  },
});

enterTl
  .fromTo(
    projectWrap,
    { y: 150, rotationX: 10, opacity: 0, transformOrigin: "top center" },
    {
      y: 0,
      rotationX: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power3.out",
    },
    0
  )
  .fromTo(
    projectDetail_title,
    { opacity: 0, x: -100 },
    { opacity: 1, x: 0 },
    0
  );

// ---------------------------------------------
// 3) projectWrap 가로 플로우 + 각 article 타임라인 세팅
// ---------------------------------------------

// 3-1. 각 article마다 들어갈 타임라인 먼저 만들기
const articles = gsap.utils.toArray(
  ".interactive-project .projectDetail .projectWrap article"
);

const articleData = articles.map((article) => {
  const descriptionP = article.querySelector(".description p");
  const skills = article.querySelectorAll(".skills li");
  const shortCut = article.querySelector(".shortCut");
  const mobile = article.querySelector(".mobile");
  const articleTl = gsap.timeline({ paused: true });

  articleTl
    .fromTo(
      descriptionP,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      }
    )
    .to(
      mobile,
      {
        opacity: 1,
        x: 430,
        y: -32,
        rotation: 15,
      },
      "-=0.5"
    )
    .to(mobile, {
      rotate: 10,
      y: -28,
      yoyo: true,
      repeat: 3,
      ease: "power3.Out",
      duration: 0.1,
    })
    .from(
      skills,
      {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: "power3.out",
        stagger: 0.1,
      },
      "-=0.3"
    )
    .from(
      shortCut,
      {
        opacity: 0,
        scale: 0.3,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      },
      "-=0.2"
    );

  return {
    article,
    tl: articleTl,
    active: false, // 현재 활성화 여부
  };
});

// 3-2. 가운데 감지 함수(가로 기준)
function updateArticleCenterStates() {
  const viewportCenterX = window.innerWidth / 2;
  const threshold = 800; // 이 값 안쪽이면 "중앙에 있다"고 판단 (조절 가능)

  articleData.forEach((obj) => {
    const rect = obj.article.getBoundingClientRect();
    const articleCenterX = rect.left + rect.width / 2;
    const isCenter = Math.abs(articleCenterX - viewportCenterX) < threshold;

    if (isCenter && !obj.active) {
      obj.tl.play();
      obj.active = true;
    } else if (!isCenter && obj.active) {
      obj.tl.reverse();
      obj.active = false;
    }
  });
}

// 3-3. projectWrap 가로 플로우 + pinTl 생성
const pinTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".interactive-project .projectDetail",
    start: "40% 50%",
    end: "+=3500",
    pin: true,
    scrub: 1,
    // markers: true,
    onUpdate: updateArticleCenterStates, // 스크롤될 때마다 중앙 감지
  },
});

// projectWrap을 왼쪽으로 쭉 이동
pinTl.fromTo(projectWrap, { x: 200 }, { x: -4000 });

// 리사이즈 시에도 한번 업데이트해서 중앙 감지 값 보정
window.addEventListener("resize", updateArticleCenterStates);

// 타이틀 요소들
const subTitleText = document.querySelector(
  "#works .sectionTitle .subTitle span"
);
const worksTitle = document.querySelector("#works .sectionTitle");

// 현재 텍스트 저장 (중복 실행 방지)
let currentTitle = "";

// subTitle 변경 함수
function changeSubTitle(text) {
  if (currentTitle === text) return;
  currentTitle = text;

  gsap.killTweensOf(subTitleText);

  gsap.to(subTitleText, {
    opacity: 0,
    x: -200,
    duration: 0.2,
    onComplete: () => {
      subTitleText.textContent = text;
      gsap.to(subTitleText, {
        opacity: 1,
        x: 0,
        duration: 0.25,
        ease: "power2.out",
      });
    },
  });
}

// works 안의 각 섹션 감지
document.querySelectorAll("#works section[data-title]").forEach((section) => {
  const title = section.dataset.title;

  ScrollTrigger.create({
    trigger: section,
    start: "top center",

    onEnter: () => {
      // ✅ 서브타이틀 변경
      changeSubTitle(title);

      // ✅ 특정 섹션에서 스타일 변경
      if (section.classList.contains("team-project")) {
        worksTitle.classList.add("is-team");
      } else {
        worksTitle.classList.remove("is-team");
      }
    },

    onLeaveBack: () => {
      const prev = section.previousElementSibling;

      // 이전 섹션 타이틀로 복구
      if (prev && prev.dataset.title) {
        changeSubTitle(prev.dataset.title);

        if (prev.classList.contains("team-project")) {
          worksTitle.classList.add("is-team");
        } else {
          worksTitle.classList.remove("is-team");
        }
      } else {
        changeSubTitle("");
        worksTitle.classList.remove("is-team");
      }
    },
  });
});

const webSection = document.querySelector(".web-publishing");
const stage = webSection.querySelector(".inner");
const pages = gsap.utils.toArray(".web-publishing .page");

const OFFSET_Y = 60; //남길 높이

// 페이지 초기 상태 세팅
gsap.set(pages, {
  rotateX: -75,
  transformOrigin: "center bottom",
  opacity: 0,
  y: 0,
});
const gearTl = gsap.timeline({
  scrollTrigger: {
    trigger: webSection,
    start: "top top",
    end: "+=400%",
    scrub: 3,
    pin: stage,
    anticipatePin: 1,
  },
});

pages.forEach((page, i) => {
  // 1) 현재 페이지가 고개 들고 올라오기
  gearTl.to(page, {
    rotateX: 0,
    opacity: 1,
    zIndex: 60 + i, // 뒤에 있는 페이지보다 항상 위에 오게
    duration: 0.6,
    ease: "power2.out",
  });

  // 2) 지금까지 지나온 페이지들 위치를 "파일철"처럼 누적 이동
  gearTl.to(
    pages,
    {
      y: (index) => {
        // i번째까지의 페이지는 위로 누적해서 올리기
        if (index <= i) {
          // i - index 만큼 60px씩 차이 나게
          return -(i - index) * OFFSET_Y;
        }
        // 아직 등장 전인 페이지는 제자리
        return 0;
      },
      duration: 0.6,
      ease: "power2.out",
    },
    "<" // 위 애니메이션과 동시에 시작
  );
});

const bg = document.querySelector(".mobileContent .bg");

let tl_upDown = gsap.timeline({
  repeat: -1,
  default: {
    ease: "bounce",
  },
});
tl_upDown
  .fromTo(
    bg,
    {
      y: -25,
    },
    {
      y: 0,
      duration: 1.5,
    }
  )
  .to(bg, {
    y: -25,
    duration: 1.5,
  });

// ---------------------------------------------------------
// ✅ YOUR PALETTE (여기만 수정)
// ---------------------------------------------------------
const PALETTE_NEON_RGB_DARK = [
  "#FF1B60", // 1
  "#050714", // 2 (base)
  "#00FF88", // 3
  "#050714", // 4 (base)
  "#2E6BFF", // 5
  "#050714", // 6 (base)
];

// ---------------------------------------------------------
// Palette Helper (HEX -> vec3)
// ---------------------------------------------------------
function hexToVec3(hex) {
  const h = hex.replace("#", "").trim();
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return new THREE.Vector3(r, g, b);
}

function applyPaletteToUniforms(uniforms, hex6) {
  uniforms.uColor1.value.copy(hexToVec3(hex6[0]));
  uniforms.uColor2.value.copy(hexToVec3(hex6[1]));
  uniforms.uColor3.value.copy(hexToVec3(hex6[2]));
  uniforms.uColor4.value.copy(hexToVec3(hex6[3]));
  uniforms.uColor5.value.copy(hexToVec3(hex6[4]));
  uniforms.uColor6.value.copy(hexToVec3(hex6[5]));
}

// ---------------------------------------------------------
// TouchTexture class
// ---------------------------------------------------------
class TouchTexture {
  constructor() {
    this.size = 64;
    this.width = this.height = this.size;
    this.maxAge = 64;

    // ✅ 알갱이 크기(터치 점) 줄이기
    this.radius = 0.16 * this.size;

    this.speed = 1 / this.maxAge;
    this.trail = [];
    this.last = null;
    this.initTexture();
  }

  initTexture() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.texture = new THREE.Texture(this.canvas);
  }

  update() {
    this.clear();
    let speed = this.speed;

    for (let i = this.trail.length - 1; i >= 0; i--) {
      const point = this.trail[i];
      let f = point.force * speed * (1 - point.age / this.maxAge);
      point.x += point.vx * f;
      point.y += point.vy * f;
      point.age++;

      if (point.age > this.maxAge) {
        this.trail.splice(i, 1);
      } else {
        this.drawPoint(point);
      }
    }
    this.texture.needsUpdate = true;
  }

  clear() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addTouch(point) {
    let force = 0;
    let vx = 0;
    let vy = 0;
    const last = this.last;

    if (last) {
      const dx = point.x - last.x;
      const dy = point.y - last.y;
      if (dx === 0 && dy === 0) return;
      const dd = dx * dx + dy * dy;
      let d = Math.sqrt(dd);
      vx = dx / d;
      vy = dy / d;

      // ✅ 터치 힘(왜곡 강도)
      force = Math.min(dd * 16000, 1.8);
    }

    this.last = { x: point.x, y: point.y };
    this.trail.push({ x: point.x, y: point.y, age: 0, force, vx, vy });
  }

  drawPoint(point) {
    const pos = {
      x: point.x * this.width,
      y: (1 - point.y) * this.height,
    };

    let intensity = 1;
    if (point.age < this.maxAge * 0.3) {
      intensity = Math.sin((point.age / (this.maxAge * 0.3)) * (Math.PI / 2));
    } else {
      const t = 1 - (point.age - this.maxAge * 0.3) / (this.maxAge * 0.7);
      intensity = -t * (t - 2);
    }
    intensity *= point.force;

    const radius = this.radius;
    let color = `${((point.vx + 1) / 2) * 255}, ${
      ((point.vy + 1) / 2) * 255
    }, ${intensity * 255}`;

    let offset = this.size * 5;
    this.ctx.shadowOffsetX = offset;
    this.ctx.shadowOffsetY = offset;
    this.ctx.shadowBlur = radius * 1;
    this.ctx.shadowColor = `rgba(${color},${0.2 * intensity})`;

    this.ctx.beginPath();
    this.ctx.fillStyle = "rgba(255,0,0,1)";
    this.ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

// ---------------------------------------------------------
// GradientBackground class
// ---------------------------------------------------------
class GradientBackground {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.mesh = null;

    this.uniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },

      uColor1: { value: new THREE.Vector3(1, 0, 0) },
      uColor2: { value: new THREE.Vector3(0, 0, 0) },
      uColor3: { value: new THREE.Vector3(1, 0, 0) },
      uColor4: { value: new THREE.Vector3(0, 0, 0) },
      uColor5: { value: new THREE.Vector3(1, 0, 0) },
      uColor6: { value: new THREE.Vector3(0, 0, 0) },

      uSpeed: { value: 1.2 },
      uIntensity: { value: 1.1 },

      uTouchTexture: { value: null },

      uGrainIntensity: { value: 0.06 },

      uZoom: { value: 1.0 },
      uDarkNavy: { value: new THREE.Vector3(0.02, 0.02, 0.06) },

      uGradientSize: { value: 0.45 },
      uGradientCount: { value: 12.0 },
      uColor1Weight: { value: 0.55 },
      uColor2Weight: { value: 1.8 },
    };
  }

  init() {
    const viewSize = this.sceneManager.getViewSize();
    const geometry = new THREE.PlaneGeometry(
      viewSize.width,
      viewSize.height,
      1,
      1
    );

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.);
          vUv = uv;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        uniform vec3 uColor5;
        uniform vec3 uColor6;
        uniform float uSpeed;
        uniform float uIntensity;
        uniform sampler2D uTouchTexture;
        uniform float uGrainIntensity;
        uniform vec3 uDarkNavy;
        uniform float uGradientSize;
        uniform float uGradientCount;
        uniform float uColor1Weight;
        uniform float uColor2Weight;

        varying vec2 vUv;

        float grain(vec2 uv, float time) {
          vec2 grainUv = uv * uResolution * 0.9; // ✅ 촘촘하게(알갱이 작게)
          float g = fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453);
          return g * 2.0 - 1.0;
        }

        vec3 getGradientColor(vec2 uv, float time) {
          float r = uGradientSize;

          vec2 c1 = vec2(0.5 + sin(time * uSpeed * 0.4) * 0.4, 0.5 + cos(time * uSpeed * 0.5) * 0.4);
          vec2 c2 = vec2(0.5 + cos(time * uSpeed * 0.6) * 0.5, 0.5 + sin(time * uSpeed * 0.45) * 0.5);
          vec2 c3 = vec2(0.5 + sin(time * uSpeed * 0.35) * 0.45, 0.5 + cos(time * uSpeed * 0.55) * 0.45);
          vec2 c4 = vec2(0.5 + cos(time * uSpeed * 0.5) * 0.4, 0.5 + sin(time * uSpeed * 0.4) * 0.4);
          vec2 c5 = vec2(0.5 + sin(time * uSpeed * 0.7) * 0.35, 0.5 + cos(time * uSpeed * 0.6) * 0.35);
          vec2 c6 = vec2(0.5 + cos(time * uSpeed * 0.45) * 0.5, 0.5 + sin(time * uSpeed * 0.65) * 0.5);

          vec2 c7 = vec2(0.5 + sin(time * uSpeed * 0.55) * 0.38, 0.5 + cos(time * uSpeed * 0.48) * 0.42);
          vec2 c8 = vec2(0.5 + cos(time * uSpeed * 0.65) * 0.36, 0.5 + sin(time * uSpeed * 0.52) * 0.44);
          vec2 c9 = vec2(0.5 + sin(time * uSpeed * 0.42) * 0.41, 0.5 + cos(time * uSpeed * 0.58) * 0.39);
          vec2 c10 = vec2(0.5 + cos(time * uSpeed * 0.48) * 0.37, 0.5 + sin(time * uSpeed * 0.62) * 0.43);
          vec2 c11 = vec2(0.5 + sin(time * uSpeed * 0.68) * 0.33, 0.5 + cos(time * uSpeed * 0.44) * 0.46);
          vec2 c12 = vec2(0.5 + cos(time * uSpeed * 0.38) * 0.39, 0.5 + sin(time * uSpeed * 0.56) * 0.41);

          float i1 = 1.0 - smoothstep(0.0, r, length(uv - c1));
          float i2 = 1.0 - smoothstep(0.0, r, length(uv - c2));
          float i3 = 1.0 - smoothstep(0.0, r, length(uv - c3));
          float i4 = 1.0 - smoothstep(0.0, r, length(uv - c4));
          float i5 = 1.0 - smoothstep(0.0, r, length(uv - c5));
          float i6 = 1.0 - smoothstep(0.0, r, length(uv - c6));
          float i7 = 1.0 - smoothstep(0.0, r, length(uv - c7));
          float i8 = 1.0 - smoothstep(0.0, r, length(uv - c8));
          float i9 = 1.0 - smoothstep(0.0, r, length(uv - c9));
          float i10 = 1.0 - smoothstep(0.0, r, length(uv - c10));
          float i11 = 1.0 - smoothstep(0.0, r, length(uv - c11));
          float i12 = 1.0 - smoothstep(0.0, r, length(uv - c12));

          vec3 col = vec3(0.0);

          col += uColor1 * i1 * (0.55 + 0.45 * sin(time * uSpeed)) * uColor1Weight;
          col += uColor2 * i2 * (0.55 + 0.45 * cos(time * uSpeed * 1.2)) * uColor2Weight;
          col += uColor3 * i3 * (0.55 + 0.45 * sin(time * uSpeed * 0.8)) * uColor1Weight;
          col += uColor4 * i4 * (0.55 + 0.45 * cos(time * uSpeed * 1.3)) * uColor2Weight;
          col += uColor5 * i5 * (0.55 + 0.45 * sin(time * uSpeed * 1.1)) * uColor1Weight;
          col += uColor6 * i6 * (0.55 + 0.45 * cos(time * uSpeed * 0.9)) * uColor2Weight;

          if (uGradientCount > 6.0) {
            col += uColor1 * i7 * (0.55 + 0.45 * sin(time * uSpeed * 1.4)) * uColor1Weight;
            col += uColor2 * i8 * (0.55 + 0.45 * cos(time * uSpeed * 1.5)) * uColor2Weight;
            col += uColor3 * i9 * (0.55 + 0.45 * sin(time * uSpeed * 1.6)) * uColor1Weight;
            col += uColor4 * i10 * (0.55 + 0.45 * cos(time * uSpeed * 1.7)) * uColor2Weight;
          }
          if (uGradientCount > 10.0) {
            col += uColor5 * i11 * (0.55 + 0.45 * sin(time * uSpeed * 1.8)) * uColor1Weight;
            col += uColor6 * i12 * (0.55 + 0.45 * cos(time * uSpeed * 1.9)) * uColor2Weight;
          }

          col = clamp(col, vec3(0.0), vec3(1.0)) * uIntensity;

          float lum = dot(col, vec3(0.299, 0.587, 0.114));
          col = mix(vec3(lum), col, 1.25);

          float br = length(col);
          float mixF = max(br * 1.15, 0.12);
          col = mix(uDarkNavy, col, mixF);

          // ✅ 눈부심 방지 밝기 캡
          float maxB = 0.95;
          float b = length(col);
          if (b > maxB) col = col * (maxB / b);

          return col;
        }

        void main() {
          vec2 uv = vUv;

          vec4 t = texture2D(uTouchTexture, uv);
          float vx = -(t.r * 2.0 - 1.0);
          float vy = -(t.g * 2.0 - 1.0);
          float inten = t.b;

          uv.x += vx * 0.75 * inten;
          uv.y += vy * 0.75 * inten;

          vec2 center = vec2(0.5);
          float dist = length(uv - center);
          float ripple = sin(dist * 20.0 - uTime * 3.0) * 0.04 * inten;
          float wave = sin(dist * 15.0 - uTime * 2.0) * 0.03 * inten;
          uv += vec2(ripple + wave);

          vec3 col = getGradientColor(uv, uTime);

          float g = grain(uv, uTime);
          col += g * uGrainIntensity;

          float ts = uTime * 0.5;
          col.r += sin(ts) * 0.015;
          col.g += cos(ts * 1.4) * 0.015;
          col.b += sin(ts * 1.2) * 0.015;

          col = clamp(col, vec3(0.0), vec3(1.0));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.z = 0;
    this.sceneManager.scene.add(this.mesh);
  }

  update(delta) {
    this.uniforms.uTime.value += delta;
  }

  onResize(width, height) {
    const viewSize = this.sceneManager.getViewSize();
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.geometry = new THREE.PlaneGeometry(
        viewSize.width,
        viewSize.height,
        1,
        1
      );
    }
    this.uniforms.uResolution.value.set(width, height);
  }
}

// ---------------------------------------------------------
// App class
// ---------------------------------------------------------
class App {
  constructor() {
    // ✅ 화면에 캔버스가 100% 보이게(간단한 안전장치)
    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.width = "100%";

    document.body.style.background = "#050714";

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
      stencil: false,
      depth: false,
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.id = "webGLApp";
    this.renderer.domElement.style.display = "block";

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.z = 50;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050714);

    this.clock = new THREE.Clock();

    this.touchTexture = new TouchTexture();
    this.gradientBackground = new GradientBackground(this);
    this.gradientBackground.uniforms.uTouchTexture.value =
      this.touchTexture.texture;

    this.gradientBackground.init();

    // ✅ 여기서는 팔레트 적용 X (전역 app 아직 없음)
    this.render();
    this.tick();

    window.addEventListener("resize", () => this.onResize());
    window.addEventListener("mousemove", (ev) => this.onMouseMove(ev));
    window.addEventListener("touchmove", (ev) => this.onTouchMove(ev), {
      passive: true,
    });
  }

  onTouchMove(ev) {
    const touch = ev.touches[0];
    if (!touch) return;
    this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
  }

  onMouseMove(ev) {
    this.mouse = {
      x: ev.clientX / window.innerWidth,
      y: 1 - ev.clientY / window.innerHeight,
    };
    this.touchTexture.addTouch(this.mouse);
  }

  getViewSize() {
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = Math.abs(this.camera.position.z * Math.tan(fov / 2) * 2);
    return { width: height * this.camera.aspect, height };
  }

  update(delta) {
    this.touchTexture.update();
    this.gradientBackground.update(delta);
  }

  render() {
    const delta = Math.min(this.clock.getDelta(), 0.1);
    this.renderer.render(this.scene, this.camera);
    this.update(delta);
  }

  tick() {
    this.render();
    requestAnimationFrame(() => this.tick());
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.gradientBackground.onResize(window.innerWidth, window.innerHeight);
  }

  // ✅ 외부에서 팔레트 적용할 수 있게 메서드 제공
  applyPalette(hex6) {
    applyPaletteToUniforms(this.gradientBackground.uniforms, hex6);
    // 베이스 컬러도 필요하면 같이:
    // this.gradientBackground.uniforms.uDarkNavy.value.copy(hexToVec3(hex6[1]));
    this.render();
  }
}

// ---------------------------------------------------------
// Start (✅ app 만든 다음에 팔레트 적용)
// ---------------------------------------------------------
const app = new App();
app.applyPalette(PALETTE_NEON_RGB_DARK);

// ---------------------------------------------------------
// (선택) .color-btn이 HTML에 있다면 눌러도 팔레트 유지
// ---------------------------------------------------------
const colorButtons = document.querySelectorAll(".color-btn");
if (colorButtons.length) {
  colorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      app.applyPalette(PALETTE_NEON_RGB_DARK);
      colorButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}
