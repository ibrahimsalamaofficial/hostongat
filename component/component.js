// Header, nav, account, and bag actions
document.addEventListener('DOMContentLoaded', () => {
  const pathPrefix = getPathPrefix();
  normalizeHeader(pathPrefix);
  ensureSiteMenu(pathPrefix);
  normalizeFooter(pathPrefix);

  const header = document.getElementById('header');
  if (!header || header.dataset.actionsReady === 'true') return;
  header.dataset.actionsReady = 'true';

  const signLink = header.querySelector('.header-button[href*="sign-in"]');
  const url = (path) => `${pathPrefix}${path}`;
  const session = readHeaderObject('hostongatSession');
  const isSignedIn = Boolean(session?.email);

  const target = header.querySelector('.side') || header;
  let actions = target.querySelector('.header-actions');
  if (!actions) {
    actions = document.createElement('div');
    actions.className = 'header-actions';
    const menu = target.querySelector('.menu-icon');
    if (menu) {
      target.insertBefore(actions, menu);
    } else {
      target.appendChild(actions);
    }
  }

  actions.innerHTML = `
    <a class="header-icon-link" href="${url('bag.html')}" aria-label="Bag">
      ${headerIcon('bag')}
      <span class="header-count" data-header-count="bag">0</span>
    </a>
    <a class="header-icon-link header-profile-link" href="${url('dashboard.html')}" aria-label="Dashboard"${isSignedIn ? '' : ' hidden'}>
      ${headerIcon('user')}
    </a>
  `;

  const profileLink = actions.querySelector('.header-profile-link');
  if (isSignedIn) {
    signLink?.classList.add('is-hidden');
    profileLink.hidden = false;
  } else {
    signLink?.classList.remove('is-hidden');
    profileLink.hidden = true;
  }

  updateHeaderCounts(actions);
  document.addEventListener('click', () => {
    window.setTimeout(() => updateHeaderCounts(actions), 80);
  });

  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 0);
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll);

  const menuBtn = document.getElementById('menu');
  const openTarget = document.getElementById('main') || document.body;
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      openTarget.classList.toggle('open');
    });
  }

  const dropdownBtn = document.querySelector('.main-li .line');
  const dropdown = document.getElementById('hasDropmenu');
  if (dropdownBtn && dropdown) {
    dropdownBtn.addEventListener('click', () => {
      dropdown.classList.toggle('open');
    });
  }

  function getPathPrefix() {
    const scriptSrc = document.querySelector('script[src$="component/component.js"]')?.getAttribute('src') || 'component/component.js';
    return scriptSrc.replace(/component\/component\.js$/, '');
  }

  function normalizeHeader(prefix) {
    const currentHeader = document.getElementById('header');
    if (currentHeader && currentHeader.querySelector('#menu')) return;
    document.body.classList.add('unified-header');

    const oldHeader = currentHeader || document.querySelector('.site-header, .auth-header');
    const header = document.createElement('header');
    header.id = 'header';
    header.innerHTML = `
      <div class="header-container" id="headerContainer">
        <div class="inside">
          <div class="logo">
            <a href="${prefix}index.html"><img src="${prefix}media/images/logo/hostongat.png" alt="Hostongat"></a>
          </div>
          <div class="side">
            <a href="${prefix}sign-in.html" class="header-button">
              <span class="label">Sign In</span>
            </a>
            <div class="menu-icon" id="menu">
              <div class="icon">
                <span class="top"></span>
                <span class="middle"></span>
                <span class="bottom"></span>
              </div>
              <div class="menu">
                <p>Menu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (oldHeader) {
      oldHeader.replaceWith(header);
      return;
    }

    document.body.insertBefore(header, document.body.firstChild);
  }

  function ensureSiteMenu(prefix) {
    if (document.querySelector('#main > nav, body > nav.site-menu')) return;

    const nav = document.createElement('nav');
    nav.className = 'site-menu';
    nav.innerHTML = `
      <div class="parent">
        <div class="main-ul">
          <div class="main-li has-dropmenu" id="hasDropmenu">
            <div class="line menu-name">
              <p class="li-name">Services</p>
              <div class="arrow"><span class="left"></span><span class="right"></span></div>
            </div>
            <div class="dropmenu">
              <div class="inside-ul">
                <div class="top-a"><a href="${prefix}request-a-quote.html">View All Services</a></div>
                <div class="uls">
                  <div class="small-ul">
                    <h4>Branding</h4>
                    <a href="${prefix}branding/branding-services.html" class="small-li">Branding Services</a>
                    <a href="${prefix}branding/logo.html" class="small-li">Logo Design</a>
                    <a href="${prefix}branding/brand-identity.html" class="small-li">Brand Identity</a>
                    <a href="${prefix}branding/graphic-design.html" class="small-li">Graphic Design</a>
                    <a href="${prefix}branding/brand-marketing.html" class="small-li">Brand Markerting</a>
                  </div>
                  <div class="small-ul">
                    <h4>Web Design</h4>
                    <a href="${prefix}web-design/custom.html" class="small-li">Custom Website Design</a>
                    <a href="${prefix}web-design/shopify.html" class="small-li">Shopify Website Design</a>
                    <a href="${prefix}web-design/wordpress.html" class="small-li">Wordpress Web Design</a>
                    <a href="${prefix}web-design/magento.html" class="small-li">Magento Web Design</a>
                    <a href="${prefix}web-design/ecommerce.html" class="small-li">eCommerce Web Design</a>
                  </div>
                  <div class="small-ul">
                    <h4>Marketing</h4>
                    <a href="${prefix}marketing/ims.html" class="small-li">Integrated Marketing Services</a>
                    <a href="${prefix}marketing/seo.html" class="small-li">Search Engine Optimization</a>
                    <a href="${prefix}marketing/smm.html" class="small-li">Social Media Marketing</a>
                    <a href="${prefix}marketing/cs.html" class="small-li">Consulting Services</a>
                  </div>
                  <div class="small-ul">
                    <h4>Hosting</h4>
                    <a href="${prefix}hosting/domainsearch/domainsearch.html" class="small-li">Domains</a>
                    <a href="${prefix}hosting/host/hosting.html" class="small-li">All Hosting Options</a>
                    <a href="${prefix}hosting/email/email.html" class="small-li">Emails</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="main-li"><div class="line"><a href="${prefix}request-a-quote.html" class="li-name">Work By Industry</a></div></div>
          <div class="main-li"><div class="line"><a href="${prefix}request-a-quote.html" class="li-name">Digital Trends</a></div></div>
          <div class="main-li"><div class="line"><a href="${prefix}about.html" class="li-name">About</a></div></div>
          <div class="main-li"><div class="line"><a href="${prefix}contact.html" class="li-name">Contact</a></div></div>
          <div class="main-button"><a href="${prefix}request-a-quote.html" class="button-5"><p>Request a Quote</p></a></div>
        </div>
      </div>
    `;
    const main = document.getElementById('main');
    if (main) {
      main.appendChild(nav);
    } else {
      document.body.appendChild(nav);
    }
  }

  function normalizeFooter(prefix) {
    const footer = document.createElement('footer');
    footer.className = 'main-footer';
    footer.innerHTML = `
      <div class="container">
        <div class="inside">
          <div class="footer-break">
            <a href="${prefix}index.html"><img src="${prefix}media/images/logo/hostongat.png" alt="Hostongat"></a>
          </div>
          <div class="office">
            <div class="office-item">
              <div class="city-abbreviation"><span>EG</span></div>
              <div class="details">
                <div class="city"><span>Egypt</span></div>
                <div class="location"><a href="https://maps.app.goo.gl/ig9BtpEBd1YoZGqr5" target="_blank">Egypt, Cairo,<br> Abbas Elakkad.</a></div>
                <div class="mobile"><a href="tel:+201021729068">+20 10 2172 9068</a></div>
              </div>
            </div>
            <div class="office-item">
              <div class="city-abbreviation"><span>SA</span></div>
              <div class="details">
                <div class="city"><span>Saudi Arabia</span></div>
                <div class="location"><a href="https://maps.app.goo.gl/1WF11RPghhgj64yJ9" target="_blank">Saudi Arabia, Riyadh, <br>Malaz Dist.</a></div>
                <div class="mobile"><a href="tel:+966536998115">+966 53 699 8115</a></div>
              </div>
            </div>
            <div class="office-item">
              <div class="city-abbreviation"><span>CH</span></div>
              <div class="details">
                <div class="city"><span>China</span></div>
                <div class="location"><a href="https://maps.app.goo.gl/jxavUEvJHJcmkM9Y8" target="_blank">China, Guangzhou, <br>Yuexiu District.</a></div>
                <div class="mobile"><a href="tel:+8613144405836">+86 131 4440 5836</a></div>
              </div>
            </div>
          </div>
          <div class="copy-privacy">
            <div class="footer-col copyright">©2026 Hostongat. All rights reserved</div>
            <div class="footer-col copyright">UN No: 7050336176</div>
            <div class="footer-col privacy-button"><a href="${prefix}request-a-quote.html">Privacy Policy</a></div>
            <div class="footer-col privacy-button"><a href="${prefix}request-a-quote.html">Manage Your Consent</a></div>
            <div class="footer-col privacy-button"><a href="${prefix}request-a-quote.html">Accessibility</a></div>
            <div class="footer-col privacy-button"><a href="tel:+966536998115">Call us at +966 53 699 8115</a></div>
          </div>
        </div>
      </div>
    `;

    const currentFooter = document.querySelector('footer');
    if (currentFooter) {
      currentFooter.replaceWith(footer);
      return;
    }

    const page = document.querySelector('#main > .page') || document.querySelector('.auth-page') || document.body;
    page.appendChild(footer);
  }

  function readHeaderObject(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === 'object' ? value : null;
    } catch {
      return null;
    }
  }

  function readHeaderList(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function updateHeaderCounts(scope) {
    const bagCount = readHeaderList('hostongatDomainBag').length + readHeaderList('hostongatHostingBag').length + readHeaderList('hostongatEmailBag').length;
    const bagBadge = scope.querySelector('[data-header-count="bag"]');
    if (bagBadge) bagBadge.textContent = bagCount;
  }

  function headerIcon(name) {
    const icons = {
      bag: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 8h12l1 13H5L6 8Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8a3 3 0 0 1 6 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      user: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" stroke-width="2"/><path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    };
    return icons[name] || '';
  }
});

/* Inside Pages Slider Landing*/
document.addEventListener('DOMContentLoaded', () => {
    const imagesContainer = document.querySelector('.component-custom-inside-pages-landing .child-image .images');
    const slides = document.querySelectorAll('.component-custom-inside-pages-landing .child-image .images .img');
    const dots = document.querySelectorAll('.component-custom-inside-pages-landing .child-image .slides-dots .dot');
    const leftArrow = document.querySelector('.component-custom-inside-pages-landing .child-image .left-arrow');
    const rightArrow = document.querySelector('.component-custom-inside-pages-landing .child-image .right-arrow');

    let currentIndex = 0;
    let slideInterval;
    const slideDuration = 5000;
    function showSlide(index) {
        if (index >= slides.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = slides.length - 1;
        } else {
            currentIndex = index;
        }

        const offset = -currentIndex * 100;
        imagesContainer.style.transform = `translateX(${offset}%)`;

        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    function startAutoSlide() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, slideDuration);
    }


    startAutoSlide();

    leftArrow.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
    });

    rightArrow.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            startAutoSlide();
        });
    });

    showSlide(currentIndex);
});

/*FAQs & Scope*/
const accordionButtons = document.querySelectorAll('.scope .parent-accordion .item .title button');
accordionButtons.forEach(button => {
    button.addEventListener('click', function() {
        const item = this.closest('.item');

        const itemContent = item.querySelector('.item-content');
        const arrow = this.querySelector('.arrow');

        document.querySelectorAll('.scope .parent-accordion .item').forEach(otherItem => {
            if (otherItem !== item) {
                const otherContent = otherItem.querySelector('.item-content');
                const otherArrow = otherItem.querySelector('.title button .arrow');
                
                otherContent.classList.remove('active');
                otherArrow.classList.remove('active');
            }
        });

        itemContent.classList.toggle('active');
        arrow.classList.toggle('active');
    });
});

/*Difference*/
document.addEventListener('DOMContentLoaded', () => {
  const experienceSections = document.querySelectorAll('.experience');

  experienceSections.forEach(experienceSection => {
    const buttons = experienceSection.querySelectorAll('.top .buttons .button');
    const children = experienceSection.querySelectorAll('.second-container .parent .child');

    if (buttons.length > 0) {
      buttons[0].classList.add('selected');
    }
    if (children.length > 0) {
      children[0].classList.add('is-active');
    }

    buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        children.forEach(c => c.classList.remove('is-active'));
        if (children[index]) {
          children[index].classList.add('is-active');
        }
      });
    });
  });
});

/*Recommendations*/
document.addEventListener('DOMContentLoaded', () => {

    const allRecommendationSections = document.querySelectorAll('.recommendations');

    allRecommendationSections.forEach(currentSection => {
        const selections = currentSection.querySelectorAll('.selections .select');
        const boxes = currentSection.querySelector('.parent-boxes .boxes');
        const underline = currentSection.querySelector('.underline');
        const leftArrow = currentSection.querySelector('.arrow.left');
        const rightArrow = currentSection.querySelector('.arrow.right');

        const SCROLL_DURATION = 10;

        let touchStartX = 0;
        let touchEndX = 0;
        const SWIPE_THRESHOLD = 50;

        function updateUnderline(selectedElement) {
            if (selectedElement && underline) {
                underline.style.width = `${selectedElement.offsetWidth}px`;
                underline.style.left = `${selectedElement.offsetLeft}px`;
            }
        }

        function updateArrows() {
            if (!boxes || !leftArrow || !rightArrow) return;

            if (boxes.scrollLeft > 0) {
                leftArrow.classList.add('active');
            } else {
                leftArrow.classList.remove('active');
            }

            const epsilon = 1;
            if (Math.ceil(boxes.scrollLeft + boxes.clientWidth) < boxes.scrollWidth - epsilon) {
                rightArrow.classList.add('active');
            } else {
                rightArrow.classList.remove('active');
            }
        }

        if (selections.length > 0) {
            const initialSelected = selections[0];
            initialSelected.classList.add('selected');
            updateUnderline(initialSelected);
            updateArrows();
        }

        selections.forEach((select, index) => {
            select.addEventListener('click', () => {
                selections.forEach(s => s.classList.remove('selected'));
                select.classList.add('selected');

                const targetBox = boxes.children[index];
                if (targetBox) {
                    smoothScroll(boxes, targetBox.offsetLeft - boxes.offsetLeft, SCROLL_DURATION);
                }

                updateUnderline(select);

                updateArrows();
            });
        });

        if (boxes) {
            boxes.addEventListener('scroll', () => {
                updateArrows();
            });

            boxes.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            });

            boxes.addEventListener('touchmove', (e) => {
                touchEndX = e.touches[0].clientX;
            });

            boxes.addEventListener('touchend', () => {
                const currentSelected = currentSection.querySelector('.selections .select.selected');
                if (!currentSelected) return;

                const currentIndex = Array.from(selections).indexOf(currentSelected);

                const deltaX = touchEndX - touchStartX;

                if (deltaX > SWIPE_THRESHOLD) {
                    const prevSelect = selections[currentIndex - 1];
                    if (prevSelect) {
                        prevSelect.click();
                    }
                } else if (deltaX < -SWIPE_THRESHOLD) {
                    const nextSelect = selections[currentIndex + 1];
                    if (nextSelect) {
                        nextSelect.click();
                    }
                }

                touchStartX = 0;
                touchEndX = 0;
            });
        }

        if (leftArrow) {
            leftArrow.addEventListener('click', () => {
                const currentSelected = currentSection.querySelector('.selections .select.selected');
                const prevSibling = currentSelected ? currentSelected.previousElementSibling : null;
                if (prevSibling && prevSibling.classList.contains('select')) {
                    prevSibling.click();
                }
            });
        }

        if (rightArrow) {
            rightArrow.addEventListener('click', () => {
                const currentSelected = currentSection.querySelector('.selections .select.selected');
                const nextSibling = currentSelected ? currentSelected.nextElementSibling : null;
                if (nextSibling && nextSibling.classList.contains('select')) {
                    nextSibling.click();
                }
            });
        }
    });

    function smoothScroll(element, to, duration) {
        const start = element.scrollLeft;
        const change = to - start;
        let currentTime = 0;

        const animateScroll = () => {
            currentTime += 10;
            const val = easeInOutQuad(currentTime, start, change, duration);
            element.scrollLeft = val;
            if (currentTime < duration) {
                requestAnimationFrame(animateScroll);
            }
        };

        animateScroll();
    }

    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
});

/*Services*/
const items = document.querySelectorAll('section.services .items .item');
items.forEach(item => {
  item.addEventListener('mouseenter', () => {
    items.forEach(i => i.classList.remove('is-active'));
    item.classList.add('is-active');
  });
});

/*Our Difference*/
document.addEventListener('DOMContentLoaded', () => {
  // Select all section containers with the class of experience
  const experienceSections = document.querySelectorAll('.experience');

  experienceSections.forEach(section => {
    const buttons = section.querySelectorAll('.top .buttons .button');
    const children = section.querySelectorAll('.second-container .parent .child');

    buttons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        // Remove the 'selected' class from all buttons within the current section
        buttons.forEach(b => b.classList.remove('selected'));
        // Add the 'selected' class to the clicked button
        btn.classList.add('selected');

        // Remove the 'is-active' class from all content within the current section
        children.forEach(c => c.classList.remove('is-active'));
        // Add the 'is-active' class to the content that matches the index of the button
        if (children[index]) {
          children[index].classList.add('is-active');
        }
      });
    });
  });
});

/*Result*/
document.addEventListener('DOMContentLoaded', () => {
  // Select all sections that contain the slider functionality
  const sliderSections = document.querySelectorAll('.results');

  sliderSections.forEach(section => {
    const slider = section.querySelector('.parent');
    const slides = section.querySelectorAll('.parent .child');
    const dots = section.querySelectorAll('.number');
    const leftArrow = section.querySelector('.leftarrow');
    const rightArrow = section.querySelector('.rightarrow');

    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateSlider() {
      slider.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach(dot => dot.classList.remove('active'));
      dots[currentIndex].classList.add('active');
    }

    function goToSlide(index) {
      currentIndex = index;
      updateSlider();
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
    }

    // Event Listeners
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });

    rightArrow.addEventListener('click', nextSlide);
    leftArrow.addEventListener('click', prevSlide);
  });
});

/*Industry*/
document.addEventListener('DOMContentLoaded', function () {
    // Select all sections you want to apply the logic to (assuming each section has the .industry class)
    const industrySections = document.querySelectorAll('.industry');

    industrySections.forEach(section => {
        const types = section.querySelectorAll('.types .type');
        const boxes = section.querySelectorAll('.boxes .box');
        
        types.forEach((type, index) => {
            type.addEventListener('click', () => {
                // Remove 'active' class from all types and boxes in the current section
                types.forEach(t => t.classList.remove('active'));
                boxes.forEach(b => b.classList.remove('active'));

                // Add 'active' class to the selected type and corresponding box
                type.classList.add('active');
                if (boxes[index]) {
                    boxes[index].classList.add('active');
                }
            });
        });
    });
});


/*Features*/
document.addEventListener('DOMContentLoaded', () => {
    // Select all sections that contain the filter functionality
    const featuredSections = document.querySelectorAll('.featured');

    featuredSections.forEach((section) => {
        const filterButtons = section.querySelectorAll('.filter-button');
        const items = section.querySelectorAll('.parent .child');

        // Function to apply filter
        function applyFilter(filterValue) {
            items.forEach(item => {
                if (item.dataset.category === filterValue || filterValue === 'all') {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        // Add event listeners to buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove 'checked' class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('checked'));
                // Add 'checked' class to the clicked button
                button.classList.add('checked');
                // Get the filter value
                const filter = button.dataset.filter;
                // Apply the filter
                applyFilter(filter);
            });
        });

        // Initially apply the filter based on the active button
        const activeButton = section.querySelector('.filter-button.checked');
        if (activeButton) {
            const initialFilter = activeButton.dataset.filter;
            applyFilter(initialFilter);
        } else if (filterButtons.length > 0) {
            // If no active button, optionally apply the first filter or the 'all' filter
            applyFilter('all');
        }
    });
});


/*Case Studies*/
/*Big Screens*/
document.addEventListener('DOMContentLoaded', function() {
    // Select all .case sections
    const caseSections = document.querySelectorAll('.case');

    caseSections.forEach((section) => {
        // Within each section, find tabs, images, and case items
        const tabs = section.querySelectorAll('.tab');
        const images = section.querySelectorAll('.bg img');
        const caseItems = section.querySelectorAll('.case-item');

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', function() {
                // Deactivate currently active tab, image, and case item within the section
                const activeTab = section.querySelector('.tab.active');
                const activeImage = section.querySelector('.bg img.active');
                const activeCaseItem = section.querySelector('.case-item.active');

                if (activeTab) activeTab.classList.remove('active');
                if (activeImage) activeImage.classList.remove('active');
                if (activeCaseItem) activeCaseItem.classList.remove('active');

                // Activate the clicked tab, corresponding image, and case item within the section
                tab.classList.add('active');
                if (images[index]) images[index].classList.add('active');
                if (caseItems[index]) caseItems[index].classList.add('active');
            });
        });
    });
});
/*Mobile Screens*/
document.addEventListener("DOMContentLoaded", function () {
    // Select all sections with the class .case
    const caseSections = document.querySelectorAll('.case');

    caseSections.forEach((section) => {
        // Select all media elements within the current section
        const mediaElements = section.querySelectorAll('.case-item .media');

        mediaElements.forEach((media) => {
            media.addEventListener('click', () => {
                // Parent case-item of the clicked media within the current section
                const parentCaseItem = media.parentElement;

                // Check if the clicked case-item is already active
                const isActive = parentCaseItem.classList.contains('active');

                // Close all active case-items within the current section
                section.querySelectorAll('.case-item.active').forEach((item) => {
                    item.classList.remove('active');
                });

                // Activate the clicked case-item if it was not active
                if (!isActive) {
                    parentCaseItem.classList.add('active');
                }
            });
        });
    });
});

// Play Landing Backgrond
document.querySelectorAll('.hero .column').forEach(col => {
    col.innerHTML += col.innerHTML;
});


// Toggle Favourite
function toggleFavourite(element) {
  element.classList.toggle('added');
}

// Filter Pages
document.addEventListener('DOMContentLoaded', () => {
  const filters = document.querySelectorAll('.filters .filter button');
  const pages = document.querySelectorAll('.filter-pages .c-page');
  filters.forEach((filter, index) => {
    filter.addEventListener('click', () => {
      // Remove 'selected' class from all filters
      filters.forEach(f => f.parentElement.classList.remove('selected'));
      // Add 'selected' class to the clicked filter
      filter.parentElement.classList.add('selected');
      // Hide all pages
      pages.forEach(page => page.style.display = 'none');
      // Show the page corresponding to the clicked filter
      pages[index].style.display = 'block';
    });
  });
});

// Filter Page
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const lengthRange = document.getElementById("lengthRange");
const lengthValue = document.getElementById("lengthValue");
function updateProgress(rangeInput) {
  const percent = (rangeInput.value - rangeInput.min) / (rangeInput.max - rangeInput.min) * 100 + "%";
  rangeInput.style.setProperty('--progress', percent);
}
if (priceRange && priceValue) {
  priceRange.addEventListener("input", () => {
    priceValue.textContent = `EGP ${priceRange.value}`;
    updateProgress(priceRange);
  });
  updateProgress(priceRange);
}
if (lengthRange && lengthValue) {
  lengthRange.addEventListener("input", () => {
    lengthValue.textContent = lengthRange.value;
    updateProgress(lengthRange);
  });
  updateProgress(lengthRange);
}


/* Page and product scripts moved into component.js */

/* home domain search */
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById("homeDomainSearchButton")) return;
const homeDomainInput = document.getElementById("domainSearch");
        const homeDomainButton = document.getElementById("homeDomainSearchButton");
        const domainSearchUrl = "hosting/domainsearch/domainsearch.html";

        function cleanHomeDomain(value) {
            const cleaned = value
                .toLowerCase()
                .replace(/^https?:\/\//, "")
                .replace(/^www\./, "")
                .replace(/[^a-z0-9.-]/g, "")
                .replace(/\.+/g, ".");

            if (!cleaned) return "yourbrand.com";
            return cleaned.includes(".") ? cleaned : `${cleaned}.com`;
        }

        function goToDomainSearch(value) {
            const domain = cleanHomeDomain(value);
            window.location.href = `${domainSearchUrl}?domain=${encodeURIComponent(domain)}`;
        }

        homeDomainButton.addEventListener("click", () => {
            goToDomainSearch(homeDomainInput.value);
        });

        homeDomainInput.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                goToDomainSearch(homeDomainInput.value);
            }
        });

        document.querySelectorAll(".domains-types .type").forEach(type => {
            type.addEventListener("click", () => {
                const extension = type.querySelector(".name")?.textContent.trim() || ".com";
                const base = cleanHomeDomain(homeDomainInput.value).split(".")[0] || "yourbrand";
                goToDomainSearch(`${base}${extension}`);
            });
        });

});

/* contact page */
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById("contactForm")) return;
document.getElementById("contactForm").addEventListener("submit", event => {
            const form = event.currentTarget;
            const data = Object.fromEntries(new FormData(form).entries());
            const messages = JSON.parse(localStorage.getItem("hostongatContactMessages") || "[]");
            messages.unshift({ ...data, createdAt: new Date().toISOString() });
            localStorage.setItem("hostongatContactMessages", JSON.stringify(messages));
            document.getElementById("contactNotice").textContent = "Message saved locally and ready to send.";
        });

});

/* sign in page */
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById("signInForm")) return;
const togglePassword = document.querySelector(".toggle-password");
        const passwordInput = document.getElementById("password");

        togglePassword.addEventListener("click", () => {
            const isPassword = passwordInput.type === "password";
            passwordInput.type = isPassword ? "text" : "password";
            togglePassword.textContent = isPassword ? "Hide" : "Show";
            togglePassword.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
        });

        const signInForm = document.getElementById("signInForm");
        const authMessage = document.getElementById("authMessage");
        const usersKey = "hostongatUsers";
        const sessionKey = "hostongatSession";

        function readUsers() {
            try {
                const users = JSON.parse(localStorage.getItem(usersKey));
                return Array.isArray(users) ? users : [];
            } catch {
                return [];
            }
        }

        function saveSession(user) {
            localStorage.setItem(sessionKey, JSON.stringify({
                name: user.name || "Hostongat Client",
                email: user.email,
                company: user.company || "",
                signedInAt: new Date().toISOString()
            }));
        }

        signInForm.addEventListener("submit", event => {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(signInForm).entries());
            const users = readUsers();
            const user = users.find(item => item.email.toLowerCase() === data.email.toLowerCase());

            if (user && user.password !== data.password) {
                authMessage.textContent = "Password does not match this account.";
                return;
            }

            const sessionUser = user || { name: data.email.split("@")[0], email: data.email, company: "" };
            saveSession(sessionUser);
            window.location.href = "dashboard.html";
        });

});

/* create account page */
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById("createAccountForm")) return;
document.querySelectorAll(".toggle-password").forEach((button) => {
            const input = document.getElementById(button.getAttribute("aria-controls"));
            button.addEventListener("click", () => {
                const isPassword = input.type === "password";
                input.type = isPassword ? "text" : "password";
                button.textContent = isPassword ? "Hide" : "Show";
                button.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
            });
        });

        const createAccountForm = document.getElementById("createAccountForm");
        const authMessage = document.getElementById("authMessage");
        const usersKey = "hostongatUsers";
        const sessionKey = "hostongatSession";

        function readUsers() {
            try {
                const users = JSON.parse(localStorage.getItem(usersKey));
                return Array.isArray(users) ? users : [];
            } catch {
                return [];
            }
        }

        createAccountForm.addEventListener("submit", event => {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(createAccountForm).entries());
            const users = readUsers();
            const existing = users.some(user => user.email.toLowerCase() === data.email.toLowerCase());

            if (existing) {
                authMessage.textContent = "This email already has an account. Sign in instead.";
                return;
            }

            const user = {
                name: data.name,
                email: data.email,
                company: data.company,
                password: data.password,
                createdAt: new Date().toISOString()
            };
            users.push(user);
            localStorage.setItem(usersKey, JSON.stringify(users));
            localStorage.setItem(sessionKey, JSON.stringify({
                name: user.name,
                email: user.email,
                company: user.company,
                signedInAt: new Date().toISOString()
            }));
            window.location.href = "dashboard.html";
        });

});

/* forgot password page */
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById("resetForm")) return;
document.getElementById("resetForm").addEventListener("submit", event => {
            event.preventDefault();
            const email = new FormData(event.currentTarget).get("email");
            localStorage.setItem("hostongatPasswordReset", JSON.stringify({
                email,
                requestedAt: new Date().toISOString()
            }));
            document.getElementById("resetMessage").textContent = "Reset instructions are ready for this demo flow. You can return to sign in.";
        });

});

/* dashboard page */
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector(".dashboard-shell")) return;
const keys = {
            session: "hostongatSession",
            services: "hostongatServices",
            orders: "hostongatOrders",
            tickets: "hostongatTickets"
        };
        const session = readObject(keys.session) || { name: "", email: "", company: "" };
        if (!session.email) window.location.href = "sign-in.html";

        const profileName = document.getElementById("profileName");
        const profileEmail = document.getElementById("profileEmail");
        const serviceList = document.getElementById("serviceList");
        const orderList = document.getElementById("orderList");
        const activeCount = document.getElementById("activeCount");
        const domainCount = document.getElementById("domainCount");
        const orderCount = document.getElementById("orderCount");
        const ticketCount = document.getElementById("ticketCount");
        const nameInput = document.getElementById("nameInput");
        const companyInput = document.getElementById("companyInput");

        function readObject(key) {
            try {
                const value = JSON.parse(localStorage.getItem(key));
                return value && typeof value === "object" ? value : null;
            } catch {
                return null;
            }
        }

        function readList(key) {
            try {
                const value = JSON.parse(localStorage.getItem(key));
                return Array.isArray(value) ? value : [];
            } catch {
                return [];
            }
        }

        function writeList(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        }

        function money(value) {
            return `EGP ${Math.round(value || 0).toLocaleString()}`;
        }

        function prettyDate(value) {
            return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
        }

        function currentServices() {
            return readList(keys.services).filter(service => !session?.email || service.ownerEmail === session.email || !service.ownerEmail);
        }

        function currentOrders() {
            return readList(keys.orders).filter(order => !session?.email || order.ownerEmail === session.email || !order.ownerEmail);
        }

        function renderProfile() {
            profileName.textContent = session.name || "Hostongat Client";
            profileEmail.textContent = session.email || "";
            nameInput.value = session.name || "";
            companyInput.value = session.company || "";
        }

        function renderServices() {
            const services = currentServices();
            activeCount.textContent = services.filter(service => service.status === "Active").length;
            domainCount.textContent = services.filter(service => service.type === "Domain").length;
            if (!services.length) {
                serviceList.innerHTML = `<div class="empty">No services yet. Buy a domain, hosting plan, or email plan to populate this dashboard.</div>`;
                return;
            }
            serviceList.innerHTML = services.map(service => `
                <article class="service-card">
                    <div class="service-top">
                        <div>
                            <span class="tag">${service.type}</span>
                            <h3>${service.name}</h3>
                        </div>
                        <span class="tag">${service.status}</span>
                    </div>
                    <p>Renewal: ${prettyDate(service.renewal)}. Auto-renew is ${service.autoRenew ? "on" : "off"}.</p>
                    <p>Order: ${service.orderId}. Price: ${money(service.price)}.</p>
                    <div class="service-actions">
                        <button class="ghost-button" data-toggle-renew="${service.id}">${service.autoRenew ? "Turn Off Renewal" : "Turn On Renewal"}</button>
                        <button class="ghost-button" data-open-ticket="${service.name}">Get Support</button>
                        <button class="danger" data-cancel-service="${service.id}">Cancel Service</button>
                    </div>
                </article>
            `).join("");
            bindServiceActions();
        }

        function renderOrders() {
            const orders = currentOrders();
            orderCount.textContent = orders.length;
            if (!orders.length) {
                orderList.innerHTML = `<div class="empty">No orders yet.</div>`;
                return;
            }
            orderList.innerHTML = orders.map(order => `
                <article class="order-card">
                    <div class="order-top">
                        <div><span class="tag">${order.status}</span><h3>${order.id}</h3></div>
                        <strong>${money(order.total)}</strong>
                    </div>
                    <p>${prettyDate(order.createdAt)} · ${order.items.length} product(s)</p>
                    <p>${order.items.map(item => `${item.type}: ${item.name}`).join(", ")}</p>
                </article>
            `).join("");
        }

        function renderTickets() {
            ticketCount.textContent = readList(keys.tickets).filter(ticket => ticket.email === session.email).length;
        }

        function bindServiceActions() {
            document.querySelectorAll("[data-toggle-renew]").forEach(button => {
                button.onclick = () => {
                    const services = readList(keys.services);
                    const service = services.find(item => item.id === button.dataset.toggleRenew);
                    if (service) service.autoRenew = !service.autoRenew;
                    writeList(keys.services, services);
                    renderServices();
                };
            });
            document.querySelectorAll("[data-cancel-service]").forEach(button => {
                button.onclick = () => {
                    const services = readList(keys.services);
                    const service = services.find(item => item.id === button.dataset.cancelService);
                    if (service) service.status = service.status === "Cancelled" ? "Active" : "Cancelled";
                    writeList(keys.services, services);
                    renderServices();
                };
            });
            document.querySelectorAll("[data-open-ticket]").forEach(button => {
                button.onclick = () => {
                    document.querySelector("#ticketForm [name='subject']").value = `Support for ${button.dataset.openTicket}`;
                    location.hash = "support";
                };
            });
        }

        document.getElementById("profileForm").addEventListener("submit", event => {
            event.preventDefault();
            session.name = nameInput.value;
            session.company = companyInput.value;
            localStorage.setItem(keys.session, JSON.stringify(session));
            document.getElementById("profileNotice").textContent = "Profile saved.";
            renderProfile();
        });

        document.getElementById("ticketForm").addEventListener("submit", event => {
            event.preventDefault();
            const data = Object.fromEntries(new FormData(event.currentTarget).entries());
            const tickets = readList(keys.tickets);
            tickets.unshift({ id: `TCK-${Date.now()}`, email: session.email, status: "Open", createdAt: new Date().toISOString(), ...data });
            writeList(keys.tickets, tickets);
            event.currentTarget.reset();
            document.getElementById("ticketNotice").textContent = "Ticket opened.";
            renderTickets();
        });

        document.getElementById("activateDemo").addEventListener("click", () => {
            const demoOrder = {
                id: `HST-DEMO-${Date.now()}`,
                createdAt: new Date().toISOString(),
                status: "Processing",
                ownerEmail: session.email,
                items: [
                    { type: "Domain", name: "yourbrand.com", price: 599 },
                    { type: "Hosting", name: "Web Hosting Deluxe", price: 5791 },
                    { type: "Email", name: "Business Email Plus", price: 2988 }
                ],
                total: 9378
            };
            const demoServices = demoOrder.items.map((item, index) => ({
                id: `${demoOrder.id}-${index + 1}`,
                orderId: demoOrder.id,
                type: item.type,
                name: item.name,
                price: item.price,
                status: "Active",
                renewal: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                autoRenew: true,
                ownerEmail: session.email
            }));
            writeList(keys.orders, [demoOrder, ...readList(keys.orders)]);
            writeList(keys.services, [...demoServices, ...readList(keys.services)]);
            renderAll();
        });

        document.getElementById("signOut").addEventListener("click", () => {
            localStorage.removeItem(keys.session);
            window.location.href = "sign-in.html";
        });

        function renderAll() {
            renderProfile();
            renderServices();
            renderOrders();
            renderTickets();
        }

        renderAll();

});

/* domain search page */
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById("domainSearchForm")) return;
const tldPrices = {
            ".com": { old: 1099, price: 599 },
            ".net": { old: 999, price: 549 },
            ".org": { old: 949, price: 499 },
            ".co": { old: 1199, price: 799 },
            ".agency": { old: 1299, price: 899 },
            ".studio": { old: 1199, price: 749 },
            ".store": { old: 999, price: 399 },
            ".online": { old: 899, price: 349 }
        };

        const takenDomains = new Set(["hostongat.com", "google.com", "iso.com", "digital.com", "example.com"]);
        const searchInput = document.getElementById("domainSearch");
        const searchForm = document.getElementById("domainSearchForm");
        const primaryResult = document.getElementById("primaryResult");
        const suggestedDomains = document.getElementById("suggestedDomains");
        const historyList = document.getElementById("historyList");
        const favouriteList = document.getElementById("favouriteList");
        const filteredDomains = document.getElementById("filteredDomains");
        const favouriteCount = document.getElementById("favouriteCount");
        const priceRange = document.getElementById("priceRange");
        const priceValue = document.getElementById("priceValue");
        const lengthRange = document.getElementById("lengthRange");
        const lengthValue = document.getElementById("lengthValue");
        const modal = document.getElementById("actionModal");
        const modalTitle = document.getElementById("modalTitle");
        const modalText = document.getElementById("modalText");
        const modalAccept = document.getElementById("modalAccept");
        const storageKeys = {
            history: "hostongatDomainHistory",
            favourites: "hostongatDomainFavourites",
            bag: "hostongatDomainBag"
        };

        const requestedDomain = new URLSearchParams(window.location.search).get("domain");
        let currentQuery = requestedDomain ? cleanDomain(requestedDomain) : "hostongat.com";
        let history = readList(storageKeys.history, ["hostongat.com", "brandstudio.com", "digitalgrowth.co"]);
        let favourites = new Set(readList(storageKeys.favourites, ["brandstudio.com"]));
        let cart = new Set(readList(storageKeys.bag, []));
        let activeExtension = "all";
        let lastSuggestions = [];

        function readList(key, fallback = []) {
            try {
                const value = JSON.parse(localStorage.getItem(key));
                return Array.isArray(value) ? value : fallback;
            } catch {
                return fallback;
            }
        }

        function writeList(key, value) {
            localStorage.setItem(key, JSON.stringify([...value]));
        }

        function confirmAction(title, text, onAccept) {
            modalTitle.textContent = title;
            modalText.textContent = text;
            modal.hidden = false;
            document.body.classList.add("modal-open");
            modalAccept.focus();

            const accept = () => {
                cleanup();
                onAccept();
            };

            const cancel = () => cleanup();

            const onKey = event => {
                if (event.key === "Escape") cancel();
            };

            const cleanup = () => {
                modal.hidden = true;
                document.body.classList.remove("modal-open");
                modalAccept.removeEventListener("click", accept);
                document.querySelectorAll("[data-modal-cancel]").forEach(button => button.removeEventListener("click", cancel));
                document.removeEventListener("keydown", onKey);
            };

            modalAccept.addEventListener("click", accept);
            document.querySelectorAll("[data-modal-cancel]").forEach(button => button.addEventListener("click", cancel));
            document.addEventListener("keydown", onKey);
        }

        function cleanDomain(value) {
            const cleaned = value.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/[^a-z0-9.-]/g, "").replace(/\.+/g, ".");
            if (!cleaned) return "hostongat.com";
            return cleaned.includes(".") ? cleaned : `${cleaned}.com`;
        }

        function splitDomain(domain) {
            const parts = domain.split(".");
            const extension = `.${parts.pop() || "com"}`;
            const name = parts.join("") || "brand";
            return { name, extension };
        }

        function priceFor(extension) {
            return tldPrices[extension] || { old: 999, price: 599 };
        }

        function makeSuggestions(domain) {
            const { name, extension } = splitDomain(domain);
            const base = name.replace(/[^a-z0-9]/g, "") || "brand";
            const alternatives = [
                `${base}.com`,
                `${base}.net`,
                `${base}.org`,
                `${base}.co`,
                `${base}.agency`,
                `${base}.studio`,
                `${base}.store`,
                `${base}online.com`,
                `get${base}.com`,
                `${base}digital.co`
            ];

            if (!alternatives.includes(`${base}${extension}`)) {
                alternatives.unshift(`${base}${extension}`);
            }

            return [...new Set(alternatives)].filter(item => item !== domain).map(item => {
                const ext = splitDomain(item).extension;
                return {
                    domain: item,
                    status: takenDomains.has(item) ? "taken" : "available",
                    ...priceFor(ext)
                };
            });
        }

        function domainCard(item, options = {}) {
            const available = item.status !== "taken";
            const fav = favourites.has(item.domain);
            const inCart = cart.has(item.domain);
            const action = available ? (inCart ? "In Bag" : "Buy now") : "Watch Domain";
            const save = Math.round(((item.old - item.price) / item.old) * 100);

            return `
                <article class="domain-card ${options.primary ? "primary-card" : ""} ${available ? "available" : "taken"}" data-domain="${item.domain}">
                    <div class="domain-row-main">
                        <div class="domain-name-row">
                        <button type="button" class="favourite-button ${fav ? "added" : ""}" data-favourite="${item.domain}" aria-label="Save ${item.domain}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.8 10.6 19.5C5.4 14.8 2 11.7 2 8a4.7 4.7 0 0 1 8.4-2.9L12 6.9l1.6-1.8A4.7 4.7 0 0 1 22 8c0 3.7-3.4 6.8-8.6 11.5L12 20.8Z"/></svg>
                        </button>
                            <h3>${item.domain}</h3>
                            <span class="domain-save">SAVE ${save}%</span>
                        </div>
                        ${available ? "" : "<p class=\"domain-note\">This name is registered. Try a close alternative or watch it.</p>"}
                    </div>
                    <div class="domain-buy-row">
                        <div class="domain-price">
                            <div>
                                <del>EGP ${item.old}</del>
                                <strong>EGP ${item.price}/1st yr</strong>
                            </div>
                            <div class="domain-term">
                                <span>For first year</span>
                                <div class="tooltip">
                                    <button type="button" aria-label="Pricing details">i</button>
                                    <div class="hidden-box">
                                        <div class="box">
                                            <h4>Pricing</h4>
                                            <p>Lower first-year pricing helps you get online. Renewal uses the standard yearly price plus applicable fees.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ${available ? `<button type="button" class="domain-action ${inCart ? "added" : ""}" data-cart="${item.domain}">${action}</button>` : `<button type="button" class="domain-action watch-action" data-watch="${item.domain}">${action}</button>`}
                    </div>
                </article>
            `;
        }

        function renderEmpty(target, title, text) {
            target.innerHTML = `
                <div class="empty-state">
                    <h3>${title}</h3>
                    <p>${text}</p>
                </div>
            `;
        }

        function renderResults(domain) {
            const exact = {
                domain,
                status: takenDomains.has(domain) ? "taken" : "available",
                ...priceFor(splitDomain(domain).extension)
            };
            lastSuggestions = makeSuggestions(domain);
            primaryResult.innerHTML = domainCard(exact, { primary: true });
            suggestedDomains.innerHTML = lastSuggestions.map(item => domainCard(item)).join("");
            renderFiltered();
            bindDomainButtons();
        }

        function renderHistory() {
            if (!history.length) {
                renderEmpty(historyList, "No history yet", "Search for a domain and it will appear here.");
                return;
            }

            historyList.innerHTML = history.map(domain => {
                const item = { domain, status: takenDomains.has(domain) ? "taken" : "available", ...priceFor(splitDomain(domain).extension) };
                return domainCard(item);
            }).join("");
            bindDomainButtons();
        }

        function renderFavourites() {
            const saved = [...favourites];
            favouriteCount.textContent = `${saved.length} saved`;
            if (!saved.length) {
                renderEmpty(favouriteList, "No favourites saved", "Use the heart button on any domain to keep it here.");
                return;
            }

            favouriteList.innerHTML = saved.map(domain => {
                const item = { domain, status: takenDomains.has(domain) ? "taken" : "available", ...priceFor(splitDomain(domain).extension) };
                return domainCard(item);
            }).join("");
            bindDomainButtons();
        }

        function renderFiltered() {
            const maxPrice = Number(priceRange.value);
            const maxLength = Number(lengthRange.value);
            const items = lastSuggestions.filter(item => {
                const extensionMatch = activeExtension === "all" || splitDomain(item.domain).extension === activeExtension;
                return extensionMatch && item.price <= maxPrice && splitDomain(item.domain).name.length <= maxLength;
            });

            if (!items.length) {
                renderEmpty(filteredDomains, "No matches for this filter", "Try a higher budget, a shorter extension list, or a longer name length.");
                return;
            }

            filteredDomains.innerHTML = items.map(item => domainCard(item)).join("");
            bindDomainButtons();
        }

        function bindDomainButtons() {
            document.querySelectorAll("[data-favourite]").forEach(button => {
                button.onclick = () => {
                    const domain = button.dataset.favourite;
                    const removing = favourites.has(domain);
                    confirmAction(
                        removing ? "Remove favourite?" : "Add to favourites?",
                        removing ? `${domain} will be removed from your saved domains.` : `${domain} will be saved to your favourites tab.`,
                        () => {
                            removing ? favourites.delete(domain) : favourites.add(domain);
                            writeList(storageKeys.favourites, favourites);
                            renderAll();
                        }
                    );
                };
            });

            document.querySelectorAll("[data-cart]").forEach(button => {
                button.onclick = () => {
                    const domain = button.dataset.cart;
                    const removing = cart.has(domain);
                    confirmAction(
                        removing ? "Remove from bag?" : "Add to bag?",
                        removing ? `${domain} will be removed from your bag.` : `${domain} will be added to your bag for checkout.`,
                        () => {
                            removing ? cart.delete(domain) : cart.add(domain);
                            writeList(storageKeys.bag, cart);
                            renderAll();
                        }
                    );
                };
            });

            document.querySelectorAll("[data-watch]").forEach(button => {
                button.onclick = () => {
                    const domain = button.dataset.watch;
                    confirmAction("Save watched domain?", `${domain} is taken. Save it to favourites so you can track it later.`, () => {
                        favourites.add(domain);
                        writeList(storageKeys.favourites, favourites);
                        renderAll();
                    });
                };
            });
        }

        function renderAll() {
            renderResults(currentQuery);
            renderHistory();
            renderFavourites();
        }

        function showTab(tabName) {
            if (!document.querySelector(`[data-tab="${tabName}"]`)) return;

            document.querySelectorAll(".tab-button").forEach(button => {
                const selected = button.dataset.tab === tabName;
                button.setAttribute("aria-selected", selected);
                button.closest(".filter").classList.toggle("selected", selected);
            });

            document.querySelectorAll(".filter-pages .c-page").forEach(panel => {
                panel.classList.toggle("true-page", panel.dataset.panel === tabName);
            });
        }

        searchForm.addEventListener("submit", event => {
            event.preventDefault();
            currentQuery = cleanDomain(searchInput.value);
            searchInput.value = currentQuery;
            history = [currentQuery, ...history.filter(item => item !== currentQuery)].slice(0, 8);
            writeList(storageKeys.history, history);
            renderAll();
            showTab("results");
        });

        document.querySelectorAll(".tab-button").forEach(button => {
            button.addEventListener("click", () => showTab(button.dataset.tab));
        });

        document.querySelectorAll("[data-extension]").forEach(button => {
            button.addEventListener("click", () => {
                const { name } = splitDomain(cleanDomain(searchInput.value));
                searchInput.value = `${name}${button.dataset.extension}`;
                searchForm.requestSubmit();
            });
        });

        document.querySelectorAll("[data-filter-extension]").forEach(button => {
            button.addEventListener("click", () => {
                document.querySelectorAll("[data-filter-extension]").forEach(item => item.classList.remove("active"));
                button.classList.add("active");
                activeExtension = button.dataset.filterExtension;
                renderFiltered();
            });
        });

        priceRange.addEventListener("input", () => {
            priceValue.textContent = `EGP ${priceRange.value}`;
            renderFiltered();
        });

        lengthRange.addEventListener("input", () => {
            lengthValue.textContent = `${lengthRange.value} characters`;
            renderFiltered();
        });

        document.getElementById("applyFilters").addEventListener("click", () => {
            renderFiltered();
            showTab("filter");
        });

        document.getElementById("clearHistory").addEventListener("click", () => {
            confirmAction("Clear search history?", "Your domain search history will be removed from this browser.", () => {
                history = [];
                writeList(storageKeys.history, history);
                renderHistory();
            });
        });

        searchInput.value = currentQuery;
        if (requestedDomain) {
            history = [currentQuery, ...history.filter(item => item !== currentQuery)].slice(0, 8);
            writeList(storageKeys.history, history);
        }
        renderAll();
        showTab(window.location.hash.replace("#", "") || "results");

        window.addEventListener("hashchange", () => {
            showTab(window.location.hash.replace("#", "") || "results");
        });

});

/* bag page */
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById("bagList")) return;
const list = document.getElementById("bagList");
        const bagCount = document.getElementById("bagCount");
        const bagTotal = document.getElementById("bagTotal");
        const summaryLines = document.getElementById("summaryLines");
        const summaryTotal = document.getElementById("summaryTotal");
        const checkoutButton = document.getElementById("checkoutButton");
        const modal = document.getElementById("actionModal");
        const modalTitle = document.getElementById("modalTitle");
        const modalText = document.getElementById("modalText");
        const modalAccept = document.getElementById("modalAccept");
        const keys = {
            domainBag: "hostongatDomainBag",
            favourites: "hostongatDomainFavourites",
            hostingBag: "hostongatHostingBag",
            emailBag: "hostongatEmailBag"
        };
        const domainPrices = {
            ".com": { old: 1099, price: 599 },
            ".net": { old: 999, price: 549 },
            ".org": { old: 949, price: 499 },
            ".co": { old: 1199, price: 799 },
            ".agency": { old: 1299, price: 899 },
            ".studio": { old: 1199, price: 749 },
            ".store": { old: 999, price: 399 },
            ".online": { old: 899, price: 349 }
        };
        const hostingCatalog = {
            "hosting-economy": { name: "Web Hosting Economy", price: 4033, detail: "1-year term, 25 GB NVMe storage" },
            "hosting-deluxe": { name: "Web Hosting Deluxe", price: 5791, detail: "1-year term, 10 websites" },
            "hosting-ultimate": { name: "Web Hosting Ultimate", price: 8648, detail: "1-year term, 25 websites" },
            "hosting-maximum": { name: "Web Hosting Maximum", price: 12687, detail: "1-year term, 50 websites" }
        };
        const emailCatalog = {
            "email-starter": { name: "Business Email Starter", price: 1788, detail: "12 months, one mailbox" },
            "email-plus": { name: "Business Email Plus", price: 2988, detail: "12 months, team-ready mailbox" },
            "email-pro": { name: "Business Email Pro", price: 4788, detail: "12 months, advanced mailboxes" }
        };
        let domainBag = new Set(readList(keys.domainBag, []));
        let hostingBag = new Set(readList(keys.hostingBag, []));
        let emailBag = new Set(readList(keys.emailBag, []));
        let favourites = new Set(readList(keys.favourites, []));

        function readList(key, fallback = []) {
            try {
                const value = JSON.parse(localStorage.getItem(key));
                return Array.isArray(value) ? value : fallback;
            } catch {
                return fallback;
            }
        }

        function writeList(key, value) {
            localStorage.setItem(key, JSON.stringify([...value]));
        }

        function splitDomain(domain) {
            const parts = domain.split(".");
            const extension = `.${parts.pop() || "com"}`;
            return { extension };
        }

        function priceForDomain(domain) {
            return domainPrices[splitDomain(domain).extension] || { old: 999, price: 599 };
        }

        function money(value) {
            return `EGP ${Math.round(value).toLocaleString()}`;
        }

        function confirmAction(title, text, onAccept) {
            modalTitle.textContent = title;
            modalText.textContent = text;
            modal.hidden = false;
            document.body.classList.add("modal-open");
            modalAccept.focus();
            const accept = () => { cleanup(); onAccept(); };
            const cancel = () => cleanup();
            const cleanup = () => {
                modal.hidden = true;
                document.body.classList.remove("modal-open");
                modalAccept.removeEventListener("click", accept);
                document.querySelectorAll("[data-modal-cancel]").forEach(button => button.removeEventListener("click", cancel));
            };
            modalAccept.addEventListener("click", accept);
            document.querySelectorAll("[data-modal-cancel]").forEach(button => button.addEventListener("click", cancel));
        }

        function allItems() {
            const domains = [...domainBag].map(domain => {
                const price = priceForDomain(domain);
                return { type: "domain", id: domain, name: domain, price: price.price, old: price.old, detail: "Domain registration, first year" };
            });
            const hosting = [...hostingBag].map(id => ({ type: "hosting", id, ...hostingCatalog[id] })).filter(item => item.name);
            const emails = [...emailBag].map(id => ({ type: "email", id, ...emailCatalog[id] })).filter(item => item.name);
            return [...domains, ...hosting, ...emails];
        }

        function card(item) {
            const fav = favourites.has(item.id);
            const removable = `data-remove-type="${item.type}" data-remove-id="${item.id}"`;
            return `
                <article class="domain-card available">
                    ${item.type === "domain" ? `<button type="button" class="favourite-button ${fav ? "added" : ""}" data-favourite="${item.id}" aria-label="Save ${item.id}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.8 10.6 19.5C5.4 14.8 2 11.7 2 8a4.7 4.7 0 0 1 8.4-2.9L12 6.9l1.6-1.8A4.7 4.7 0 0 1 22 8c0 3.7-3.4 6.8-8.6 11.5L12 20.8Z"/></svg></button>` : ""}
                    <div>
                        <div class="domain-status"><span>${item.type}</span></div>
                        <div class="domain-name-row"><h3>${item.name}</h3><span class="status-dot"></span></div>
                        <p class="domain-note">${item.detail}</p>
                        <div class="domain-price">${item.old ? `<del>EGP ${item.old}</del>` : ""}<strong>${money(item.price)}</strong><span>due today</span></div>
                    </div>
                    <button type="button" class="domain-action added" ${removable}>Remove</button>
                </article>
            `;
        }

        function render() {
            const items = allItems();
            const total = items.reduce((sum, item) => sum + item.price, 0);
            bagCount.textContent = items.length;
            bagTotal.textContent = money(total);
            summaryTotal.textContent = money(total);
            checkoutButton.classList.toggle("disabled", !items.length);
            if (!items.length) {
                list.innerHTML = `<div class="empty-state"><h3>Your bag is empty</h3><p>Add a domain, hosting plan, or email plan to continue the buyer journey.</p></div>`;
                summaryLines.innerHTML = `<p class="summary-empty">No products selected yet.</p>`;
                return;
            }
            list.innerHTML = items.map(card).join("");
            const groups = [
                ["Domains", [...domainBag].length],
                ["Hosting", [...hostingBag].length],
                ["Emails", [...emailBag].length]
            ];
            summaryLines.innerHTML = groups.map(([label, count]) => `<div><span>${label}</span><strong>${count}</strong></div>`).join("");
            bindActions();
        }

        function bindActions() {
            document.querySelectorAll("[data-remove-type]").forEach(button => {
                button.onclick = () => {
                    const type = button.dataset.removeType;
                    const id = button.dataset.removeId;
                    confirmAction("Remove product?", `${id} will be removed from your bag.`, () => {
                        if (type === "domain") {
                            domainBag.delete(id);
                            writeList(keys.domainBag, domainBag);
                        }
                        if (type === "hosting") {
                            hostingBag.delete(id);
                            writeList(keys.hostingBag, hostingBag);
                        }
                        if (type === "email") {
                            emailBag.delete(id);
                            writeList(keys.emailBag, emailBag);
                        }
                        render();
                    });
                };
            });

            document.querySelectorAll("[data-favourite]").forEach(button => {
                button.onclick = () => {
                    const domain = button.dataset.favourite;
                    const removing = favourites.has(domain);
                    confirmAction(removing ? "Remove favourite?" : "Add to favourites?", removing ? `${domain} will be removed from favourites.` : `${domain} will be saved to favourites.`, () => {
                        removing ? favourites.delete(domain) : favourites.add(domain);
                        writeList(keys.favourites, favourites);
                        render();
                    });
                };
            });
        }

        document.getElementById("clearBag").addEventListener("click", () => {
            confirmAction("Clear bag?", "All domains, hosting plans, and email plans will be removed from your bag.", () => {
                domainBag.clear();
                hostingBag.clear();
                emailBag.clear();
                writeList(keys.domainBag, domainBag);
                writeList(keys.hostingBag, hostingBag);
                writeList(keys.emailBag, emailBag);
                render();
            });
        });

        checkoutButton.addEventListener("click", event => {
            if (!allItems().length) event.preventDefault();
        });

        render();

});

/* checkout page */
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById("checkoutForm")) return;
const summaryLines = document.getElementById("summaryLines");
        const summaryTotal = document.getElementById("summaryTotal");
        const form = document.getElementById("checkoutForm");
        const keys = {
            domainBag: "hostongatDomainBag",
            hostingBag: "hostongatHostingBag",
            emailBag: "hostongatEmailBag",
            lastOrder: "hostongatLastOrder",
            orders: "hostongatOrders",
            services: "hostongatServices",
            session: "hostongatSession"
        };
        const domainPrices = { ".com": 599, ".net": 549, ".org": 499, ".co": 799, ".agency": 899, ".studio": 749, ".store": 399, ".online": 349 };
        const hostingCatalog = {
            "hosting-economy": { name: "Web Hosting Economy", price: 4033 },
            "hosting-deluxe": { name: "Web Hosting Deluxe", price: 5791 },
            "hosting-ultimate": { name: "Web Hosting Ultimate", price: 8648 },
            "hosting-maximum": { name: "Web Hosting Maximum", price: 12687 }
        };
        const emailCatalog = {
            "email-starter": { name: "Business Email Starter", price: 1788 },
            "email-plus": { name: "Business Email Plus", price: 2988 },
            "email-pro": { name: "Business Email Pro", price: 4788 }
        };

        function readList(key) {
            try {
                const value = JSON.parse(localStorage.getItem(key));
                return Array.isArray(value) ? value : [];
            } catch {
                return [];
            }
        }

        function readObject(key) {
            try {
                const value = JSON.parse(localStorage.getItem(key));
                return value && typeof value === "object" ? value : null;
            } catch {
                return null;
            }
        }

        function money(value) {
            return `EGP ${Math.round(value).toLocaleString()}`;
        }

        function domainPrice(domain) {
            const parts = domain.split(".");
            const extension = `.${parts.pop() || "com"}`;
            return domainPrices[extension] || 599;
        }

        function items() {
            const domains = readList(keys.domainBag).map(domain => ({ type: "Domain", name: domain, price: domainPrice(domain) }));
            const hosting = readList(keys.hostingBag).map(id => ({ type: "Hosting", ...hostingCatalog[id] })).filter(item => item.name);
            const emails = readList(keys.emailBag).map(id => ({ type: "Email", ...emailCatalog[id] })).filter(item => item.name);
            return [...domains, ...hosting, ...emails];
        }

        function render() {
            const orderItems = items();
            if (!orderItems.length) {
                window.location.href = "../../bag.html";
                return;
            }
            const total = orderItems.reduce((sum, item) => sum + item.price, 0);
            summaryTotal.textContent = money(total);
            summaryLines.innerHTML = orderItems.map(item => `<div><span>${item.type}: ${item.name}</span><strong>${money(item.price)}</strong></div>`).join("");
        }

        form.addEventListener("submit", event => {
            event.preventDefault();
            const orderItems = items();
            const total = orderItems.reduce((sum, item) => sum + item.price, 0);
            const data = Object.fromEntries(new FormData(form).entries());
            const session = readObject(keys.session);
            const order = {
                id: `HST-${Date.now()}`,
                createdAt: new Date().toISOString(),
                status: "Processing",
                ownerEmail: session?.email || data.email,
                buyer: data,
                items: orderItems,
                total
            };
            const services = orderItems.map((item, index) => ({
                id: `${order.id}-${index + 1}`,
                orderId: order.id,
                type: item.type,
                name: item.name,
                price: item.price,
                status: "Active",
                renewal: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                autoRenew: true,
                ownerEmail: order.ownerEmail
            }));
            localStorage.setItem(keys.lastOrder, JSON.stringify(order));
            localStorage.setItem(keys.orders, JSON.stringify([order, ...readList(keys.orders)]));
            localStorage.setItem(keys.services, JSON.stringify([...services, ...readList(keys.services)]));
            localStorage.removeItem(keys.domainBag);
            localStorage.removeItem(keys.hostingBag);
            localStorage.removeItem(keys.emailBag);
            window.location.href = "order-success.html";
        });

        render();

});

/* order success page */
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById("orderId")) return;
try {
            const order = JSON.parse(localStorage.getItem("hostongatLastOrder"));
            if (order) {
                document.getElementById("successMessage").textContent = `Order ${order.id} was received with ${order.items.length} product(s). Total today: EGP ${Math.round(order.total).toLocaleString()}.`;
            }
        } catch {}

});

/* hosting products */
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector("[data-product-type='hosting']")) return;
const hostingCatalog = {
            "hosting-economy": "Web Hosting Economy",
            "hosting-deluxe": "Web Hosting Deluxe",
            "hosting-ultimate": "Web Hosting Ultimate",
            "hosting-maximum": "Web Hosting Maximum"
        };
        const hostingBagKey = "hostongatHostingBag";
        const purchaseModal = document.getElementById("purchaseModal");
        const purchaseText = document.getElementById("purchaseModalText");
        const purchaseAccept = document.getElementById("purchaseAccept");

        function readBag() {
            try {
                const value = JSON.parse(localStorage.getItem(hostingBagKey));
                return Array.isArray(value) ? value : [];
            } catch {
                return [];
            }
        }

        function writeBag(items) {
            localStorage.setItem(hostingBagKey, JSON.stringify([...new Set(items)]));
        }

        function confirmPurchase(text, onAccept) {
            purchaseText.textContent = text;
            purchaseModal.hidden = false;
            purchaseAccept.focus();
            const accept = () => { cleanup(); onAccept(); };
            const cancel = () => cleanup();
            const cleanup = () => {
                purchaseModal.hidden = true;
                purchaseAccept.removeEventListener("click", accept);
                document.querySelectorAll("[data-purchase-cancel]").forEach(button => button.removeEventListener("click", cancel));
            };
            purchaseAccept.addEventListener("click", accept);
            document.querySelectorAll("[data-purchase-cancel]").forEach(button => button.addEventListener("click", cancel));
        }

        document.querySelectorAll("[data-product-type='hosting']").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                const productId = button.dataset.productId;
                confirmPurchase(`${hostingCatalog[productId]} will be added to your bag.`, () => {
                    const items = readBag();
                    writeBag([...items, productId]);
                    window.location.href = "../../bag.html";
                });
            });
        });

});

/* email products */
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector("[data-product-type='email']")) return;
const emailCatalog = {
            "email-starter": "Business Email Starter",
            "email-plus": "Business Email Plus",
            "email-pro": "Business Email Pro"
        };
        const emailBagKey = "hostongatEmailBag";
        const purchaseModal = document.getElementById("purchaseModal");
        const purchaseText = document.getElementById("purchaseModalText");
        const purchaseAccept = document.getElementById("purchaseAccept");

        function readBag() {
            try {
                const value = JSON.parse(localStorage.getItem(emailBagKey));
                return Array.isArray(value) ? value : [];
            } catch {
                return [];
            }
        }

        function writeBag(items) {
            localStorage.setItem(emailBagKey, JSON.stringify([...new Set(items)]));
        }

        function confirmPurchase(text, onAccept) {
            purchaseText.textContent = text;
            purchaseModal.hidden = false;
            purchaseAccept.focus();
            const accept = () => { cleanup(); onAccept(); };
            const cancel = () => cleanup();
            const cleanup = () => {
                purchaseModal.hidden = true;
                purchaseAccept.removeEventListener("click", accept);
                document.querySelectorAll("[data-purchase-cancel]").forEach(button => button.removeEventListener("click", cancel));
            };
            purchaseAccept.addEventListener("click", accept);
            document.querySelectorAll("[data-purchase-cancel]").forEach(button => button.addEventListener("click", cancel));
        }

        document.querySelectorAll("[data-product-type='email']").forEach(button => {
            button.addEventListener("click", () => {
                const productId = button.dataset.productId;
                confirmPurchase(`${emailCatalog[productId]} will be added to your bag.`, () => {
                    const items = readBag();
                    writeBag([...items, productId]);
                    window.location.href = "../../bag.html";
                });
            });
        });

        document.querySelectorAll(".domain-search button").forEach(button => {
            button.addEventListener("click", event => {
                event.preventDefault();
                const input = button.closest(".domain-search").querySelector("input");
                const value = input.value.trim() || "yourbrand.com";
                window.location.href = `../domainsearch/domainsearch.html?domain=${encodeURIComponent(value)}`;
            });
        });

});
