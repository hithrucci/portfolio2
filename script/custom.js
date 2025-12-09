// ---------------------------------------------
// header hide on scroll (그대로 사용)
// ---------------------------------------------
const header = document.querySelector("header");
let lastScrollY = window.scrollY;
const threshold = 5;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  if (Math.abs(currentScroll - lastScrollY) < threshold) return;
  if (currentScroll > lastScrollY && currentScroll > header.offsetHeight) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }
  lastScrollY = currentScroll;
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

gsap.registerPlugin(ScrollTrigger);

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
//    → WORKS 타이틀은 sticky로 따로 고정
// ---------------------------------------------
const overviewTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".projectOverview",
    start: "35% center",
    end: "+=2500", // 오버뷰 애니 구간 길이
    scrub: 1,
    pin: true,
    onUpdate: updateLinkLine,
    // markers: true,
  },
});

overviewTl
  .fromTo(".flowText", { y: 300 }, { y: 0, width: "1500px" })
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
  .fromTo(rect1, { opacity: 0 }, {})
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
  .fromTo(
    todoList,
    { opacity: 0 },
    {
      opacity: 1,
      x: -550,
      y: 180,
      rotation: 26,
    },
    1.2
  )
  .add(startFloating, 0);
// ---------------------------------------------
// 2) projectDetail 영역 입장 애니메이션
//    projectWrap 전체가 rotationX + opacity로 등장
// ---------------------------------------------
gsap.fromTo(
  ".interactive-project .projectDetail .projectWrap",
  { y: 150, rotationX: 10, opacity: 0, transformOrigin: "top center" },
  {
    y: 0,
    rotationX: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".interactive-project .projectDetail",
      start: "20% 50%",
      end: "40% 50%",
      scrub: 3,
      toggleActions: "play none none reverse",
      markers: true,
    },
  }
);
