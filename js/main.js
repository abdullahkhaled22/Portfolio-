/**
 * Abdullah Khaled Abdelrazik - Data Analyst & BI Specialist Portfolio
 * Interactive Front-End Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initNavbar();
  initParticleBackground();
  initStatsCounter();
  initProjectFilter();
  initProjectModal();
  initCertificateModal();
  initContactForm();
  initCopyButtons();
});

/* ----------------------------------------------------
 * 1. NAVBAR & NAVIGATION SPY
 * ---------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scroll glass blur effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-lg', 'bg-slate-950/90');
      navbar.classList.remove('bg-slate-950/60');
    } else {
      navbar.classList.remove('shadow-lg', 'bg-slate-950/90');
      navbar.classList.add('bg-slate-950/60');
    }

    // Active link highlighting on scroll
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('text-cyan-400', 'font-semibold');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-cyan-400', 'font-semibold');
      }
    });
  });

  // Mobile menu toggle
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
      }
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
      });
    });
  }
}

/* ----------------------------------------------------
 * 2. INTERACTIVE HERO DATA-CONSTELLATION CANVAS
 * ---------------------------------------------------- */
function initParticleBackground() {
  const canvas = document.getElementById('hero-particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;
  const maxDistance = 120;
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = width;
    canvas.height = height;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(6, 182, 212, ' : 'rgba(16, 185, 129, ';
      this.alpha = Math.random() * 0.6 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion/interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * 2.5;
          this.y -= (dy / distance) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ----------------------------------------------------
 * 3. ANIMATED METRICS / STATS COUNTER
 * ---------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach((stat) => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const suffix = stat.getAttribute('data-suffix') || '';
          let current = 0;
          const increment = Math.ceil(target / 40);
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            stat.textContent = current + suffix;
          }, 35);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats-strip');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ----------------------------------------------------
 * 4. PROJECT DATA & FILTER ENGINE
 * ---------------------------------------------------- */
const projectsData = [
  {
    id: 'finance-bi',
    title: 'Executive Financial Performance & Profitability Dashboard',
    subtitle: 'Comprehensive P&L Analysis, Margin Optimization & Variance Tracking',
    category: 'powerbi finance',
    image: './projects/Finance project/Finance.jpg',
    tags: ['Power BI', 'DAX', 'Microsoft Excel', 'Financial Modeling', 'KPI Tracking'],
    problem: 'Management lacked a single-pane executive view to track gross margins, operational expenses, profit trends, and budget variances across departments and quarters.',
    solution: 'Designed a dynamic star-schema data model in Power BI with complex DAX measures (Time Intelligence, YoY growth, variance calculations) and clean drill-through visuals for executive stakeholders.',
    impact: 'Accelerated quarterly reporting cycles by 65% and provided instant visibility into high-margin products and cost anomalies.',
    features: [
      'Interactive P&L statement breakdown with dynamic filtering',
      'YoY & MoM Revenue, Net Profit, and Operating Margin calculations',
      'Cost center variance analysis against scheduled budgets',
      'Automated data refresh pipeline from cleaned Excel ledgers'
    ]
  },
  {
    id: 'hr-workforce',
    title: 'HR Workforce Analytics & Employee Retention Dashboard',
    subtitle: 'Talent Demographics, Attrition Rate Forecasting & Departmental Metrics',
    category: 'powerbi hr',
    image: './projects/Finance project/Hr dashboard.jpg',
    galleryImages: [
      './projects/Finance project/Hr dashboard.jpg',
      './projects/Finance project/Hr project.jpg'
    ],
    tags: ['Power BI', 'Power Query', 'HR Analytics', 'Data Cleansing', 'KPI Cards'],
    problem: 'Human Resources needed actionable insights into employee turnover rates, department performance, tenure distribution, and compensation equity to reduce costly talent attrition.',
    solution: 'Engineered an end-to-end HR dashboard tracking attrition rate by department, salary bands, promotion timelines, and job satisfaction ratings with proactive risk indicators.',
    impact: 'Identified critical attrition bottlenecks in mid-tier roles and provided department heads with concrete data to optimize retention strategies.',
    features: [
      'Dynamic Attrition % calculation using active employee vs. exit dates',
      'Demographic analysis (Age, Gender, Education, Performance ratings)',
      'Salary band vs. experience benchmarking visual matrix',
      'Departmental turnover drill-through matrix'
    ]
  },
  {
    id: 'sales-omnichannel',
    title: 'Omnichannel Retail Sales & Revenue Growth Intelligence',
    subtitle: 'Cross-Regional Sales Performance, Product Tiering & Customer Lifetime Value',
    category: 'powerbi sales',
    image: './projects/Finance project/sales_project.jpg',
    galleryImages: [
      './projects/Finance project/sales_project.jpg',
      './projects/Finance project/sales project part1.jpg',
      './projects/Finance project/Sales project part 2.jpg',
      './projects/Finance project/Sales project.jpg',
      './projects/Finance project/sales_prooject!.jpg'
    ],
    tags: ['Power BI', 'SQL Queries', 'Data Modeling', 'Sales Analytics', 'Geographic Mapping'],
    problem: 'Sales leadership struggled to monitor multi-channel revenue streams, top-performing product categories, regional sales quotas, and discount leakages across quarters.',
    solution: 'Built an integrated sales intelligence engine connecting transactional sales data, regional distribution maps, and customer RFM metrics into an interactive dashboard.',
    impact: 'Uncovered a 22% sales concentration in top 3 product lines and enabled territory managers to realign field efforts towards high-growth territories.',
    features: [
      'Real-time revenue, order volume, and average order value (AOV) tracking',
      'Geographic heat map analyzing regional target vs. actual performance',
      'Product category Pareto analysis (80/20 rule identification)',
      'Quarterly trend forecasting and historical seasonal pattern analysis'
    ]
  },
  {
    id: 'ecommerce-customer-segmentation',
    title: 'E-Commerce Customer Behavior & RFM Segmentation',
    subtitle: 'Cohort Analysis, Purchase Frequency & Customer Lifetime Value (CLV)',
    category: 'powerbi sales sql',
    image: './projects/Finance project/Sales project part 2.jpg',
    tags: ['Power BI', 'SQL', 'Customer Segmentation', 'DAX', 'Excel'],
    problem: 'Marketing and sales teams lacked visibility into customer repeat purchase behavior, high-value customer clusters, and churn risks.',
    solution: 'Implemented RFM (Recency, Frequency, Monetary) segmentation model using SQL queries for ETL and Power BI for executive cohort visualizations.',
    impact: 'Empowered marketing teams to launch targeted re-engagement campaigns for at-risk churn accounts, improving repeat order rates.',
    features: [
      'RFM scoring algorithms translating transaction history into actionable customer tiers',
      'Cohort retention heatmaps tracking repeat purchase curves over months',
      'Discount sensitivity vs. profit margin correlation charts',
      'Interactive customer profile lookup and purchase history drilldown'
    ]
  },
  {
    id: 'sales-distribution-engine',
    title: 'Commercial Sales & Distribution Performance Engine',
    subtitle: 'Channel Partner Performance, Inventory Velocity & Target Achievement',
    category: 'powerbi sales',
    image: './projects/Finance project/sales project part1.jpg',
    tags: ['Power BI', 'Power Query', 'ETL Automation', 'KPI Dashboard'],
    problem: 'Disparate data sources from distributors and retail outlets caused delayed visibility into sell-out rates and regional distributor targets.',
    solution: 'Constructed an automated ETL data pipeline via Power Query to clean, normalize, and load daily distributor reports into an executive Power BI dashboard.',
    impact: 'Reduced data consolidation turnaround from 3 days to under 5 minutes with automated scheduled refresh.',
    features: [
      'Distributor quota achievement gauge and leaderboard metrics',
      'Stock replenishment velocity and slow-moving SKU indicators',
      'Dynamic currency and regional hierarchy slicers',
      'Automated anomaly detection alerts for underperforming zones'
    ]
  }
];

function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          card.classList.add('block');
        } else {
          card.classList.add('hidden');
          card.classList.remove('block');
        }
      });
    });
  });
}

/* ----------------------------------------------------
 * 5. PROJECT DETAIL MODAL / LIGHTBOX
 * ---------------------------------------------------- */
function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const openButtons = document.querySelectorAll('.view-project-btn');

  if (!modal) return;

  function openModal(projectId) {
    const project = projectsData.find((p) => p.id === projectId);
    if (!project) return;

    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-subtitle').textContent = project.subtitle;
    document.getElementById('modal-img').src = project.image;
    document.getElementById('modal-img').alt = project.title;
    document.getElementById('modal-problem').textContent = project.problem;
    document.getElementById('modal-solution').textContent = project.solution;
    document.getElementById('modal-impact').textContent = project.impact;

    // Tags
    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = '';
    project.tags.forEach((tag) => {
      const span = document.createElement('span');
      span.className = 'px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60';
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });

    // Features list
    const featuresContainer = document.getElementById('modal-features');
    featuresContainer.innerHTML = '';
    project.features.forEach((feat) => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-2 text-slate-300 text-sm';
      li.innerHTML = `<span class="text-emerald-400 mt-0.5">✓</span> <span>${feat}</span>`;
      featuresContainer.appendChild(li);
    });

    // Gallery / thumbnails if available
    const galleryContainer = document.getElementById('modal-gallery');
    if (galleryContainer) {
      galleryContainer.innerHTML = '';
      if (project.galleryImages && project.galleryImages.length > 1) {
        galleryContainer.classList.remove('hidden');
        project.galleryImages.forEach((imgSrc) => {
          const thumb = document.createElement('img');
          thumb.src = imgSrc;
          thumb.alt = 'Dashboard View';
          thumb.className = 'w-20 h-14 object-cover rounded-lg border border-slate-700 hover:border-cyan-400 cursor-pointer transition-all';
          thumb.addEventListener('click', () => {
            document.getElementById('modal-img').src = imgSrc;
          });
          galleryContainer.appendChild(thumb);
        });
      } else {
        galleryContainer.classList.add('hidden');
      }
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  openButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project-id');
      openModal(projectId);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ----------------------------------------------------
 * 6. CERTIFICATES & CREDENTIALS MODAL
 * ---------------------------------------------------- */
function initCertificateModal() {
  const certModal = document.getElementById('cert-modal');
  const certCloseBtn = document.getElementById('cert-close-btn');
  const certBackdrop = document.getElementById('cert-backdrop');
  const viewCertButtons = document.querySelectorAll('.view-cert-btn');

  if (!certModal) return;

  function openCertModal(title, issuer, filePath, fileType) {
    document.getElementById('cert-modal-title').textContent = title;
    document.getElementById('cert-modal-issuer').textContent = issuer;

    const previewContainer = document.getElementById('cert-modal-preview');
    const downloadBtn = document.getElementById('cert-download-link');

    downloadBtn.href = filePath;
    downloadBtn.setAttribute('download', '');

    if (fileType === 'pdf') {
      previewContainer.innerHTML = `
        <div class="w-full h-[520px] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-4">
          <iframe src="${filePath}" class="w-full h-full rounded-lg" frameborder="0"></iframe>
        </div>
      `;
    } else {
      previewContainer.innerHTML = `
        <div class="w-full flex items-center justify-center p-2 bg-slate-900/80 rounded-xl border border-slate-800">
          <img src="${filePath}" alt="${title}" class="max-h-[500px] w-auto max-w-full object-contain rounded-lg shadow-2xl">
        </div>
      `;
    }

    certModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCertModal() {
    certModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  viewCertButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-cert-title');
      const issuer = btn.getAttribute('data-cert-issuer');
      const filePath = btn.getAttribute('data-cert-file');
      const fileType = btn.getAttribute('data-cert-type') || 'pdf';
      openCertModal(title, issuer, filePath, fileType);
    });
  });

  if (certCloseBtn) certCloseBtn.addEventListener('click', closeCertModal);
  if (certBackdrop) certBackdrop.addEventListener('click', closeCertModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains('active')) {
      closeCertModal();
    }
  });
}



/* ----------------------------------------------------
 * 8. CONTACT FORM & WHATSAPP GENERATOR
 * ---------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const projectType = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please fill in all required fields.', 'error');
      return;
    }

    // Build WhatsApp Message Link as instant option
    const waText = encodeURIComponent(
      `Hello Abdullah! My name is ${name} (${email}).\nI am reaching out regarding: ${projectType}.\n\nMessage:\n${message}`
    );
    const waUrl = `https://wa.me/201012645169?text=${waText}`;

    // Prompt user to open WhatsApp or send via default mail client
    showToast('🚀 Thank you! Redirecting to Abdullah Khaled on WhatsApp...', 'success');

    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 800);

    form.reset();
  });
}

/* ----------------------------------------------------
 * 9. CLIPBOARD HELPER & TOAST NOTIFICATIONS
 * ---------------------------------------------------- */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy-text');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`📋 Copied "${textToCopy}" to clipboard!`, 'success');
      }).catch(() => {
        showToast('Failed to copy to clipboard', 'error');
      });
    });
  });
}

function showToast(message, type = 'success') {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl border font-medium text-sm shadow-2xl flex items-center gap-3 toast-notification';
    document.body.appendChild(toast);
  }

  if (type === 'success') {
    toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl border font-medium text-sm shadow-2xl flex items-center gap-3 toast-notification bg-slate-900 border-cyan-500/50 text-cyan-200 show';
  } else {
    toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl border font-medium text-sm shadow-2xl flex items-center gap-3 toast-notification bg-slate-900 border-red-500/50 text-red-200 show';
  }

  toast.innerHTML = `<span>${message}</span>`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
