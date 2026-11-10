gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);

// -----------------------------------
// header
// -----------------------------------

const gnb = document.querySelector("header .gnb");
const gnb_li = gnb.querySelectorAll("li a");
const nav_contact = document.querySelector("nav .contact");
gnb_li.forEach((list) => {
  list.addEventListener("mouseenter", () => {
    gsap.to(list, {
      y: -20,
      "border-width": "50px",
      ease: "expo.out",
    });
  });
  list.addEventListener("mouseleave", () => {
    gsap.to(list, {
      y: 0,
    });
  });
});
nav_contact.addEventListener("mouseenter", () => {
  gsap.to(nav_contact, {
    "border-radius": "20px",
    "background-image": "linear-gradient(-135deg, #9a35b3, #db2777)",
  });
});
nav_contact.addEventListener("mouseleave", () => {
  gsap.to(nav_contact, {
    "border-radius": "5px",
    "background-image": "linear-gradient(135deg, #9a35b3, #db2777)",
  });
});

gsap.registerPlugin(ScrollTrigger, TextPlugin);

// -----------------------------------
// intro
// -----------------------------------
const INTRO_END = "+=800%";
const viewports = document.querySelectorAll(
  "#hero .intro .pieces .pieceWrap .viewport",
);
const pieces = document.querySelectorAll("#hero .intro .pieces .pieceWrap");
const content = document.querySelector("#hero .intro .roll .right .content");

const about = document.querySelector("#hero .about");
const profile_pic = about.querySelector(".bg .pic");
const aboutBg_left = about.querySelector(".bg .left");
const aboutBg_right = about.querySelector(".bg .right");

/* profile */
const about_profile = about.querySelector(".contentWrap .inner .profile");
const about_profile_title = about_profile.querySelector(".title");
const about_profile_contents = about_profile.querySelectorAll(".content > div");

/* education */
const about_edu = about.querySelector(".contentWrap .inner .education");
const about_edu_title = about_edu.querySelector(".title");
const about_edu_contents = about_edu.querySelectorAll(".content li");

/* introduce */
const about_introduce = about.querySelector(".contentWrap .inner .introduce");

/* skills */
const about_skills = about.querySelector(".contentWrap .inner .skills");
const about_skills_title = about_skills.querySelector(".title");
const about_skills_content = about_skills.querySelectorAll(".content li");

/* license */
const about_license = about.querySelector(".contentWrap .inner .license");
const about_license_title = about_license.querySelector(".title");
const about_license_content = about_license.querySelectorAll(".content li");

/* experience */
const about_exp = about.querySelector(".contentWrap .inner .exp");
const about_exp_title = about_exp.querySelector(".title");
const about_exp_content = about_exp.querySelectorAll(".content li");

/* icons */
const about_icons = about.querySelector(".contentWrap .inner .icons");
const about_icons_li = about_icons.querySelectorAll("li");
const iconPositions = [
  { x: -270, y: -140 },
  { x: -430, y: -260 },
  { x: -540, y: -100 },
  { x: -380, y: 30 },
  { x: -510, y: 80 },
  { x: -450, y: 180 },
  { x: -240, y: 130 },
  { x: -310, y: 210 },
  { x: -130, y: 10 },
  { x: -90, y: -200 },
];

function getResponsiveIconPosition(i) {
  const width = about_icons.clientWidth;
  const height = about_icons.clientHeight;
  const icon = about_icons_li[i];

  const iconW = icon.offsetWidth;
  const iconH = icon.offsetHeight;

  // 가장자리 여유 공간 (부유 애니메이션 포함)
  const maxX = Math.max(0, width / 2 - iconW / 2 - 35);
  const maxY = Math.max(0, height / 2 - iconH / 2 - 45);

  const clamp = gsap.utils.clamp;

  // PC: 기존 좌표 유지
  if (window.innerWidth >= 1200) {
    return iconPositions[i];
  }

  // 태블릿: 기존 배치 비율 축소
  if (window.innerWidth >= 770) {
    const scaleX = Math.min(1, width / 1300);
    const scaleY = Math.min(1, height / 400);

    return {
      x: clamp(-maxX, maxX, iconPositions[i].x * scaleX),
      y: clamp(-maxY, maxY, iconPositions[i].y * scaleY),
    };
  }

  // 모바일: 3열 분산 배치
  const columns = 3;
  const rows = Math.ceil(about_icons_li.length / columns);

  const row = Math.floor(i / columns);
  const col = i % columns;
  const countInRow = Math.min(columns, about_icons_li.length - row * columns);

  const gapX = Math.min(180, Math.max(0, (width - iconW - 70) / (columns - 1)));

  const gapY = Math.min(110, Math.max(0, (height - iconH - 90) / (rows - 1)));

  return {
    x: (col - (countInRow - 1) / 2) * gapX,
    y: (row - (rows - 1) / 2) * gapY,
  };
}

/* flowText */
const about_flowText = about.querySelector(" .flowText");
// -----------------------------------
// intro floating
// -----------------------------------
gsap.set(viewports, { xPercent: -50, yPercent: -50 });

let floatTweens = [];
const RANGE_X = 200;
const RANGE_Y = 120;

function startIntroFloating() {
  floatTweens.forEach((t) => t.kill());
  floatTweens = [];

  viewports.forEach((vp) => {
    const rx = gsap.utils.random(RANGE_X * 0.6, RANGE_X, 1);
    const ry = gsap.utils.random(RANGE_Y * 0.6, RANGE_Y, 1);

    floatTweens.push(
      gsap.to(vp, {
        x: () => gsap.utils.random(-rx, rx),
        y: () => gsap.utils.random(-ry, ry),
        rotation: () => gsap.utils.random(-20, 20),
        duration: gsap.utils.random(3, 5),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        overwrite: "auto",
      }),
    );
  });
}

function stopFloatingAndSnapToZero() {
  floatTweens.forEach((t) => t.kill());
  floatTweens = [];

  gsap.to(viewports, {
    x: 0,
    y: 0,
    rotation: 0,
    duration: 0.25,
    ease: "power2.out",
    overwrite: "auto",
  });
}

startIntroFloating();

// -----------------------------------
// intro rolling text
// -----------------------------------
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

  gsap.to(items, {
    y: -10,
    opacity: 0.85,
    duration: 0.45,
    ease: "power3.inOut",
    stagger: 0.02,
    onComplete: () => {
      content.appendChild(items[0]);

      const newItems = Array.from(content.children);
      gsap.set(newItems, { y: 10, opacity: 0.85 });

      applyState();

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
// intro piece positions
// -----------------------------------
const positions = [
  { x: -600, y: -350 },
  { x: 520, y: -300 },
  { x: -330, y: -150 },
  { x: 300, y: 0 },
  { x: -300, y: 100 },
  { x: 500, y: 200 },
  { x: -50, y: 230 },
  { x: -510, y: 300 },
];

pieces.forEach((p, i) => gsap.set(p, positions[i]));

const gatherPositions = [
  { x: -200, y: -200 },
  { x: 0, y: -202 },
  { x: 25, y: -95 },
  { x: 20, y: -62 },
  { x: 22, y: 40 },
  { x: 17, y: 110 },
  { x: -214, y: 225 },
  { x: -278, y: 197 },
];

// -----------------------------------
// main timeline
// -----------------------------------
// Intro 로고
gsap.set("#hero .intro .intro_logo", {
  left: "45%",
  top: "50%",
  xPercent: -50,
  yPercent: -50,
  scale: 0.73,
});

// 로고 내부 이미지 4개
gsap.set("#hero .intro .intro_logo > img", {
  left: "50%",
  top: "54%",
  xPercent: -50,
  yPercent: -50,
});

// Shade 기준 위치
gsap.set("#hero .intro .shade", {
  left: "45%",
  top: "54%",
  xPercent: -50,
  yPercent: -50,
  scale: 0.7,
});
gsap.set(profile_pic, {
  left: "50%",
  bottom: 0,
  xPercent: -50,
  y: 0,
  opacity: 0,
});
const introPieceSvgs = gsap.utils.toArray("#hero .intro .pieces .viewport svg");

gsap.set(introPieceSvgs, {
  scale: 0.015,
  transformOrigin: "50% 50%",
});
const STOP_PX = 10;
let floatingActive = true;
// 모바일 J 전체 크기 조절
const introPiecesGroup = document.querySelector("#hero .intro .pieces");

function updateMobileJScale() {
  const width = window.innerWidth;

  const scale = gsap.utils.clamp(0.35, 0.75, width / 950);

  introPiecesGroup.style.setProperty("--mobile-j-scale", scale);
}

updateMobileJScale();

window.addEventListener("resize", updateMobileJScale);
const gatherTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "+=14000",
    scrub: 1,
    pin: true,
    // markers: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const y = self.scroll();
      const startY = self.start;

      if (y <= startY + STOP_PX) {
        if (!floatingActive) {
          startIntroFloating();
          floatingActive = true;
        }
      } else {
        if (floatingActive) {
          stopFloatingAndSnapToZero();
          floatingActive = false;
        }
      }
    },
    onRefresh: (self) => {
      const y = self.scroll();
      const startY = self.start;

      if (y <= startY + STOP_PX) {
        if (!floatingActive) {
          startIntroFloating();
          floatingActive = true;
        }
      } else {
        if (floatingActive) {
          stopFloatingAndSnapToZero();
          floatingActive = false;
        }
      }
    },
  },
});

// -----------------------------------
// custom nav scroll (for pinned sections)
// -----------------------------------
const navLinks = document.querySelectorAll("[data-nav]");

function smoothScrollTo(y) {
  window.scrollTo({
    top: y,
    behavior: "smooth",
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const type = link.dataset.nav;
    const heroST = gatherTl.scrollTrigger;

    if (!heroST) return;

    switch (type) {
      case "intro": {
        smoothScrollTo(heroST.start);
        break;
      }

      case "about": {
        const aboutProgress = 0.9;
        const targetY =
          heroST.start + (heroST.end - heroST.start) * aboutProgress;

        smoothScrollTo(targetY);
        break;
      }

      case "works": {
        const works = document.querySelector("#works");
        if (!works) return;

        const y = works.getBoundingClientRect().top + window.pageYOffset + 400;
        smoothScrollTo(y);
        break;
      }

      case "contact": {
        const contact = document.querySelector("#contact");
        if (!contact) return;

        const y = contact.getBoundingClientRect().top + window.pageYOffset;
        smoothScrollTo(y);
        break;
      }
    }
  });
});

// -----------------------------------
// timeline animation
// -----------------------------------
gsap.set("#hero .intro .intro_logo > img", {
  xPercent: -50,
  yPercent: -50,
});
gatherTl
  .to(introPieceSvgs, {
    scale: 1,
    duration: 1.5,
    ease: "none",
  })
  .to(
    pieces,
    {
      x: (i) => gatherPositions[i].x,
      y: (i) => gatherPositions[i].y,
      rotation: 0,
      duration: 1.5,
      ease: "power3.out",
      stagger: { each: 0.06, from: "center" },
    },
    0,
  )
  .to(pieces, { opacity: 0 })
  .fromTo(
    "#hero .intro .intro_logo > img:nth-of-type(4)",
    { xPercent: -50, yPercent: -50 },
    { opacity: 1, xPercent: -50, yPercent: -50 },
    ">-0.5",
  )
  .to("#hero .intro .intro_logo > img", {
    x: 75,
    xPercent: -50,
    yPercent: -50,
    scale: 0.7,
  })
  .to("#hero .intro .intro_logo > img:nth-of-type(1)", { opacity: 1 }, ">")
  .to("#hero .intro .intro_logo > img:nth-of-type(2)", { opacity: 1 }, ">")
  .to("#hero .intro .intro_logo > img:nth-of-type(3)", { opacity: 1 }, ">")
  .to("#hero .intro .shade", { opacity: 0.8, x: 60, scale: 0.6 }, ">")
  .fromTo("#hero .intro .sectionTitle", { opacity: 0 }, { opacity: 1 })
  .fromTo(
    "#hero .intro .roll",
    { opacity: 0, width: 0 },
    {
      opacity: 1,
      width: () =>
        window.innerWidth >= 1200
          ? "80%"
          : window.innerWidth >= 770
            ? "98%"
            : "98%",
    },
  )
  .fromTo(gnb_li, { opacity: 0, y: 50 }, { opacity: 1, y: 0, stagger: 0.1 })
  .fromTo(nav_contact, { opacity: 0 }, { opacity: 1 })
  .fromTo("#hero .intro .roll > div > div", { opacity: 0 }, { opacity: 1 })
  .fromTo(
    "#hero .intro .line",
    { width: 0 },
    { width: "clamp(140px,20vw,500px)" },
  )
  .to({}, { duration: 5 }, ">")
  .to("#hero .intro .sectionTitle", { opacity: 0, y: -50 }, ">")
  .to("#hero .intro .roll", { opacity: 0, y: -50 })
  .fromTo(aboutBg_left, { opacity: 1, x: -1000 }, { x: 30, opacity: 1 })
  .fromTo(aboutBg_right, { opacity: 1, x: 1000 }, { x: -240 }, "<")
  .to("#hero .intro_logo", { yPercent: -10, opacity: 0 })
  .to("#hero .intro", { opacity: 0 })
  .fromTo(
    "#hero .about .sectionTitle",
    { opacity: 0, x: -400 },
    { opacity: 1, x: 20 },
  )
  .to({}, { duration: 3 }, ">")
  .to(aboutBg_left, { x: -200 })
  .to(aboutBg_right, { x: 100 }, "<")
  .fromTo(profile_pic, { opacity: 0, x: 300 }, { opacity: 1, x: 0 })

  // -----------------------------------
  // about
  // -----------------------------------
  .fromTo(about_profile_title, { x: -200, opacity: 0 }, { x: 0, opacity: 1 })
  .fromTo(
    about_profile_contents,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: { each: 0.15, from: "start", ease: "power2.out" },
    },
  )
  .fromTo(about_edu_title, { x: -200, opacity: 0 }, { x: 0, opacity: 1 })
  .fromTo(
    about_edu_contents,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: { each: 0.15, from: "start", ease: "power2.out" },
    },
  )
  .fromTo(about_introduce, { opacity: 0 }, { opacity: 1 })
  .fromTo(about_flowText, { opacity: 0, y: 100 }, { opacity: 1, y: 0 })
  .to({}, { duration: 5 })
  .to(about_edu, { opacity: 0, y: -50 })
  .to(about_profile, { opacity: 0, y: -50 }, "<")
  .to(about_introduce, { opacity: 0, y: -50 }, "<")
  .to(profile_pic, { opacity: 0, x: 250 })
  .to(aboutBg_left, { x: 30 })
  .to(aboutBg_right, { x: -240 }, "<")
  .to({}, { duration: 3 })
  .to(aboutBg_left, { x: -330 })

  .fromTo(
    about_icons_li,
    {
      opacity: 0,
      x: 0,
      y: 0,
      scale: 0.5,
    },
    {
      opacity: 1,
      scale: 1,

      x: (i) => getResponsiveIconPosition(i).x,
      y: (i) => getResponsiveIconPosition(i).y,

      duration: 1.2,
      ease: "power3.out",

      stagger: {
        each: 0.08,
        from: "center",
      },

      onComplete: () => {
        gsap.delayedCall(0.3, () => {
          floatingIcons(about_icons_li);
        });
      },
    },
  )

  .fromTo(about_skills_title, { x: -200, opacity: 0 }, { x: 0, opacity: 1 })
  .fromTo(
    about_skills_content,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: { each: 0.15, from: "start", ease: "power2.out" },
    },
  )
  .fromTo(about_license_title, { x: -200, opacity: 0 }, { x: 0, opacity: 1 })
  .fromTo(
    about_license_content,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: { each: 0.15, from: "start", ease: "power2.out" },
    },
  )
  .fromTo(about_exp_title, { x: -200, opacity: 0 }, { x: 0, opacity: 1 }, "<")
  .fromTo(
    about_exp_content,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      stagger: { each: 0.15, from: "start", ease: "power2.out" },
    },
  )
  .to({}, { duration: 3 });

function floatingIcons(targets) {
  targets.forEach((li, i) => {
    const img = li.querySelector("img");

    if (!img || img.dataset.floating === "true") return;
    img.dataset.floating = "true";

    const mobile = window.innerWidth <= 769;

    gsap.to(img, {
      x: gsap.utils.random(mobile ? -8 : -18, mobile ? 8 : 18),
      y: gsap.utils.random(mobile ? -12 : -30, mobile ? 12 : 30),
      rotation: gsap.utils.random(-10, 10),
      duration: gsap.utils.random(2.2, 4.2),
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: i * 0.08,
    });
  });
}

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
  "#works .projectOverview .lists li .itemInner",
);
const linkSvg = document.querySelector("#works .projectOverview .link-svg");
const linkLine = linkSvg.querySelector(".link-line");
// path 초기 세팅
const flows = document.querySelectorAll(
  ".brand-commerce .bg .flow1, .brand-commerce .bg .flow2, .brand-commerce .bg .flow3",
);

flows.forEach((flow) => {
  flow.innerHTML += flow.innerHTML;
});

gsap.set(guide, {
  opacity: 0,
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
gsap.fromTo(
  "#works .text h3",
  {
    opacity: 0,
  },
  {
    opacity: 1,
    scrollTrigger: {
      trigger: ".projectOverview",
      // markers: true,
      start: "30%",
      scrub: 1,
    },
  },
);
gsap.fromTo(
  "#works .overviewBg",
  {
    opacity: 0,
  },
  {
    opacity: 1,
    scrollTrigger: {
      trigger: ".projectOverview",
      start: "40%",
      scrub: 1,
    },
  },
);

// projectOverview

const overviewScale = () =>
  Math.max(
    0.1,
    Math.min(1, projects.clientWidth / 1700, projects.clientHeight / 850),
  );

// 요소, x좌표, y좌표, 회전각도, 등장시점
const overviewItems = [
  [numList, -600, -250, -30, 0.6],
  [rect1, 0, -240, 0, 1.1],
  [weatherList, 600, -250, 35, 0.8],
  [rect2, 500, -80, 0, 1.3],
  [dreamList, 600, 280, 26, 1.0],
  [rect3, 0, 250, 0, 1.5],
  [todoList, -580, 300, 26, 1.2],
  [rect4, -500, -40, 0, 1.7],
];

// 중앙 정렬 초기값
gsap.set(
  overviewItems.map(([el]) => el),
  {
    left: "50%",
    top: "50%",
    xPercent: -50,
    yPercent: -50,
  },
);

let overviewFloatingStarted = false;

const overviewTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".projectOverview",
    start: "25% 25%",
    end: "+=3700",
    scrub: 1,
    pin: true,
    invalidateOnRefresh: true,
    onUpdate: updateLinkLine,
  },
});

overviewTl
  .fromTo(
    "#works > .sectionTitle",
    { opacity: 0, x: -200 },
    { x: 20, opacity: 1 },
  )
  .fromTo(
    "#works .flowText",
    { y: () => 400 * overviewScale() },
    {
      y: () => 370 * overviewScale(),
      width: () => `${Math.min(850, projects.clientWidth * 0.9)}px`,
    },
  )
  .fromTo(guide, { opacity: 0 }, { strokeDashoffset: 0, opacity: 1 }, 0.2);

// 카드들의 위치·크기를 반응형으로 제어
overviewItems.forEach(([el, x, y, rotation, at]) => {
  overviewTl.fromTo(
    el,
    { opacity: 0 },
    {
      opacity: 1,
      x: () => x * overviewScale(),
      y: () => y * overviewScale(),
      rotation,
      scale: overviewScale,
    },
    at,
  );
});

// 떠다니는 애니메이션 중복 실행 방지
overviewTl.add(() => {
  if (overviewFloatingStarted) return;
  overviewFloatingStarted = true;
  startFloating();
}, 0);

// ---------------------------------------------
// 2) projectDetail 영역 입장 애니메이션
// ---------------------------------------------
const projectDetail = document.querySelector(
  ".interactive-project .projectDetail",
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
    0,
  )
  .fromTo(
    projectDetail_title,
    { opacity: 0, x: -100 },
    { opacity: 1, x: 0 },
    0,
  );

// ---------------------------------------------
// 3) projectWrap 가로 플로우 + 각 article 타임라인 세팅
// ---------------------------------------------

// 3-1. 각 article마다 들어갈 타임라인 먼저 만들기
const articles = gsap.utils.toArray(
  ".interactive-project .projectDetail .projectWrap article",
);

const articleData = articles.map((article) => {
  const descriptionP = article.querySelector(".description p");
  const skills = article.querySelectorAll(".skills li");
  const shortCut = article.querySelector(".shortCut");
  const mobile = article.querySelector(".mobile");
  const articleTl = gsap.timeline({ paused: true });
  gsap.set(mobile, {
    right: "100px",
    top: "-10px",
  });
  gsap.set(shortCut, {
    left: "50%",
    bottom: "-10",
    xPercent: "-50%",
  });
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
      },
    )
    .to(
      mobile,
      {
        opacity: 1,
        right: -20,
        y: -32,
        rotation: 15,
      },
      "-=0.5",
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
      "-=0.3",
    )
    .from(
      shortCut,
      {
        opacity: 0,
        scale: 0.3,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      },
      "-=0.2",
    );

  return {
    article,
    tl: articleTl,
    active: false,
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

// ---------------------------------------------
// 3-3. projectWrap 가로 플로우 + pinTl
// ---------------------------------------------

// 마지막 article이 화면 중앙에 오기 위한 x 좌표
function getProjectEndX() {
  const lastArticle = articles[articles.length - 1];

  const rect = lastArticle.getBoundingClientRect();

  // 현재 GSAP이 적용한 x 이동값
  const currentX = Number(gsap.getProperty(projectWrap, "x")) || 0;

  // 뷰포트의 가로 중앙
  const viewportCenter = document.documentElement.clientWidth / 2;

  // 마지막 카드의 가로 중앙
  const articleCenter = rect.left + rect.width / 2;

  // 현재 이동값을 고려해 목표 x 좌표 계산
  return currentX + viewportCenter - articleCenter;
}

// 가로 스크롤 타임라인
const pinTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".interactive-project .projectDetail",
    start: () =>
      window.innerWidth >= 1200
        ? "top 20%"
        : window.innerWidth >= 770
          ? "10% 25%"
          : "top top",
    end: "+=3500",
    pin: true,
    scrub: 1,
    invalidateOnRefresh: true,
    onUpdate: updateArticleCenterStates,
    // markers: true,
  },
});

// 프로젝트 가로 이동
pinTl.fromTo(
  projectWrap,
  { x: 200 },
  {
    x: getProjectEndX,
    ease: "none",
  },
);

// ---------------------------------------------
// projectOverview 카드 클릭 → 실제 article 중앙 위치로 이동
// ---------------------------------------------

const overviewCards = document.querySelectorAll(
  ".projectOverview .lists li:nth-child(odd)",
);

function findScrollForArticle(index) {
  const st = pinTl.scrollTrigger;
  const article = articles[index];

  if (!st || !article) return null;

  const viewportCenter = window.innerWidth / 2;
  const currentProgress = pinTl.progress();

  let bestProgress = 0;
  let bestDiff = Infinity;

  for (let i = 0; i <= 300; i++) {
    const progress = i / 300;

    pinTl.progress(progress, true);

    const rect = article.getBoundingClientRect();
    const articleCenter = rect.left + rect.width / 2;
    const diff = Math.abs(articleCenter - viewportCenter);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestProgress = progress;
    }
  }

  // 원래 progress로 복구
  pinTl.progress(currentProgress, true);

  return st.start + (st.end - st.start) * bestProgress;
}

overviewCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    ScrollTrigger.refresh();

    const targetScroll = findScrollForArticle(index);
    if (targetScroll === null) return;

    gsap.to(window, {
      scrollTo: targetScroll,
      duration: 1.2,
      ease: "power3.inOut",
    });
  });
});
// 리사이즈 시에도 한번 업데이트해서 중앙 감지 값 보정
window.addEventListener("resize", updateArticleCenterStates);

// ---------------------------------------------
// works 고정 타이틀 + 섹션별 subtitle 변경
// ---------------------------------------------

const worksTitle = document.querySelector("#works > .sectionTitle");
const subTitleText = document.querySelector(
  "#works > .sectionTitle .subTitle span",
);

let currentTitle = "";

function changeSubTitle(text) {
  if (!subTitleText) return;
  if (currentTitle === text) return;

  currentTitle = text;

  gsap.killTweensOf(subTitleText);

  gsap.to(subTitleText, {
    opacity: 0,
    x: -120,
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

// =============================================
// Brand & Commerce - 페이지 넘김 + 이미지 등장
// =============================================

const webSection =
  document.querySelector(".brand-commerce") ||
  document.querySelector(".web-publishing");

const stage = webSection?.querySelector(".inner");

const pages = gsap.utils.toArray(
  ".brand-commerce .page, .web-publishing .page",
);

const OFFSET_Y = 60;

if (webSection && stage && pages.length) {
  // 등장 순서를 유지하기 위한 요소 선택 함수
  const pick = (selectors) =>
    selectors
      .map((selector) => document.querySelector(selector))
      .filter(Boolean);

  // -------------------------------
  // 1. 등장할 이미지 선택
  // -------------------------------

  // P1: 기획서 → 스토리보드 → 상세페이지
  const p1Docs = pick([
    ".brand-commerce .p1 .visual-planning",
    ".brand-commerce .p1 .visual-story",
    ".brand-commerce .p1 .visual-detail",
  ]);

  const p1Product = document.querySelector(
    ".brand-commerce .p1 .visual-product",
  );

  // P2: 사이트 → 노트북 → 모바일
  const p2Visuals = pick([
    ".brand-commerce .p2 .site",
    ".brand-commerce .p2 .lapTop",
    ".brand-commerce .p2 .mobile",
  ]);

  // P3: 메인 사이트 → 모바일 → 태블릿 → 노트북
  const p3Site = document.querySelector(".brand-commerce .p3 .site");

  const p3Devices = pick([
    ".brand-commerce .p3 .mobile",
    ".brand-commerce .p3 .tablet",
    ".brand-commerce .p3 .lapTop",
  ]);

  // -------------------------------
  // 2. gsap.set() 초기 상태
  // -------------------------------

  // P1
  gsap.set([...p1Docs, p1Product].filter(Boolean), {
    autoAlpha: 0,
    y: 50,
    scale: 0.95,
  });

  // P2: 왼쪽에서 등장
  gsap.set(p2Visuals, {
    autoAlpha: 0,
    x: -60,
  });

  // P3
  gsap.set([p3Site, ...p3Devices].filter(Boolean), {
    autoAlpha: 0,
    y: 35,
    scale: 0.96,
  });

  // -------------------------------
  // 3. 독립적인 등장 타임라인
  // scrub 없음
  // -------------------------------

  // P1
  const p1RevealTl = gsap.timeline({
    paused: true,
  });

  p1RevealTl
    .to(p1Docs, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.65,
      stagger: 0.22,
      ease: "power2.out",
    })
    .to(
      p1Product,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: "back.out(1.2)",
      },
      "-=0.05",
    );

  // P2
  const p2RevealTl = gsap.timeline({
    paused: true,
  });

  p2RevealTl.to(p2Visuals, {
    autoAlpha: 1,
    x: 0,
    duration: 0.8,
    stagger: 0.18,
    ease: "power3.out",
  });

  // P3
  const p3RevealTl = gsap.timeline({
    paused: true,
  });

  p3RevealTl
    .to(p3Site, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "power2.out",
    })
    .to(
      p3Devices,
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.65,
        stagger: 0.2,
        ease: "power2.out",
      },
      "-=0.1",
    );

  // -------------------------------
  // 4. 페이지 넘김 초기 설정
  // -------------------------------

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

  // WORKS 타이틀 고정
  if (worksTitle) {
    ScrollTrigger.create({
      trigger: "#works",
      start: "top top",
      end: "bottom top",
      pin: worksTitle,
      pinSpacing: false,
      anticipatePin: 1,
    });
  }

  // -------------------------------
  // 5. 페이지 펼침 타임라인
  // -------------------------------

  const OPEN_DURATION = 0.6;

  const reveals = [p1RevealTl, p2RevealTl, p3RevealTl];

  const revealAt = [];
  const revealed = [false, false, false];

  pages.forEach((page, i) => {
    // 현재 페이지가 펼쳐지기 시작하는 시점
    const openStart = gearTl.duration();

    // 페이지 펼치기
    gearTl.to(page, {
      rotateX: 0,
      opacity: 1,
      zIndex: 60 + i,
      duration: OPEN_DURATION,
      ease: "power2.out",
    });

    // 기존 파일철처럼 쌓이는 연출
    gearTl.to(
      pages,
      {
        y: (index) => {
          if (index <= i) {
            return -(i - index) * OFFSET_Y;
          }
          return 0;
        },
        duration: OPEN_DURATION,
        ease: "power2.out",
      },
      "<",
    );

    // 페이지가 70% 펼쳐지는 시점 기록
    revealAt[i] = openStart + OPEN_DURATION * 0.7;
  });

  // -------------------------------
  // 6. 이미지 등장 - 최초 한 번만
  // -------------------------------

  gearTl.eventCallback("onUpdate", () => {
    const currentTime = gearTl.time();

    reveals.forEach((tl, i) => {
      // 이미 등장한 페이지는 다시 실행하지 않음
      if (revealed[i]) return;

      // 해당 페이지가 70% 펼쳐지면 실행
      if (currentTime >= revealAt[i]) {
        revealed[i] = true;
        tl.play(0);
      }
    });
  });
}

// #works 바로 아래에 있는 하위 섹션만 감지
document.querySelectorAll("#works > section[data-title]").forEach((section) => {
  const title = section.dataset.title;

  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",

    onEnter: () => {
      changeSubTitle(title);

      if (section.classList.contains("team-project")) {
        worksTitle?.classList.add("is-team");
      } else {
        worksTitle?.classList.remove("is-team");
      }
    },

    onEnterBack: () => {
      changeSubTitle(title);

      if (section.classList.contains("team-project")) {
        worksTitle?.classList.add("is-team");
      } else {
        worksTitle?.classList.remove("is-team");
      }
    },
  });
});
const bg = document.querySelector(".mobileContent .bg");

if (bg) {
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
      },
    )
    .to(bg, {
      y: -25,
      duration: 1.5,
    });
}

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
      1,
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
        1,
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
      10000,
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

const contact = document.querySelector("#contact");
const contact_sectionTitle = contact.querySelector(".sectionTitle");
const contact_submit = contact.querySelector("button");
gsap.fromTo(
  contact_sectionTitle,
  {
    opacity: 0,
    x: -400,
  },
  {
    opacity: 1,
    x: 20,
    duration: 1,
    ease: "power3.out",

    scrollTrigger: {
      trigger: contact,
      start: "top 10%",
      toggleActions: "play reverse play reverse",
      // markers: true,
    },
  },
);
contact_submit.addEventListener("mouseenter", () => {
  gsap.to(contact_submit, {
    "border-radius": "20px",
    "background-image": "linear-gradient(-135deg, #9a35b3, #db2777)",
    duration: 0.5,
  });
});
contact_submit.addEventListener("mouseleave", () => {
  gsap.to(contact_submit, {
    "border-radius": "10px",
    "background-image": "linear-gradient(135deg, #9a35b3, #db2777)",
    duration: 0.5,
  });
});

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
const contactCard = contact.querySelector(".contact-card");
const outroThanks = contact.querySelector(".outro-thanks");
const outroMessageLines = contact.querySelectorAll(".outro-message span");

/* THANK YOU 선 그려지는 느낌 */
gsap.fromTo(
  outroThanks,
  {
    opacity: 0,
    WebkitTextStrokeColor: "transparent",
    textShadow: "0 0 0 rgba(255, 27, 96, 0)",
  },
  {
    opacity: 1,
    WebkitTextStrokeColor: "#ff1b60",
    textShadow: "0 0 12px rgba(255, 27, 96, 0.6)",
    duration: 1.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: contact,
      start: "top 20%",
      toggleActions: "play reverse play reverse",
    },
  },
);

/* I'm / READY. 각각 등장 */
gsap.fromTo(
  outroMessageLines,
  {
    opacity: 0,
    y: 80,
  },
  {
    opacity: 1,
    y: 0,
    duration: 0.9,
    stagger: 0.18,
    ease: "power3.out",
    scrollTrigger: {
      trigger: contact,
      start: "top 20%",
      toggleActions: "play reverse play reverse",
    },
  },
);

/* 카드 기울기 약하게 */
contactCard.addEventListener("mousemove", (e) => {
  const rect = contactCard.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateY = (x - centerX) / 120;
  const rotateX = -(y - centerY) / 120;

  gsap.to(contactCard, {
    rotateX: rotateX,
    rotateY: rotateY,
    duration: 0.35,
    ease: "power2.out",
  });
});

contactCard.addEventListener("mouseleave", () => {
  gsap.to(contactCard, {
    rotateX: 0,
    rotateY: 0,
    duration: 0.5,
    ease: "power3.out",
  });
});
const contactForm = contact.querySelector(".contact-form");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);

  const res = await fetch(contactForm.action, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  if (res.ok) {
    alert("메시지가 전송되었습니다. 감사합니다!");
    contactForm.reset();
  } else {
    alert("전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
  }
});
