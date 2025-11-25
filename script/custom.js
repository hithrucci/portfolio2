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
const weatherList = projects.querySelector("li:nth-child(2)");
const dreamList = projects.querySelector("li:nth-child(3)");
const referryList = projects.querySelector("li:nth-child(4)");
const todoList = projects.querySelector("li:nth-child(5)");

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
      duration: gsap.utils.random(3, 5),
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
  .fromTo(".flowText", { y: 300, width: "90%" }, { y: 0 })
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
    referryList,
    { opacity: 0 },
    {
      opacity: 1,
      x: 0,
      y: 250,
      rotation: -5,
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
// 2) projectDetail 등장 애니 (스크럽 X, 그냥 재생)
// ---------------------------------------------
const detailEnter = gsap.from(".projectDetail .projectWrap", {
  opacity: 0,
  rotateX: 10,
  y: 100,
  duration: 0.8,
  ease: "power2.out",
  paused: true, // 나중에 ScrollTrigger에서 play
});

ScrollTrigger.create({
  // markers: true,
  trigger: ".projectDetail",
  start: "50% 85%", // projectDetail 윗부분이 화면 75% 위치에 올 때
  // end 안 줘도 됨. 그냥 들어올 때 한 번만 재생
  onEnter: () => detailEnter.play(),
  onLeaveBack: () => detailEnter.reverse(), // 위로 스크롤하면 다시 숨기고 싶으면 유지
  // markers: true,
});

// ---------------------------------------------
// 3) projectDetail 수평 캐러셀
//    - 이 애니만 end 길게, 다른 애니에 영향 X
// ---------------------------------------------
gsap.fromTo(
  ".projectDetail .projectWrap",
  { x: 0 },
  {
    x: -4835, // 카드 4개면 -1500 * 4 = -6000
    ease: "none",
    scrollTrigger: {
      trigger: ".projectDetail",
      start: "-100px top",
      end: "+=4500", // 이 값 키우면 더 천천히 이동
      scrub: 1,
      pin: true,
      markers: true,
    },
  }
);

gsap.fromTo(
  ".sectionTitle .subTitle",
  {
    opacity: 0,
    x: -200,
  },
  {
    opacity: 1,
    x: 0,
    duration: 1,
    scrollTrigger: {
      trigger: ".projectDetail",
      start: "-120px top",
      end: "-120px top",
      // markers: true,
      scrub: 1,
    },
  }
);
gsap.fromTo(
  ".personalProjects>h3",
  { opacity: 0, transform: "rotateX(10deg)" },
  {
    opacity: 1,
    transform: "rotateX(0deg)",
    scrollTrigger: {
      start: "20% center",
      end: "80% center",
      trigger: ".personalProjects",
      // markers: true,
      scrub: 3,
    },
  }
);
