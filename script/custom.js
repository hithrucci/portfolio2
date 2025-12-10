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
  const threshold = 550; // 이 값 안쪽이면 "중앙에 있다"고 판단 (조절 가능)

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

gsap.registerPlugin(ScrollTrigger);

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

gsap.registerPlugin(ScrollTrigger);

const webSection = document.querySelector(".web-publishing");
const stage = webSection.querySelector(".inner");
const pages = gsap.utils.toArray(".web-publishing .page");

const gearTl = gsap.timeline({
  scrollTrigger: {
    trigger: webSection, // ✅ 섹션은 트리거만
    start: "top top",
    end: "+=400%",
    scrub: 3,
    pin: stage, // ✅ pin 대상은 inner
    anticipatePin: 1,
  },
});

pages.forEach((page, i) => {
  /* 등장 */
  gearTl.to(page, {
    rotateX: 0,
    opacity: 1,
    duration: 1,
    ease: "power2.out",
  });

  /* 퇴장 */
  gearTl.to(page, {
    rotateX: 90,
    opacity: 0,
    duration: 1,
    ease: "power2.in",
  });

  /* 다음 페이지 미리 등장 */
  if (pages[i + 1]) {
    gearTl.to(
      pages[i + 1],
      {
        rotateX: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      },
      "-=0.2"
    );
  }
});
