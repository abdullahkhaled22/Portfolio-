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
      // Reset to default state
      link.classList.remove('text-cyan-400', 'font-semibold', 'bg-slate-800/60');
      link.classList.add('text-slate-300');
      // Set active state
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.remove('text-slate-300');
        link.classList.add('text-cyan-400', 'font-semibold', 'bg-slate-800/60');
      }
    });
  });

  // Mobile Left-Side Drawer
  const mobileDrawerOverlay = document.getElementById('mobile-drawer-overlay');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('-translate-x-full');
    mobileMenu.classList.add('translate-x-0');
    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.classList.remove('opacity-0', 'pointer-events-none');
      mobileDrawerOverlay.classList.add('opacity-100', 'pointer-events-auto');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('-translate-x-full');
    mobileMenu.classList.remove('translate-x-0');
    if (mobileDrawerOverlay) {
      mobileDrawerOverlay.classList.add('opacity-0', 'pointer-events-none');
      mobileDrawerOverlay.classList.remove('opacity-100', 'pointer-events-auto');
    }
    document.body.style.overflow = 'auto';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMobileMenu();
    });
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeMobileMenu);
  }

  if (mobileDrawerOverlay) {
    mobileDrawerOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close menu when clicking any nav link inside drawer
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
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
    title: 'HR Analytics & Workforce Performance Dashboard',
    subtitle: 'Talent Demographics, Attrition Rate Forecasting & Departmental Metrics in Excel',
    category: 'excel hr',
    image: './projects/Finance project/Hr dashboard.jpg',
    galleryImages: [
      './projects/Finance project/Hr dashboard.jpg',
      './projects/Finance project/Hr project.jpg'
    ],
    tags: ['Microsoft Excel', 'Excel Slicers', 'Pivot Tables', 'HR Analytics', 'Workforce KPIs'],
    problem: 'Human Resources leadership needed actionable insights into employee turnover rates, promotion eligibility, tenure distribution, and salary equity using an intuitive Excel analytics system.',
    solution: 'Engineered an interactive bilingual HR management dashboard in Microsoft Excel utilizing Pivot Tables, custom calculated fields, dynamic timeline and departmental slicers, and structured data models.',
    impact: 'Streamlined HR reporting, isolated critical promotion bottlenecks (4.5% due vs. 95.5% not due across 1,470+ employees), and tracked retrenchment indicators (8%) to drive talent retention.',
    features: [
      'Built in Microsoft Excel: Dynamic cross-filtering slicers (Age Groups, Departments, Status)',
      '1,470+ Active employee records analyzed across service years (1 to 10 years) and job levels (1 to 5)',
      'Promotion eligibility tracking (66 due for promotion vs. 1.404K not due)',
      'Bilingual Arabic & English dashboard layouts analyzing departments, qualifications, and age brackets'
    ]
  },
  {
    id: 'callcenter-performance',
    title: 'Call Center Performance & Agent Analytics Dashboard',
    subtitle: 'Customer Satisfaction, SLA Compliance, Speed of Answer & Agent Scorecards in Excel',
    category: 'excel operations',
    image: './projects/Call center project/Call center performance.png',
    galleryImages: [
      './projects/Call center project/Call center performance.png'
    ],
    tags: ['Microsoft Excel', 'Pivot Tables & Charts', 'Excel Slicers', 'Call Center KPIs', 'Agent Scorecards'],
    problem: 'Customer support supervisors needed real-time visibility into incoming call volumes, agent speed of answer, first-contact resolution, and customer satisfaction without complex software overhead.',
    solution: 'Built an executive dark-themed Call Center Performance Dashboard in Microsoft Excel utilizing Pivot Tables, multi-criteria slicers (Agent, Day of Week, Month), and custom KPI cards.',
    impact: 'Tracked 5,000 incoming calls with an 81% answer rate, identified average answer speed (67.5s) and average talk time (3.7 min), and established individual agent satisfaction benchmarks up to 3.85 / 5.0.',
    features: [
      'Built in Microsoft Excel: Dynamic slicers for 8 Agents, 7 Days of the week, and Months',
      'Core Executive KPIs: 5,000 Total Calls, 3.4/5.0 Overall Satisfaction, 90% Answered, 81% Answer Rate, 67.5s Avg Speed, 3.7 min Avg Talk Time',
      'Call Topic Breakdown: Technical Support (1,019), Streaming (1,022), Payment related (1,007), Contract related (976), Admin Support (976)',
      'Agent Performance Matrix: Individual satisfaction scores & call handling for Dan (3.85), Jim (3.80), Greg (3.78), Stewart (3.77), Joe (3.74), Martha (3.73), Becky (3.67), Diane (3.65)'
    ]
  },
  {
    id: 'hr-enterprise-excel',
    title: 'Executive HR Analytics & Workforce Demographics Dashboard',
    subtitle: '10,000 Employees, 118M Payroll Analytics, Nationalities & Department Slicers in Excel',
    category: 'excel hr',
    image: './projects/Finance project/Hr_excel_dashboard.png',
    galleryImages: [
      './projects/Finance project/Hr_excel_dashboard.png'
    ],
    tags: ['Microsoft Excel', 'Excel Slicers', 'Pivot Tables & Charts', 'HR Analytics', 'Payroll & Headcount'],
    problem: 'Enterprise corporate HR leaders needed a centralized dashboard to track a workforce of 10,000+ employees, monitoring 118M in total payroll, active vs. inactive headcount status, and demographic equity across 7 distinct departments.',
    solution: 'Engineered a dark-themed executive HR analytics dashboard in Microsoft Excel with interactive slicers (Age Brackets, Departments, Active Status), multi-national diversity metrics, and qualification breakdowns.',
    impact: 'Provided instant visibility into 118M total salary expenditure, tracked department headcounts (Operations 3.1K, Sales 1.8K, Customer Service 1.5K, IT 1.4K), and confirmed an 89.4% active workforce rate.',
    features: [
      'Built in Microsoft Excel: Dynamic multi-criteria slicers for Age Groups (20:30 to 50:60), 7 Departments, and Employment Status',
      'Executive Headcount KPIs: 10,000 Total Employees, 46 Avg Age, 2,792 Females, 7,208 Males, 118M Total Salaries, 1,971 Advanced Degrees',
      'Departmental Distribution: Operations (3,110), Sales (1,870), Customer Support (1,516), IT (1,428), Finance (907), Marketing (783), HR (656)',
      'Demographic & Educational Breakdown: Qualifications (Bachelor 6,172, Masters 1,473, Diploma 2,355), Multinational distribution (Saudi 48%, Egypt 11%, etc.), and Tenure hiring curves'
    ]
  },
  {
    id: 'sales-omnichannel',
    title: 'Omnichannel Retail Sales & Revenue Growth Intelligence',
    subtitle: 'Cross-Regional Sales Performance, Product Tiering & Customer Lifetime Value in Excel',
    category: 'excel sales',
    image: './projects/Finance project/sales_project.jpg',
    galleryImages: [
      './projects/Finance project/sales_project.jpg',
      './projects/Finance project/sales project part1.jpg',
      './projects/Finance project/Sales project part 2.jpg',
      './projects/Finance project/Sales project.jpg',
      './projects/Finance project/sales_prooject!.jpg'
    ],
    tags: ['Microsoft Excel', 'Sales Analytics', 'Pivot Charts & Slicers', 'Revenue Growth', 'Regional Mapping'],
    problem: 'Sales leadership struggled to monitor multi-channel revenue streams, top-performing product categories, regional sales quotas, and discount leakages across quarters without costly BI licensing.',
    solution: 'Built an integrated sales intelligence engine in Microsoft Excel connecting transactional sales ledgers, regional geographic maps, and customer RFM metrics into an interactive executive dashboard.',
    impact: 'Uncovered a 22% sales concentration in top 3 product lines and enabled territory managers to realign field efforts towards high-growth territories.',
    features: [
      'Built in Microsoft Excel with dynamic Pivot Tables, slicers, and summary metrics',
      'Real-time revenue, order volume, and average order value (AOV) tracking',
      'Geographic distribution map analyzing regional target vs. actual performance',
      'Product category Pareto analysis and historical seasonal pattern analysis'
    ]
  },
  {
    id: 'ecommerce-sales-intelligence',
    title: 'E-Commerce Sales Performance & Customer Demographics',
    subtitle: 'Multi-Channel Acquisition, Profit Margins, Regional Distribution & Customer Cohorts in Excel',
    category: 'excel sales',
    image: './projects/Finance project/sales project part1.jpg',
    galleryImages: [
      './projects/Finance project/sales project part1.jpg',
      './projects/Finance project/Sales project part 2.jpg'
    ],
    tags: ['Microsoft Excel', 'Sales Analytics', 'Customer Demographics', 'Pivot Tables & Charts', 'Channel Attribution'],
    problem: 'E-commerce business leaders lacked unified reporting connecting marketing campaign acquisition channels (TikTok, Facebook, Google) with product subcategory profitability and customer buyer profiles.',
    solution: 'Constructed an end-to-end 2-part Microsoft Excel analytics suite integrating commercial sales metrics ($596K revenue, $246K profit across 6K orders) with customer demographic matrices (gender split, age groups, country distribution).',
    impact: 'Identified top customer acquisition channels ($110K via TikTok Ads, $106K via Facebook), highlighted primary buyer demographic (ages 25-34 generating $202K+), and revealed top product lines (Men\'s Apparel & Skincare).',
    features: [
      'Part 1 (Sales & Profit): $596.29K Total Sales, $246.40K Profit, 6K Orders, Ad Channel performance (TikTok, FB, Email, Google), and Regional map (Egypt, KSA, UAE, Kuwait)',
      'Part 2 (Customer Demographics): 500 customers, gender distribution (257 males, 243 females), age group purchasing power, and individual order history',
      'Interactive Excel slicers for Year (2024, 2025, 2026), SubCategory, and Month',
      'Unified 2-part dashboard gallery with drilldown into order quantities and customer records'
    ]
  },
  {
    id: 'restaurant-bi-analytics',
    title: "Gusteau's Restaurant & Food Delivery Performance Analytics",
    subtitle: 'Enterprise 3-Page Power BI Suite: Multi-City Sales, Order Fulfillment & Delivery Operations',
    category: 'powerbi sales operations',
    image: './projects/new project/resturant project/photo_2026-10-07_14-52-20.jpg',
    galleryImages: [
      './projects/new project/resturant project/photo_2026-10-07_14-52-20.jpg',
      './projects/new project/resturant project/photo_2026-10-07_14-52-41.jpg',
      './projects/new project/resturant project/photo_2026-10-07_14-52-46.jpg'
    ],
    tags: ['Power BI', 'DAX Measures', 'Logistics Analytics', 'Sales Treemap', 'Geographic Slicers', 'Fulfillment Optimization'],
    problem: 'Restaurant chains and dark kitchens faced fragmented reporting across multi-city sales, order cancellation leaks (9.81K orders totaling 2.62M EGP in lost revenue), driver availability bottlenecks, and unpredictable hourly order peaks.',
    solution: 'Designed and deployed an end-to-end 3-page executive Power BI solution tracking 100K+ orders across 7 major cities (Alexandria, Assiut, Cairo, Giza, Mansoura, Tanta, Zagazig). Connected food item treemaps, fulfillment gauges, driver online status donuts, and hourly order demand curves with cross-filtering.',
    impact: 'Revealed an 85% delivery fulfillment rate, confirmed online couriers drive 90.11% (20.65M EGP) of total revenue, and pinpointed high-volume menu items (Shawarma, Fried Chicken, Pizza) and peak rush hours (4 PM - 8 PM) to optimize kitchen prep and dispatch scheduling.',
    features: [
      'Page 1 (Sales Overview): Delivered revenue (22.92M), 85% fulfillment gauge, item revenue treemap, and food quantity vs. revenue correlation',
      'Page 2 (Orders & Payments): Total revenue (26.89M), lost revenue analysis (2.62M), city-level revenue distribution, driver availability breakdown, and payment methods (Cash 34%, Card 33%, Wallet 33%)',
      'Page 3 (Delivery & Customers): Customer metrics (7K unique users, 2.0 orders/user), 500 active drivers, avg delivery time (37.44 min), 24-hour demand curve, and top 10 branch leaderboard',
      'Interactive multi-city filtering and unified data modeling with advanced DAX calculations'
    ]
  },
  {
    id: 'store-sales-bi',
    title: 'Retail Store Sales & Profitability Intelligence Dashboard',
    subtitle: 'Revenue Streams, Profit Margins, Category Breakdown & Global Country Attribution in Power BI',
    category: 'powerbi sales',
    image: './projects/Store sales/Store_sales.png',
    galleryImages: [
      './projects/Store sales/Store_sales.png'
    ],
    tags: ['Power BI', 'DAX Measures', 'Retail Analytics', 'Profit Optimization', 'Geographic Slicers'],
    problem: 'Retail store owners needed quick visibility into monthly sales cycles, category revenue distribution (Electronics vs. Accessories), and country-level profitability to eliminate low-margin product lines.',
    solution: 'Constructed an executive Power BI sales dashboard featuring automated revenue and profit calculation cards, category revenue shares, monthly seasonal curves, and country sales benchmarks.',
    impact: 'Monitored 10.23M in Total Revenue and 4.09M in Profit at a healthy 40% profit margin across 2,000 orders, isolating Egypt ($3.3M) and Germany ($1.9M) as dominant revenue generators.',
    features: [
      'Core Financial Metrics: $10.23M Total Revenue, $4.09M Total Profit, 40% Net Profit Margin, 2K Total Orders',
      'Category Revenue Mix: Electronics ($6.94M / 67.85%) vs. Accessories ($3.29M / 32.15%)',
      'Global Country Attribution: Egypt ($3.3M), Germany ($1.9M), France ($1.8M), USA ($1.7M)',
      'Product Volume Slicing: Sales order tracking across Printers, Mice, Keyboards, Monitors, and Laptops'
    ]
  },
  {
    id: 'samsung-supply-chain-bi',
    title: 'Samsung Global Supply Chain & Logistics Intelligence Dashboard',
    subtitle: 'Supplier Lead Times, Inventory Stock Valuation, Freight Delays & Omnichannel Revenue in Power BI',
    category: 'powerbi operations',
    image: './projects/Supply chain/Samsung_supply_chain.png',
    galleryImages: [
      './projects/Supply chain/Samsung_supply_chain.png'
    ],
    tags: ['Power BI', 'Supply Chain Analytics', 'Logistics KPIs', 'Carrier Delay Tracking', 'Inventory Valuation'],
    problem: 'Supply chain directors at enterprise electronics manufacturers faced fragmented visibility between supplier procurement lead times, factory inventory stock levels, global freight delays, and partner retail revenue.',
    solution: 'Designed an enterprise 4-pillar Power BI logistics cockpit (Supplier, Inventory, Shipment, Customer) tracking 8,000 shipments, supplier lead times, stock valuation, carrier delays, and distributor sales.',
    impact: 'Tracked $186.86M in gross revenue ($176.95M net, $48.56M profit at 27.44% margin), uncovered shipment bottlenecks across 9 major maritime/air carriers, and optimized stock for Galaxy product lines.',
    features: [
      'End-to-End Operational Pipeline: 129K Order Quantity, 160K Inventory Units, 3M Shipment Volume, 187K Delivered Orders',
      'Supplier Performance Benchmarks: Lead time analysis across Samsung, BOE Technology, Taiwan Semi, Sony, and SK Hynix',
      'Carrier Delay Heatmap: Root-cause delay tracking across Maersk (87), DHL (66), DB Schenker (65), FedEx (64), and UPS',
      'Omnichannel Sales Distribution: Partner platform revenue across Amazon ($37M), Flipkart ($36M), Best Buy ($36M), and MediaMarkt ($35M)'
    ]
  },
  {
    id: 'data-salary-dashboard-bi',
    title: 'Global Tech & Data Compensation Benchmark Dashboard',
    subtitle: 'Role Salaries, Remote Work Ratios, Experience Tiers & Company Sizes in Power BI',
    category: 'powerbi hr',
    image: './projects/Salary dashboard/Salary_dashboard.png',
    galleryImages: [
      './projects/Salary dashboard/Salary_dashboard.png'
    ],
    tags: ['Power BI', 'Compensation Analytics', 'HR Benchmarking', 'Remote Work Trends', 'DAX'],
    problem: 'Tech recruitment agencies and HR directors lacked transparent compensation benchmarks across data job titles, remote working arrangements, experience levels, and company scales.',
    solution: 'Architected an interactive compensation analytics dashboard in Power BI visualizing salary distributions in USD, remote ratios, geographic company locations, and seniority tiers with dynamic yearly slicers.',
    impact: 'Benchmarked salary ranges from $6K min to $450K max (averaging $95.81K USD), providing data-driven compensation guidelines across 15+ specialized technical roles.',
    features: [
      'Salary Spectrum Analytics: $95.81K Average USD Salary, $450K Maximum Senior Comp, and $6K Entry Benchmark',
      'Remote Working Distribution: 50% Fully Remote, 29.17% Partially Remote, 20.83% On-site arrangements',
      'Technical Role Matrix: Salary and headcount breakdowns for Data Scientists, Data Engineers, Analysts, and ML Engineers',
      'Company Profile Slicers: Categorization by company size (Large 45.8%, Medium 34.7%, Small 19.4%) and experience tiers'
    ]
  },
  {
    id: 'fifa-world-cup-football-bi',
    title: 'FIFA World Cup & Football Analytics Dashboard',
    subtitle: 'Unified 2-Page Executive Suite: Tournament Organizers & Match Records + Player Stats & All-Time Scorers',
    category: 'powerbi operations',
    image: './projects/Football dashboard/Football_organizers.png',
    galleryImages: [
      './projects/Football dashboard/Football_organizers.png',
      './projects/Football dashboard/Football_players.png'
    ],
    tags: ['Power BI', 'Sports Analytics', 'Tournament History', 'Player Scorecards', 'DAX Measures'],
    problem: 'Sports analysts and media broadcasters needed an interactive historical dashboard combining tournament-level outcomes (host nations, extra-time matches, stage goals) with granular player scorecards and caps.',
    solution: 'Built a 2-page Power BI sports intelligence dashboard: Page 1 analyzes 22 World Cup tournaments (964 matches, goal trends, stage filters), while Page 2 analyzes 831 players (caps, all-time goals, position rosters).',
    impact: 'Provided a unified reference platform visualizing legendary player achievements (Ronaldo 117 goals, Messi 90 goals) and tournament dynamics across all World Cup editions.',
    features: [
      'Page 1 (Organizers & Tournament Records): 22 Tournaments, 964 Matches, Host Wins (5), Team Goals (Brazil 229, Germany 226), and extra-time trends',
      'Page 2 (Player & Scorer Analytics): 831 Players, Most Caps (Ronaldo 191, Guardado 177, Al-Haydos 169, Messi 164), and top international goalscorers',
      'Young Talent Spotlight: Benchmarked high-performing players under 26 scoring >20 goals (Mbappé, Lautaro, Pulisic, David)',
      'Interactive Slicers: Filter by match stage (Finals to Group Stages), playing positions, club teams, and national squads'
    ]
  },
  {
    id: 'data-jobs-global-bi',
    title: 'Data Jobs Global Market Demand & Compensation Dashboard',
    subtitle: '479,000 Job Postings, Global Bubble Maps & Role Salary Benchmarking in Power BI',
    category: 'powerbi hr',
    image: './projects/Data jobs/Data_jobs_dashboard.png',
    galleryImages: [
      './projects/Data jobs/Data_jobs_dashboard.png',
      './projects/Data jobs/Data_jobs_2024.png'
    ],
    tags: ['Power BI', 'Market Intelligence', 'Data Career Analytics', 'Global Heatmap', 'DAX Measures'],
    problem: 'Data professionals, bootcamp graduates, and corporate hiring teams lacked macroeconomic visibility into high-demand data roles, global distribution hubs, and salary ranges across continents.',
    solution: 'Designed an executive Power BI market analytics cockpit tracking 479,000 verified data job postings globally with interactive role demand bar charts, average salaries, and geographic bubble mapping.',
    impact: 'Revealed Data Engineers (129K) and Data Analysts (113K) as the most in-demand specializations, benchmarks average annual compensation at $121K ($49.16/hr), and mapped hiring clusters across 6 continents.',
    features: [
      'Macro Industry KPIs: 479,000 Total Jobs Analyzed, $121,000 Average Annual Salary, $49.16 Average Hourly Rate',
      'Top In-Demand Data Roles: Data Engineer (129K), Data Analyst (113K), Data Scientist (98K), Senior Data Engineer (31K), Business Analyst (29K)',
      'Global Geographic Mapping: Interactive bubble map analyzing vacancy concentrations across North America, Europe, Asia, Africa, and Australia',
      'Career Trajectory Matrix: Comparative demand analysis across entry, mid, and senior data professions'
    ]
  },
  {
    id: 'data-jobs-2024-bi',
    title: 'Data Jobs 2024 Market Trends & Median Salary Matrix',
    subtitle: 'Monthly Hiring Curves, Role Scatter Matrix & Compensation Quadrants in Power BI',
    category: 'powerbi hr',
    image: './projects/Data jobs/Data_jobs_2024.png',
    galleryImages: [
      './projects/Data jobs/Data_jobs_2024.png',
      './projects/Data jobs/Data_jobs_dashboard.png'
    ],
    tags: ['Power BI', '2024 Market Trends', 'Salary Scatter Plot', 'Role Compensation', 'DAX'],
    problem: 'Job seekers and HR compensation leaders needed clear 2024 market data to understand monthly hiring trajectory shifts, hourly vs. yearly median pay correlations, and top-earning technical specializations.',
    solution: 'Constructed an in-depth 2024 Power BI labor dashboard integrating monthly hiring trendlines, a dual-axis median salary scatter matrix ($30-$65/hr vs. $90K-$160K/yr), and a live job title leaderboard with trend sparklines.',
    impact: 'Identified Machine Learning Engineers ($155K median) and Senior Data Scientists ($155K median) as top earners, tracked 478.895K jobs, and visualized monthly seasonal demand from January to November 2024.',
    features: [
      '2024 Market Overview: 478.895K Analyzed Positions, $113,000 Median Annual Salary, $47.62 Median Hourly Rate',
      'Annual Trend Analysis: Monthly job demand curve tracking market fluctuations between peak (55K/mo) and seasonal shifts',
      'Hourly vs. Yearly Scatter Quadrant: Correlation matrix comparing Data Scientists, Cloud Engineers, ML Engineers, and Data Analysts',
      'Detailed Role Leaderboard: Granular salary median, hourly median, and sparkline trends with dynamic job title filters'
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

  function openCertModal(title, issuer, filePath, fileType, previewImg) {
    document.getElementById('cert-modal-title').textContent = title;
    const issuerEl = document.getElementById('cert-modal-issuer');
    if (issuerEl) {
      issuerEl.textContent = issuer || 'Verified Credential';
    }

    const previewContainer = document.getElementById('cert-modal-preview');
    const downloadBtn = document.getElementById('cert-download-link');

    downloadBtn.href = filePath;
    downloadBtn.setAttribute('download', '');

    const displayImg = previewImg || filePath;
    previewContainer.innerHTML = `
      <div class="w-full flex items-center justify-center p-3 bg-slate-950/90 rounded-xl border border-slate-800 shadow-inner">
        <img src="${displayImg}" alt="${title}" class="max-h-[540px] w-auto max-w-full object-contain rounded-lg shadow-2xl">
      </div>
    `;

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
      const issuer = btn.getAttribute('data-cert-issuer') || 'Official Certificate';
      const filePath = btn.getAttribute('data-cert-file');
      const fileType = btn.getAttribute('data-cert-type') || 'pdf';
      const previewImg = btn.getAttribute('data-cert-preview');
      openCertModal(title, issuer, filePath, fileType, previewImg);
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
