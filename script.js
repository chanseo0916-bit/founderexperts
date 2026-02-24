const scriptURL =
  "https://script.google.com/macros/s/AKfycbxmRbzmGlOZKqqihEko-OlZsckaewvrb-Bb3KQIlRzG8hgoMtDyIUv8dxkuQ2I5IQ/exec";

document.addEventListener("DOMContentLoaded", () => {
  // Form Submission
  const form = document.getElementById("ciderForm");
  const submitBtn = document.getElementById("submitBtn");
  const successMessage = document.getElementById("successMessage");
  const loader = document.querySelector(".loader");
  const btnText = document.querySelector(".btn-text");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      if (btnText) btnText.style.opacity = "0";
      if (loader) loader.style.display = "block";

      // 데이터 수집
      const formData = new FormData(form);
      const coffeeChatInput = form.querySelector("#coffeeChat");
      const coffeeChatValue = coffeeChatInput ? coffeeChatInput.value : "";
      const formattedDate = coffeeChatValue
        ? coffeeChatValue.replace("T", " ")
        : "미선택";

      const statusVal = formData.get("status");
      const revenueVal = formData.get("revenue");

      // GAS 코드 및 스프레드시트 컬럼명과 100% 일치시킴
      const data = {
        이름: formData.get("name"),
        나이: formData.get("age"),
        연락처: formData.get("phone"),
        창업현황:
          statusVal === "기타"
            ? `기타(${formData.get("statusEtc") || ""})`
            : statusVal,
        창업분야: formData.get("field"),
        매출여부:
          revenueVal === "기타"
            ? `기타(${formData.get("revenueEtc") || ""})`
            : revenueVal || "미선택",
        "참여 행사 일자": formattedDate,
        고민사항: formData.get("problem"),
        개인정보동의:
          formData.get("privacyConsent") === "on" ? "동의" : "미동의",
        timestamp: new Date().toLocaleString("ko-KR"),
      };

      fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(() => {
          form.style.display = "none";
          if (successMessage) {
            successMessage.style.display = "block";
            successMessage.scrollIntoView({ behavior: "smooth" });
          }
        })
        .catch((error) => {
          console.error("Error!", error.message);
          alert("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
          submitBtn.disabled = false;
          if (btnText) btnText.style.opacity = "1";
          if (loader) loader.style.display = "none";
        });
    });
  }

  // FAQ Toggle
  document.querySelectorAll(".faq-question").forEach((q) => {
    q.addEventListener("click", () => {
      const item = q.parentElement;
      item.classList.toggle("active");
      const toggle = q.querySelector(".faq-toggle");
      if (toggle)
        toggle.innerText = item.classList.contains("active") ? "-" : "+";
    });
  });

  // Countdown Timer
  function updateTimer() {
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (!hoursEl) return;

    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    let diff = tomorrow - now;

    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);

    hoursEl.innerText = h.toString().padStart(2, "0");
    minutesEl.innerText = m.toString().padStart(2, "0");
    secondsEl.innerText = s.toString().padStart(2, "0");
  }

  if (document.getElementById("hours")) {
    setInterval(updateTimer, 1000);
    updateTimer();
  }

  // Modal Logic
  window.openApplicationModal = function () {
    const modal = document.getElementById("application-modal");
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  };

  window.closeApplicationModal = function () {
    const modal = document.getElementById("application-modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  // Toast Notification
  const mockUsers = [
    "웰니스 분야 이*서님",
    "AI·딥테크 분야 박*준님",
    "에듀테크 분야 최*아님",
    "핀테크 서비스 김*현님",
  ];
  function showNotification() {
    const toast = document.getElementById("notification-toast");
    const userText = document.getElementById("toast-user");
    if (toast && userText) {
      userText.innerText =
        mockUsers[Math.floor(Math.random() * mockUsers.length)];
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 4000);
    }
  }

  if (document.getElementById("notification-toast")) {
    setInterval(showNotification, 13000);
    setTimeout(showNotification, 3000);
  }

  // Mobile Menu Toggle
  window.toggleMobileMenu = function () {
    const navLinks = document.querySelector(".nav-links");
    const menuToggle = document.querySelector(".menu-toggle");
    if (navLinks && menuToggle) {
      navLinks.classList.toggle("active");
      menuToggle.classList.toggle("active");
      document.body.style.overflow = navLinks.classList.contains("active")
        ? "hidden"
        : "";
    }
  };

  // Close mobile menu when a link is clicked
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      const navLinks = document.querySelector(".nav-links");
      const menuToggle = document.querySelector(".menu-toggle");
      if (navLinks && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  // Expert Slider Drag-to-Scroll (Desktop)
  const slider = document.querySelector(".expert-slider-container");
  let isDown = false;
  let startX;
  let scrollLeft;
  let isDragging = false; // 드래그 중인지 확인하는 플래그

  if (slider) {
    slider.addEventListener("mousedown", (e) => {
      isDown = true;
      isDragging = false;
      slider.classList.add("active");
      slider.style.scrollSnapType = "none";
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", () => {
      isDown = false;
      slider.classList.remove("active");
    });

    slider.addEventListener("mouseup", (e) => {
      isDown = false;
      slider.classList.remove("active");
      slider.style.scrollSnapType = "x mandatory";

      // 드래그를 했다면 클릭 이벤트(상세 페이지 이동) 방지
      if (isDragging) {
        e.preventDefault();
      }
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDown) return;

      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2.5; // 감도 약간 증가 (2 -> 2.5)

      // 미세한 움직임이 아닐 때만 드래그로 판정
      if (Math.abs(x - startX) > 5) {
        isDragging = true;
        e.preventDefault();
        slider.scrollLeft = scrollLeft - walk;
      }
    });

    // 카드 내부의 a 태그나 이미지가 드래그 되는 것 방지
    slider.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });

    // 클릭 이벤트 핸들러: 드래그 중이었다면 클릭 무시
    const cards = slider.querySelectorAll(".expert-card");
    cards.forEach((card) => {
      const originalOnClick = card.onclick;
      card.onclick = null; // 인라인 onclick 제거 후 수동 관리

      card.addEventListener("click", (e) => {
        if (isDragging) {
          e.preventDefault();
          e.stopImmediatePropagation();
        } else {
          if (originalOnClick) {
            // originalOnClick이 문자열이 아니라 함수 형태일 수 있으므로 처리
            if (typeof originalOnClick === "function") {
              originalOnClick.call(card, e);
            } else {
              // 인라인은 문자열로 잡힐 수 있음 (브라우저에 따라 다름)
              // location.href 형식이 대부분이므로 직접 처리
              const hrefMatch = card
                .getAttribute("onclick")
                ?.match(/location\.href='([^']+)'/);
              if (hrefMatch) location.href = hrefMatch[1];
            }
          }
        }
      });
    });
  }

  // Expert Slider Buttons & Dots Logic
  const nextBtn = document.querySelector(".slider-nav-btn.next");
  const prevBtn = document.querySelector(".slider-nav-btn.prev");
  const dots = document.querySelectorAll(".slider-dots .dot");

  // cards is already defined above, but we can query again if needed
  const sliderCards = slider ? slider.querySelectorAll(".expert-card") : [];

  if (slider && nextBtn && prevBtn) {
    const getScrollAmount = () => {
      const card = sliderCards[0];
      return card
        ? card.offsetWidth + parseInt(getComputedStyle(slider).gap || 0)
        : 300;
    };

    nextBtn.addEventListener("click", () => {
      slider.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
      slider.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    });

    // Dots Update Logic
    const updateDots = () => {
      if (!dots.length || !sliderCards.length) return;
      const scrollLeft = slider.scrollLeft;
      const cardWidth = getScrollAmount();
      // Calculate active index based on scroll position
      let index = Math.round(scrollLeft / cardWidth);
      if (index < 0) index = 0;
      if (index >= dots.length) index = dots.length - 1;

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
      });
    };

    slider.addEventListener("scroll", () => {
      window.requestAnimationFrame(updateDots);
    });

    // Click on dot to scroll
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        const cardWidth = getScrollAmount();
        slider.scrollTo({ left: cardWidth * index, behavior: "smooth" });
      });
    });

    // Initialize dots state
    updateDots();
  }
});
