let words = document.querySelectorAll(".word");
words.forEach((word) => {
  let letters = word.textContent.split("");
  word.textContent = "";
  letters.forEach((letter) => {
    let span = document.createElement("span");
    span.textContent = letter;
    span.className = "letter";
    word.append(span);
  });
});

let currentWordIndex = 0;
let maxWordIndex = words.length - 1;
words[currentWordIndex].style.opacity = "1";  

let rotateText = () => {
  let currentWord = words[currentWordIndex];
  let nextWord =
    currentWordIndex === maxWordIndex
      ? words[0]
      : words[currentWordIndex + 1];
  // rotate out letters of current word
  Array.from(currentWord.children).forEach((letter, i) => {
    setTimeout(() => {
      letter.className = "letter out";
    }, i * 80);
  });
  // reveal and rotate in letters of next word
  nextWord.style.opacity = "1";
  Array.from(nextWord.children).forEach((letter, i) => {
    letter.className = "letter behind";
    setTimeout(() => {
      letter.className = "letter in";
    }, 340 + i * 80);
  });
  currentWordIndex =
    currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
};

rotateText();
setInterval(rotateText, 4000);



// Accordion Code : 
const accordions = document.querySelectorAll(".accordion");

accordions.forEach((accordion) => {
  const header = accordion.querySelector(".accordion-header");
  header.addEventListener("click", () => {
    accordion.classList.toggle("active");
  });
});



// Carousel Code :
// 1st Carousel :
const wrapper1 = document.querySelector(".program_wrapper1");
const carousel1 = document.querySelector(".carousel1");
const firstCardWidth1 = carousel1.querySelector(".card1").offsetWidth;
const arrowBtns1 = document.querySelectorAll(".program_wrapper1 i");
const carouselChildrens1 = [...carousel1.children];

let isDragging1 = false,
  isAutoPlay1 = true,
  startX1,
  startScrollLeft1,
  timeoutId1;

// Get the number of cards that can fit in the carousel at once
let cardPerView1 = Math.round(carousel1.offsetWidth / firstCardWidth1);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens1
  .slice(-cardPerView1)
  .reverse()
  .forEach((card) => {
    carousel1.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens1.slice(0, cardPerView1).forEach((card) => {
  carousel1.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel1.classList.add("no-transition");
carousel1.scrollLeft = carousel1.offsetWidth;
carousel1.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns1.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel1.scrollLeft +=
      btn.id == "left" ? -firstCardWidth1 : firstCardWidth1;
  });
});

const dragStart1 = (e) => {
  isDragging1 = true;
  carousel1.classList.add("dragging");
  // Records the initial cursor and scroll position of the carousel
  startX1 = e.pageX;
  startScrollLeft1 = carousel1.scrollLeft;
};

const dragging1 = (e) => {
  if (!isDragging1) return; // if isDragging is false return from here
  // Updates the scroll position of the carousel based on the cursor movement
  carousel1.scrollLeft = startScrollLeft1 - (e.pageX - startX1);
};

const dragStop1 = () => {
  isDragging1 = false;
  carousel1.classList.remove("dragging");
};

const infiniteScroll1 = () => {
  // If the carousel is at the beginning, scroll to the end
  if (carousel1.scrollLeft === 0) {
    carousel1.classList.add("no-transition");
    carousel1.scrollLeft =
      carousel1.scrollWidth - 2 * carousel1.offsetWidth;
    carousel1.classList.remove("no-transition");
  }
  // If the carousel is at the end, scroll to the beginning
  else if (
    Math.ceil(carousel1.scrollLeft) ===
    carousel1.scrollWidth - carousel1.offsetWidth
  ) {
    carousel1.classList.add("no-transition");
    carousel1.scrollLeft = carousel1.offsetWidth;
    carousel1.classList.remove("no-transition");
  }

  // Clear existing timeout & start autoplay if mouse is not hovering over carousel
  clearTimeout(timeoutId1);
  if (!wrapper1.matches(":hover")) autoPlay1();
};

const autoPlay1 = () => {
  if (window.innerWidth < 800 || !isAutoPlay1) return; // Return if window is smaller than 800 or isAutoPlay is false
  // Autoplay the carousel after every 2500 ms
  timeoutId1 = setTimeout(
    () => (carousel1.scrollLeft += firstCardWidth1),
    2500
  );
};
autoPlay1();

carousel1.addEventListener("mousedown", dragStart1);
carousel1.addEventListener("mousemove", dragging1);
document.addEventListener("mouseup", dragStop1);
carousel1.addEventListener("scroll", infiniteScroll1);
wrapper1.addEventListener("mouseenter", () => clearTimeout(timeoutId1));
wrapper1.addEventListener("mouseleave", autoPlay1);

// 2nd Carousel :
const wrapper2 = document.querySelector(".program_wrapper2");
const carousel2 = document.querySelector(".carousel2");
const firstCardWidth2 = carousel2.querySelector(".card2").offsetWidth;
const arrowBtns2 = document.querySelectorAll(".program_wrapper2 i");
const carouselChildrens2 = [...carousel2.children];

let isDragging2 = false,
  isAutoPlay2 = true,
  startX2,
  startScrollLeft2,
  timeoutId2;

// Get the number of cards that can fit in the carousel at once
let cardPerView2 = Math.round(carousel2.offsetWidth / firstCardWidth2);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens2
  .slice(-cardPerView2)
  .reverse()
  .forEach((card) => {
    carousel2.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens2.slice(0, cardPerView2).forEach((card) => {
  carousel2.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel2.classList.add("no-transition");
carousel2.scrollLeft = carousel2.offsetWidth;
carousel2.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns2.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel2.scrollLeft +=
      btn.id == "left" ? -firstCardWidth2 : firstCardWidth2;
  });
});

const dragStart2 = (e) => {
  isDragging2 = true;
  carousel2.classList.add("dragging");
  // Records the initial cursor and scroll position of the carousel
  startX2 = e.pageX;
  startScrollLeft2 = carousel2.scrollLeft;
};

const dragging2 = (e) => {
  if (!isDragging2) return; // if isDragging is false return from here
  // Updates the scroll position of the carousel based on the cursor movement
  carousel2.scrollLeft = startScrollLeft2 - (e.pageX - startX2);
};

const dragStop2 = () => {
  isDragging2 = false;
  carousel2.classList.remove("dragging");
};

const infiniteScroll2 = () => {
  // If the carousel is at the beginning, scroll to the end
  if (carousel2.scrollLeft === 0) {
    carousel2.classList.add("no-transition");
    carousel2.scrollLeft =
      carousel2.scrollWidth - 2 * carousel2.offsetWidth;
    carousel2.classList.remove("no-transition");
  }
  // If the carousel is at the end, scroll to the beginning
  else if (
    Math.ceil(carousel2.scrollLeft) ===
    carousel2.scrollWidth - carousel2.offsetWidth
  ) {
    carousel2.classList.add("no-transition");
    carousel2.scrollLeft = carousel2.offsetWidth;
    carousel2.classList.remove("no-transition");
  }

  // Clear existing timeout & start autoplay if mouse is not hovering over carousel
  clearTimeout(timeoutId2);
  if (!wrapper2.matches(":hover")) autoPlay2();
};

const autoPlay2 = () => {
  if (window.innerWidth < 800 || !isAutoPlay2) return; // Return if window is smaller than 800 or isAutoPlay is false
  // Autoplay the carousel after every 2500 ms
  timeoutId2 = setTimeout(
    () => (carousel2.scrollLeft += firstCardWidth2),
    2500
  );
};
autoPlay2();

carousel2.addEventListener("mousedown", dragStart2);
carousel2.addEventListener("mousemove", dragging2);
document.addEventListener("mouseup", dragStop2);
carousel2.addEventListener("scroll", infiniteScroll2);
wrapper2.addEventListener("mouseenter", () => clearTimeout(timeoutId2));
wrapper2.addEventListener("mouseleave", autoPlay2);

// 3rd Carousel :
const wrapper3 = document.querySelector(".program_wrapper3");
const carousel3 = document.querySelector(".carousel3");
const firstCardWidth3 = carousel3.querySelector(".card3").offsetWidth;
const arrowBtns3 = document.querySelectorAll(".program_wrapper3 i");
const carouselChildrens3 = [...carousel3.children];

let isDragging3 = false,
  isAutoPlay3 = true,
  startX3,
  startScrollLeft3,
  timeoutId3;

// Get the number of cards that can fit in the carousel at once
let cardPerView3 = Math.round(carousel3.offsetWidth / firstCardWidth3);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens3
  .slice(-cardPerView3)
  .reverse()
  .forEach((card) => {
    carousel3.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens3.slice(0, cardPerView3).forEach((card) => {
  carousel3.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hidse first few duplicate cards on Firefox
carousel3.classList.add("no-transition");
carousel3.scrollLeft = carousel3.offsetWidth;
carousel3.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns3.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel3.scrollLeft +=
      btn.id == "left" ? -firstCardWidth3 : firstCardWidth3;
  });
});

const dragStart3 = (e) => {
  isDragging3 = true;
  carousel3.classList.add("dragging");
  // Records the initial cursor and scroll position of the carousel
  startX3 = e.pageX;
  startScrollLeft3 = carousel3.scrollLeft;
};

const dragging3 = (e) => {
  if (!isDragging3) return; // if isDragging is false return from here
  // Updates the scroll position of the carousel based on the cursor movement
  carousel3.scrollLeft = startScrollLeft3 - (e.pageX - startX3);
};

const dragStop3 = () => {
  isDragging3 = false;
  carousel3.classList.remove("dragging");
};

const infiniteScroll3 = () => {
  // If the carousel is at the beginning, scroll to the end
  if (carousel3.scrollLeft === 0) {
    carousel3.classList.add("no-transition");
    carousel3.scrollLeft =
      carousel3.scrollWidth - 2 * carousel3.offsetWidth;
    carousel3.classList.remove("no-transition");
  }
  // If the carousel is at the end, scroll to the beginning
  else if (
    Math.ceil(carousel3.scrollLeft) ===
    carousel3.scrollWidth - carousel3.offsetWidth
  ) {
    carousel3.classList.add("no-transition");
    carousel3.scrollLeft = carousel3.offsetWidth;
    carousel3.classList.remove("no-transition");
  }

  // Clear existing timeout & start autoplay if mouse is not hovering over carousel
  clearTimeout(timeoutId3);
  if (!wrapper3.matches(":hover")) autoPlay3();
};

const autoPlay3 = () => {
  if (window.innerWidth < 800 || !isAutoPlay3) return; // Return if window is smaller than 800 or isAutoPlay is false
  // Autoplay the carousel after every 2500 ms
  timeoutId3 = setTimeout(
    () => (carousel3.scrollLeft += firstCardWidth3),
    2500
  );
};
autoPlay3();

carousel3.addEventListener("mousedown", dragStart3);
carousel3.addEventListener("mousemove", dragging3);
document.addEventListener("mouseup", dragStop3);
carousel3.addEventListener("scroll", infiniteScroll3);
wrapper3.addEventListener("mouseenter", () => clearTimeout(timeoutId3));
wrapper3.addEventListener("mouseleave", autoPlay3);



// 4th Carousel :
// 3rd Carousel :
const wrapper4 = document.querySelector(".program_wrapper4");
const carousel4 = document.querySelector(".carousel4");
const firstCardWidth4 = carousel4.querySelector(".card4").offsetWidth;
const arrowBtns4 = document.querySelectorAll(".program_wrapper4 i");
const carouselChildrens4 = [...carousel4.children];

let isDragging4 = false,
  isAutoPlay4 = true,
  startX4,
  startScrollLeft4,
  timeoutId4;

// Get the number of cards that can fit in the carousel at once
let cardPerView4 = Math.round(carousel4.offsetWidth / firstCardWidth4);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens4
  .slice(-cardPerView4)
  .reverse()
  .forEach((card) => {
    carousel4.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens4.slice(0, cardPerView4).forEach((card) => {
  carousel4.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel4.classList.add("no-transition");
carousel4.scrollLeft = carousel4.offsetWidth;
carousel4.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns4.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel4.scrollLeft +=
      btn.id == "left" ? -firstCardWidth4 : firstCardWidth4;
  });
});

const dragStart4 = (e) => {
  isDragging4 = true;
  carousel4.classList.add("dragging");
  // Records the initial cursor and scroll position of the carousel
  startX4 = e.pageX;
  startScrollLeft4 = carousel4.scrollLeft;
};

const dragging4 = (e) => {
  if (!isDragging4) return; // if isDragging is false return from here
  // Updates the scroll position of the carousel based on the cursor movement
  carousel4.scrollLeft = startScrollLeft4 - (e.pageX - startX4);
};

const dragStop4 = () => {
  isDragging4 = false;
  carousel4.classList.remove("dragging");
};

const infiniteScroll4 = () => {
  // If the carousel is at the beginning, scroll to the end
  if (carousel4.scrollLeft === 0) {
    carousel4.classList.add("no-transition");
    carousel4.scrollLeft =
      carousel4.scrollWidth - 2 * carousel4.offsetWidth;
    carousel4.classList.remove("no-transition");
  }
  // If the carousel is at the end, scroll to the beginning
  else if (
    Math.ceil(carousel4.scrollLeft) ===
    carousel4.scrollWidth - carousel4.offsetWidth
  ) {
    carousel4.classList.add("no-transition");
    carousel4.scrollLeft = carousel4.offsetWidth;
    carousel4.classList.remove("no-transition");
  }

  // Clear existing timeout & start autoplay if mouse is not hovering over carousel
  clearTimeout(timeoutId4);
  if (!wrapper4.matches(":hover")) autoPlay4();
};

const autoPlay4 = () => {
  if (window.innerWidth < 800 || !isAutoPlay4) return; // Return if window is smaller than 800 or isAutoPlay is false
  // Autoplay the carousel after every 2500 ms
  timeoutId4 = setTimeout(
    () => (carousel4.scrollLeft += firstCardWidth4),
    2500
  );
};
autoPlay4();

carousel4.addEventListener("mousedown", dragStart4);
carousel4.addEventListener("mousemove", dragging4);
document.addEventListener("mouseup", dragStop4);
carousel4.addEventListener("scroll", infiniteScroll4);
wrapper4.addEventListener("mouseenter", () => clearTimeout(timeoutId4));
wrapper4.addEventListener("mouseleave", autoPlay4);



// Course Carousel : 
let courseCurrentIndex = 0;
const course_items = document.querySelectorAll('.course-carousel-item');
const totalItems = course_items.length;

function showNextItem() {
    courseCurrentIndex++;
    if (courseCurrentIndex >= totalItems) {
        courseCurrentIndex = 0;
    }
    updateCarousel();
}

function updateCarousel() {
    const course_carousel = document.querySelector('.course-carousel');
    const newTransformValue = -courseCurrentIndex * 100;
    course_carousel.style.transform = `translateX(${newTransformValue}%)`;
}

// Automatic carousel
setInterval(showNextItem, 5000); // Change every 5 seconds

// Optionally, add previous/next buttons or swipe gestures for manual control


// Add this function to handle previous item navigation
function showPreviousItem() {
    courseCurrentIndex--;
    if (courseCurrentIndex < 0) {
        courseCurrentIndex = totalItems - 1;
    }
    updateCarousel();
}



// Dot slider Code : 
let slider = document.querySelector('.slider .list');
let items = document.querySelectorAll('.slider .list .item');
let next = document.getElementById('next');
let prev = document.getElementById('prev');
let dots = document.querySelectorAll('.slider .dots li');

let lengthItems = items.length - 1;
let active = 0;
next.onclick = function(){
    active = active + 1 <= lengthItems ? active + 1 : 0;
    reloadSlider();
}
prev.onclick = function(){
    active = active - 1 >= 0 ? active - 1 : lengthItems;
    reloadSlider();
}
let refreshInterval = setInterval(()=> {next.click()}, 5000);
function reloadSlider(){
    slider.style.left = -items[active].offsetLeft + 'px';
    // 
    let last_active_dot = document.querySelector('.slider .dots li.active');
    last_active_dot.classList.remove('active');
    dots[active].classList.add('active');

    clearInterval(refreshInterval);
    refreshInterval = setInterval(()=> {next.click()}, 5000);
}

dots.forEach((li, key) => {
    li.addEventListener('click', ()=>{
         active = key;
         reloadSlider();
    })
})




