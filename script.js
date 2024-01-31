'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('nav');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// use forEach for nodeList(everithing that we get from document is nodeList).
//and bind the event(open modals) to the buttons
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ................ implementing smooth scroling

btnScrollTo.addEventListener('click', e => {
  // get coordinates of section1
  const s1coords = section1.getBoundingClientRect();

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////////////////////////////////////////////////////////
// .....................Event deligation: implementing  Page Navigation

//  Method number 1.
//this actually works just fine,but the problem is that it's not really efficient. So we are adding here the exact same callback function,
//so this event handler here, we are adding it once to each of these three elements. So the exact same function is now attached to these three elements.
// document.querySelectorAll('.nav__link').forEach(el =>
//   el.addEventListener('click', function (e) {
//     // default actions for link, scroll to Html.element in the viewport
//     e.preventDefault();
//     // to get attribute
//     const id = this.getAttribute('href');

//     // we use for implementing a navigation. So we put the ID of the elements that we want to scroll in the href attribute,
//     // so that then in the JavaScript, so we can read that href, and then we can select the element that we want to scroll to.
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// );

//  Method number 2
// 1. Add event Listener to common parent element
// 2. Determine what element eriginated event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// We simply edit one big event handler function to the parent element of all the elements that we're interested in,
// and then we simply determined where the click event came from. And then we also needed this matching strategy
// because we wanted to basically ignore clicks that did not happen right on one of these links.

// .............. building a tab components ........................

// select buttons, bottons container and  content container

// Use event deligation for implement tabbs section.
// 1. We define common parent's container for all of the buttons we want to use and attached event handler to it.
// 2. Define what the button clicked,  whenever we click on span element.Here we use  closest() method.
// to find the clothest parent element with class = operations__tab of our element.
// 3. continue perform code if result of click is true.
// 4. remove active class from  all the tabs.  lopp over nodeList of buttons and remove class =active
// 5. same for tabs content
// 6. add active class for button
// 7. attached active class to  content according to clicked button.
//1
tabsContainer.addEventListener('click', function (e) {
  //2
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  //3 guard class. if nothing clicked we immidiately finish this function
  if (!clicked) return;

  //4 remove classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  //5
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //6 add classes
  clicked.classList.add('operations__tab--active');

  //7. Activate content area

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// ....... Passed arguments into the event handler ....................
// Implement  the  links fade out effect.
//I'm not using the closest methods. And that's because there are simply no child elements that we could accidentally click here in this link,

const handleHover = function (e) {
  // console.log(this);
  if (e.target.classList.contains('nav__link')) {
    //assign target to variable
    const link = e.target;

    // select sibling elements(all athores links)
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    const logo = link.closest('.nav').querySelector('img');

    //change the opacity of sibling e.target link. and check if sibling doesn't contain e.target(link) then change the opacity of element
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// .......................Sticky Navigation .....................
//define the section-1 coordinates
// const initialCoord = section1.getBoundingClientRect();

// use scroll event to implement position sticky very bad practice
// window.addEventListener('scroll', function () {
//   //condition. if cuurent scrool coordinate > than coordinate of top position of section1
//   //than add class = sticky to the nav
//   if (this.scrollY > initialCoord.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// ..................... Intersection Observer API .........................
// this API allows our code to basically observe changes to the way that a certain target element
//intersects another element, or the way it intersects the viewport.

const header = document.querySelector('.header');

// dynamic calculating of nav.height
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries; // entries = threshold = [ ......]
  // console.log(entries);
  if (entry.isIntersecting) nav.classList.remove('sticky');
  // prevent  unnecessary observing
  else nav.classList.add('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, // when 0% of header are visible, call function
  rootMargin: `-${navHeight}px`, // margin value in px.
});

// start 'header' observing
headerObserver.observe(header);

// ............................. Revealing elements on scroll ......................
// Reveal sections
// We want to observe all sections
const allSections = document.querySelectorAll('.section');
// console.log(allSections);

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  // guard class
  if (!entry.isIntersecting) return;

  // remove class.hidden from current entry(section)
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

//create  new  built-in JavaScript object that provides a way to asynchronously observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport.
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// loop over Allsections array  and start observe each of the + add class hidden
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// .......................................Laizy loading images.............
/*  the main ingredient to this lazy loading strategy is that we have a very low resolution image, 
which is really small and which is loaded, right in the beginning.(200x120 16kb). big size img refferenced in the data-src attribute.
The data-x attribute is a custom data attribute in HTML. Custom data attributes allow you to store extra information private to the page or application, and they follow the format data-*, where * can be replaced with any descriptive name.

And so basically the idea is to... As we scroll to one of these low resolution images
we will then replace this low resolution image with the one that is here specified in the data-src attribute. and remove lazy-img class
*/
// select img with data-src attribute
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  // replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // to keep blur filter until big size imge is loaded
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  // console.log(entry.target);

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '300px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// ............... Slider component part 1 ...................

const slides = document.querySelectorAll('.slide'); // Use '.slide' assuming slides have the class "slide"
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let curSlide = 0;
const maxSlides = slides.length;

// to assign value of style.transform  all element depends on position on the viewport
const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};
// set first img to position=0  whe web page is loaded
goToSlide(0);

// Next Slide
const nextSlide = function () {
  if (curSlide === maxSlides - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
};

// previos Slide
const prevSlide = function () {
  if (!curSlide) {
    curSlide = 3;
  } else {
    curSlide--;
  }

  goToSlide(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// .....................implement keyboardEvent

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide(); // short curcuiting
});
