/**
 * AutoMaster PRO — Main Client Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const bookingModal = document.getElementById('bookingModal');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const serviceComment = document.getElementById('serviceComment');
  const selectedServiceInput = document.getElementById('selectedServiceInput');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const bookingForm = document.getElementById('bookingForm');
  const quickHeroForm = document.getElementById('quickHeroForm');
  const toast = document.getElementById('toastNotification');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');
  const bookingDateInput = document.getElementById('bookingDate');

  // Set minimum date for booking to today
  if (bookingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;
  }

  /* -------------------------------------------------------------------------
     1. Sticky Header & Active Nav Tracking
     ------------------------------------------------------------------------- */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* -------------------------------------------------------------------------
     2. Mobile Menu Toggle
     ------------------------------------------------------------------------- */
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close when clicking nav links
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  /* -------------------------------------------------------------------------
     3. Services Category Filter
     ------------------------------------------------------------------------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* -------------------------------------------------------------------------
     4. Interactive Cost Calculator
     ------------------------------------------------------------------------- */
  const carTypeCards = document.querySelectorAll('.car-type-card');
  const calcCheckboxes = document.querySelectorAll('.calc-service-cb');
  const calcItemsCount = document.getElementById('calcItemsCount');
  const calcBasePrice = document.getElementById('calcBasePrice');
  const calcDiscount = document.getElementById('calcDiscount');
  const calcFinalPrice = document.getElementById('calcFinalPrice');
  const calcOrderBtn = document.getElementById('calcOrderBtn');

  function formatRubles(val) {
    return new Intl.NumberFormat('ru-RU').format(Math.round(val)) + ' ₽';
  }

  function updateCalculator() {
    let multiplier = 1.0;
    const selectedCar = document.querySelector('input[name="carType"]:checked');
    if (selectedCar) {
      multiplier = parseFloat(selectedCar.getAttribute('data-multiplier')) || 1.0;
    }

    let rawTotal = 0;
    let selectedCount = 0;
    const selectedServiceNames = [];

    calcCheckboxes.forEach(cb => {
      const card = cb.closest('.calc-checkbox-card');
      if (cb.checked) {
        card.classList.add('selected');
        const price = parseFloat(cb.getAttribute('data-price')) || 0;
        rawTotal += price;
        selectedCount++;
        const title = card.querySelector('.cb-title')?.textContent.trim();
        if (title) selectedServiceNames.push(title);
      } else {
        card.classList.remove('selected');
      }
    });

    const calculatedBase = rawTotal * multiplier;
    const discountVal = calculatedBase * 0.10; // 10% discount
    const finalAmount = calculatedBase - discountVal;

    // Word conjugation for Russian "1 услуга / 2 услуги / 5 услуг"
    let word = 'услуг';
    if (selectedCount % 10 === 1 && selectedCount % 100 !== 11) {
      word = 'услуга';
    } else if ([2, 3, 4].includes(selectedCount % 10) && ![12, 13, 14].includes(selectedCount % 100)) {
      word = 'услуги';
    }

    if (calcItemsCount) calcItemsCount.textContent = `${selectedCount} ${word}`;
    if (calcBasePrice) calcBasePrice.textContent = formatRubles(calculatedBase);
    if (calcDiscount) calcDiscount.textContent = '-' + formatRubles(discountVal);
    if (calcFinalPrice) calcFinalPrice.textContent = formatRubles(finalAmount);

    // Update order button data attribute with summary
    if (calcOrderBtn) {
      const summaryText = `Калькулятор (${selectedCount} поз., итог ~${formatRubles(finalAmount)}): ${selectedServiceNames.join(', ')}`;
      calcOrderBtn.setAttribute('data-service', summaryText);
    }
  }

  // Car type selection listener
  carTypeCards.forEach(card => {
    card.addEventListener('click', () => {
      carTypeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      updateCalculator();
    });
  });

  // Services checkboxes listener
  calcCheckboxes.forEach(cb => {
    cb.addEventListener('change', updateCalculator);
  });

  // Initial calculation
  updateCalculator();

  /* -------------------------------------------------------------------------
     5. Modal Window Booking & Triggering
     ------------------------------------------------------------------------- */
  function openModal(serviceName = 'Запись на сервис') {
    if (!bookingModal) return;
    bookingModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (modalTitle) {
      modalTitle.textContent = 'Запись на обслуживание';
    }
    if (selectedServiceInput) {
      selectedServiceInput.value = serviceName;
    }
    if (serviceComment && serviceName && serviceName !== 'Общая консультация и запись') {
      serviceComment.value = `Услуга: ${serviceName}`;
    }
  }

  function closeModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || 'Запись на сервис';
      openModal(service);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('open')) {
      closeModal();
    }
  });

  /* -------------------------------------------------------------------------
     6. Toast Notifications & Forms Submission
     ------------------------------------------------------------------------- */
  function showToast(title, message) {
    if (!toast) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastMessage) toastMessage.textContent = message;

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  // Booking Modal Form Submit
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName')?.value || 'Клиент';
      const phone = document.getElementById('clientPhone')?.value || '';
      const car = document.getElementById('carBrand')?.value || '';

      // In real scenario, here goes fetch/AJAX request to CRM / Telegram bot
      console.log('Заявка на запись:', { name, phone, car, comment: serviceComment?.value });

      closeModal();
      bookingForm.reset();
      showToast('Заявка успешно принята!', `Спасибо, ${name}! Мы свяжемся с вами в течение 5 минут для подтверждения брони.`);
    });
  }

  // Hero Quick Form Submit
  if (quickHeroForm) {
    quickHeroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('heroName')?.value || 'Клиент';
      const phone = document.getElementById('heroPhone')?.value || '';
      const car = document.getElementById('heroCar')?.value || '';

      console.log('Быстрая заявка из Hero:', { name, phone, car });
      quickHeroForm.reset();
      showToast('Вы забронировали скидку 10%!', `Спасибо, ${name}! Мастер перезвонит на номер ${phone} через пару минут.`);
    });
  }

  /* -------------------------------------------------------------------------
     7. FAQ Accordion
     ------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
  });

  /* -------------------------------------------------------------------------
     8. Simple Phone Formatting
     ------------------------------------------------------------------------- */
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach(input => {
    input.addEventListener('focus', () => {
      if (!input.value) {
        input.value = '+7 ';
      }
    });

    input.addEventListener('blur', () => {
      if (input.value === '+7 ' || input.value === '+7') {
        input.value = '';
      }
    });
  });
});
