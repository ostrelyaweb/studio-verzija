/**
 * OSTRELYA STUDIO — INTERACTION CONTROLLER
 * Restrained, high-performance, accessible JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Scroll Treatment
  const siteHeader = document.querySelector('.site-header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Menu Drawer Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      mobileMenu.setAttribute('aria-hidden', isExpanded);
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Subtle Hero Parallax (Maximum 6px, respecting prefers-reduced-motion)
  const heroEmblem = document.querySelector('.emblem-stage');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroEmblem && !prefersReducedMotion) {
    let ticking = false;
    window.addEventListener('mousemove', (e) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const { innerWidth, innerHeight } = window;
          const xOffset = ((e.clientX / innerWidth) - 0.5) * 8; // max ±4px
          const yOffset = ((e.clientY / innerHeight) - 0.5) * 8; // max ±4px
          heroEmblem.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // 4. Back to Top Smooth Scroll
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 5. How We Work — Dynamic Architectural Trajectory & Scroll Transition
  initProcessTrajectory();

  // 6. Cinematic Brand Preloader
  initStudioLoader();

  // 7. Cookie Consent Management (CMP)
  initCookieConsent();

  // 8. Accessible Service Modals (services.html)
  initServiceModals();

  // 9. Project Inquiry Form Controller (index.html)
  initInquiryForm();
});

function initProcessTrajectory() {
  const processSection = document.getElementById('process');
  const processStage = document.getElementById('processStage');
  const baseSvgPath = document.getElementById('processPathBase');
  const activeSvgPath = document.getElementById('processPathActive');
  const tracerDot = document.getElementById('processTracerDot');
  const nodes = Array.from(document.querySelectorAll('.process-node'));

  if (!processSection || !processStage || !baseSvgPath || !activeSvgPath || nodes.length < 4) {
    return;
  }

  let totalPathLength = 0;
  let stepMilestones = [0.05, 0.35, 0.68, 0.98];
  let currentProgress = 0;
  let isHoverPreview = false;
  let hoverAnimId = null;
  let scrollTicking = false;

  function buildTrajectory() {
    if (window.innerWidth < 860) {
      return;
    }

    const sRect = processStage.getBoundingClientRect();
    if (sRect.width <= 0) return;

    const stepData = nodes.map(n => {
      const num = n.querySelector('.process-step-num');
      const nRect = n.getBoundingClientRect();
      const numRect = num ? num.getBoundingClientRect() : nRect;
      return {
        nodeLeft: nRect.left - sRect.left,
        nodeRight: nRect.right - sRect.left,
        nodeBottom: nRect.bottom - sRect.top,
        nodeWidth: nRect.width,
        y: numRect.top - sRect.top + numRect.height / 2,
        numCenter: numRect.left - sRect.left + numRect.width / 2
      };
    });

    const [s1, s2, s3, s4] = stepData;
    const shelf1_start = s1.numCenter;
    const shelf1_end = s1.nodeLeft + Math.min(s1.nodeWidth, 270);

    const shelf2_start = s2.numCenter;
    const shelf2_end = s2.nodeLeft + Math.min(s2.nodeWidth, 270);

    const shelf3_start = s3.numCenter;
    const shelf3_end = s3.nodeLeft + Math.min(s3.nodeWidth, 270);

    const shelf4_start = s4.numCenter;
    const shelf4_end = s4.nodeLeft + Math.min(s4.nodeWidth, 270);

    // 1 -> 2
    const dx1 = shelf2_start - shelf1_end;
    const c1_1 = { x: shelf1_end + dx1 * 0.55, y: s1.y };
    const c1_2 = { x: shelf2_start - dx1 * 0.35, y: s2.y };

    // 2 -> 3: Loop completely around the right of Node 2 and below Node 2 bottom
    const loopX = Math.min(sRect.width - 20, s2.nodeRight + 45);
    const clearY = s2.nodeBottom + 25;
    const midX = (s2.nodeLeft + s3.nodeLeft) / 2;

    // 3 -> 4
    const dx3 = shelf4_start - shelf3_end;
    const c3_1 = { x: shelf3_end + dx3 * 0.55, y: s3.y };
    const c3_2 = { x: shelf4_start - dx3 * 0.35, y: s4.y };

    const pathData = `
      M ${shelf1_start.toFixed(1)} ${s1.y.toFixed(1)}
      L ${shelf1_end.toFixed(1)} ${s1.y.toFixed(1)}
      C ${c1_1.x.toFixed(1)} ${c1_1.y.toFixed(1)}, ${c1_2.x.toFixed(1)} ${c1_2.y.toFixed(1)}, ${shelf2_start.toFixed(1)} ${s2.y.toFixed(1)}
      L ${shelf2_end.toFixed(1)} ${s2.y.toFixed(1)}
      C ${loopX.toFixed(1)} ${s2.y.toFixed(1)}, ${loopX.toFixed(1)} ${clearY.toFixed(1)}, ${midX.toFixed(1)} ${clearY.toFixed(1)}
      C ${(s3.nodeLeft - 50).toFixed(1)} ${clearY.toFixed(1)}, ${(s3.nodeLeft - 40).toFixed(1)} ${(s3.y - 15).toFixed(1)}, ${shelf3_start.toFixed(1)} ${s3.y.toFixed(1)}
      L ${shelf3_end.toFixed(1)} ${s3.y.toFixed(1)}
      C ${c3_1.x.toFixed(1)} ${c3_1.y.toFixed(1)}, ${c3_2.x.toFixed(1)} ${c3_2.y.toFixed(1)}, ${shelf4_start.toFixed(1)} ${s4.y.toFixed(1)}
      L ${shelf4_end.toFixed(1)} ${s4.y.toFixed(1)}
    `.replace(/\s+/g, ' ').trim();

    baseSvgPath.setAttribute('d', pathData);
    activeSvgPath.setAttribute('d', pathData);

    try {
      totalPathLength = activeSvgPath.getTotalLength();
    } catch (e) {
      totalPathLength = 0;
    }

    if (totalPathLength > 0) {
      activeSvgPath.style.strokeDasharray = `${totalPathLength} ${totalPathLength}`;

      // Sample along path to find point nearest to each step center
      const samples = 120;
      const targets = [s1, s2, s3, s4];
      const foundProgress = [0.05, 0.35, 0.68, 0.98];

      for (let t = 1; t < 4; t++) {
        let bestDist = Infinity;
        let bestP = t * 0.3;
        const targetX = targets[t].numCenter;
        const targetY = targets[t].y;
        for (let s = 1; s <= samples; s++) {
          const p = s / samples;
          const pt = activeSvgPath.getPointAtLength(p * totalPathLength);
          const d2 = (pt.x - targetX) ** 2 + (pt.y - targetY) ** 2;
          if (d2 < bestDist) {
            bestDist = d2;
            bestP = p;
          }
        }
        foundProgress[t] = bestP;
      }
      stepMilestones = foundProgress;
    }

    applyProgress(currentProgress);
  }

  function applyProgress(p) {
    currentProgress = Math.max(0, Math.min(1, p));

    if (window.innerWidth < 860) {
      const vh = window.innerHeight;
      nodes.forEach(n => {
        const r = n.getBoundingClientRect();
        if (r.top <= vh * 0.70 && r.bottom >= 0) {
          n.classList.add('is-active');
        } else {
          n.classList.remove('is-active');
        }
      });
      return;
    }

    if (totalPathLength > 0) {
      const offset = totalPathLength * (1 - currentProgress);
      activeSvgPath.style.strokeDashoffset = offset;

      if (tracerDot) {
        if (currentProgress > 0.015) {
          try {
            const pt = activeSvgPath.getPointAtLength(currentProgress * totalPathLength);
            if (pt && !isNaN(pt.x) && !isNaN(pt.y)) {
              tracerDot.setAttribute('cx', pt.x.toFixed(1));
              tracerDot.setAttribute('cy', pt.y.toFixed(1));
              tracerDot.classList.add('visible');
            }
          } catch (e) {
            tracerDot.classList.remove('visible');
          }
        } else {
          tracerDot.classList.remove('visible');
        }
      }
    }

    // Illuminate steps reached
    nodes.forEach((node, idx) => {
      const threshold = stepMilestones[idx] - 0.04;
      if (currentProgress >= threshold) {
        node.classList.add('is-active');
      } else {
        node.classList.remove('is-active');
      }
    });
  }

  function calculateScrollProgress() {
    if (nodes.length < 4) return 0;
    const firstRect = nodes[0].getBoundingClientRect();
    const lastRect = nodes[nodes.length - 1].getBoundingClientRect();
    const vh = window.innerHeight;

    // Start reveal as Step 01 approaches comfortable reading zone
    const startThreshold = vh * 0.72;
    // Reach 100% when Step 04 is well positioned in viewport
    const endThreshold = vh * 0.50;

    const totalSpan = (lastRect.top - firstRect.top) + (startThreshold - endThreshold);
    if (totalSpan <= 0) return 0;

    const currentDist = startThreshold - firstRect.top;
    const progress = currentDist / totalSpan;

    return Math.max(0, Math.min(1, progress));
  }

  function updateOnScroll() {
    // If user is scrolling, cancel any active hover preview immediately
    if (isHoverPreview) {
      isHoverPreview = false;
      if (hoverAnimId) {
        cancelAnimationFrame(hoverAnimId);
        hoverAnimId = null;
      }
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyProgress(1);
      return;
    }

    const p = calculateScrollProgress();
    applyProgress(p);
  }

  function onScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateOnScroll();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Smooth hover transition helper
  function smoothAnimateTo(targetP) {
    if (hoverAnimId) {
      cancelAnimationFrame(hoverAnimId);
      hoverAnimId = null;
    }

    const startP = currentProgress;
    const startTime = performance.now();
    const duration = 280; // snappy, elegant glide

    function step(now) {
      if (!isHoverPreview) return; // aborted by scroll
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - t, 3);
      const val = startP + (targetP - startP) * ease;
      applyProgress(val);

      if (t < 1) {
        hoverAnimId = requestAnimationFrame(step);
      } else {
        hoverAnimId = null;
      }
    }

    hoverAnimId = requestAnimationFrame(step);
  }

  // Hover Interactions on Nodes
  nodes.forEach((node, index) => {
    node.addEventListener('mouseenter', () => {
      isHoverPreview = true;
      const targetP = Math.min(1, Math.max(stepMilestones[index] + 0.04, 0.1));
      smoothAnimateTo(targetP);
    });

    node.addEventListener('mouseleave', () => {
      if (isHoverPreview) {
        const scrollP = calculateScrollProgress();
        smoothAnimateTo(scrollP);
      }
    });

    node.addEventListener('click', () => {
      const nRect = node.getBoundingClientRect();
      const targetScroll = window.scrollY + nRect.top - (window.innerHeight * 0.35);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
  });

  processStage.addEventListener('mouseleave', () => {
    if (isHoverPreview) {
      isHoverPreview = false;
      const scrollP = calculateScrollProgress();
      smoothAnimateTo(scrollP);
    }
  });

  // Responsive Resize Handling
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildTrajectory();
      updateOnScroll();
    }, 60);
  });

  // Fonts & Load Listeners (guarantees accurate layout measurement)
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      buildTrajectory();
      updateOnScroll();
    });
  }

  window.addEventListener('load', () => {
    buildTrajectory();
    updateOnScroll();
  });

  // Initial call
  setTimeout(() => {
    buildTrajectory();
    updateOnScroll();
  }, 50);
}

/**
 * 6. CINEMATIC BRAND PRELOADER CONTROLLER
 * Architectural reveal sequence matching Ostrelya Studio design language
 */
function initStudioLoader() {
  const studioLoader = document.getElementById('studioLoader');
  if (!studioLoader) return;

  // Allow bypassing with ?skipLoader in URL
  if (window.location.search.includes('skipLoader')) {
    studioLoader.style.display = 'none';
    document.body.classList.remove('loader-active');
    return;
  }

  const loaderLockup = document.getElementById('loaderLockup');
  const loaderEmblem = document.getElementById('loaderEmblem');
  const emblemHalo = document.getElementById('emblemHalo');
  const loaderShockwave = document.getElementById('loaderShockwave');
  const loaderArrow = document.getElementById('loaderArrow');
  const ringTl = document.getElementById('ringTl');
  const ringBr = document.getElementById('ringBr');

  const maskTl = document.getElementById('maskPathTl');
  const maskBr = document.getElementById('maskPathBr');
  const maskArrow = document.getElementById('maskPathArrow');
  const glowTraceTl = document.getElementById('glowTraceTl');
  const glowTraceBr = document.getElementById('glowTraceBr');
  const glowTraceArrow = document.getElementById('glowTraceArrow');
  const tipBurst = document.getElementById('tipBurst');
  const forgingOrb = document.getElementById('forgingOrb');

  const loaderTextWrap = document.getElementById('loaderTextWrap');
  const loaderGlint = document.getElementById('loaderGlint');
  const loaderSubWrap = document.getElementById('loaderSubWrap');
  const loaderProgressBar = document.getElementById('loaderProgressBar');
  const loaderCounter = document.getElementById('loaderCounter');

  if (typeof gsap === 'undefined' || !maskTl || !maskBr || !maskArrow) {
    setTimeout(() => {
      studioLoader.style.transition = 'opacity 0.5s ease';
      studioLoader.style.opacity = '0';
      setTimeout(() => {
        studioLoader.style.display = 'none';
        document.body.classList.remove('loader-active');
      }, 500);
    }, 1200);
    return;
  }

  function setOrbPos(x, y) {
    if (forgingOrb) forgingOrb.setAttribute('transform', `translate(${x}, ${y})`);
  }

  document.body.classList.add('loader-active');
  studioLoader.style.display = 'flex';
  gsap.set(studioLoader, { yPercent: 0, opacity: 1 });
  gsap.set(loaderLockup, { opacity: 1, y: 0 });

  // Emblem and halo states
  gsap.set(loaderEmblem, { scale: 1, opacity: 1 });
  gsap.set(emblemHalo, { opacity: 0, scale: 0.6 });
  gsap.set(loaderShockwave, { opacity: 0, scale: 0.2 });

  // Calculate stroke lengths
  const lenTl = maskTl.getTotalLength();
  const lenBr = maskBr.getTotalLength();
  const lenArrow = maskArrow.getTotalLength();

  [maskTl, glowTraceTl].forEach(el => {
    if (el) {
      el.style.strokeDasharray = lenTl;
      el.style.strokeDashoffset = lenTl;
    }
  });

  [maskBr, glowTraceBr].forEach(el => {
    if (el) {
      el.style.strokeDasharray = lenBr;
      el.style.strokeDashoffset = lenBr;
    }
  });

  [maskArrow, glowTraceArrow].forEach(el => {
    if (el) {
      el.style.strokeDasharray = lenArrow;
      el.style.strokeDashoffset = lenArrow;
    }
  });

  // Orb initial setup
  const startPt = maskTl.getPointAtLength(0);
  setOrbPos(startPt.x, startPt.y);
  if (forgingOrb) gsap.set(forgingOrb, { opacity: 0, scale: 1 });
  if (tipBurst) gsap.set(tipBurst, { opacity: 0, scale: 0.3 });
  gsap.set([glowTraceTl, glowTraceBr, glowTraceArrow].filter(Boolean), { opacity: 0 });

  gsap.set(loaderTextWrap, { width: 0, opacity: 0, marginLeft: 0 });
  gsap.set(loaderGlint, { left: '-150%' });
  gsap.set(loaderSubWrap, { opacity: 0, y: 14 });
  gsap.set(loaderProgressBar, { width: '0%' });
  if (loaderCounter) loaderCounter.textContent = '00%';

  const isMobile = window.innerWidth < 640;
  const targetTextWidth = isMobile ? 178 : 278;
  const targetMarginLeft = isMobile ? 14 : 24;

  const tl = gsap.timeline({
    onUpdate: () => {
      if (loaderCounter) {
        const normProgress = Math.min(1, tl.time() / 2.6);
        const p = Math.round(normProgress * 100);
        loaderCounter.textContent = p < 10 ? '0' + p + '%' : p + '%';
      }
    }
  });

  /* ── PHASE 1: Orb Ignites & Forges Top-Left Ring Arc (0.05s – 0.50s) ── */
  tl.to(forgingOrb, { opacity: 1, duration: 0.1, ease: 'power2.out' }, 0.05);
  tl.to(glowTraceTl, { opacity: 1, duration: 0.08 }, 0.05);

  tl.to({ p: 0 }, {
    p: 1,
    duration: 0.42,
    ease: 'power2.inOut',
    onUpdate: function() {
      const val = this.targets()[0].p;
      const curLen = val * lenTl;
      maskTl.style.strokeDashoffset = lenTl - curLen;
      glowTraceTl.style.strokeDashoffset = lenTl - curLen;
      const pt = maskTl.getPointAtLength(curLen);
      setOrbPos(pt.x, pt.y);
    }
  }, 0.08);

  tl.to(glowTraceTl, { opacity: 0.2, duration: 0.25 }, 0.50);

  /* ── PHASE 2: Orb Glides Across Gap & Forges Bottom-Right Ring Arc (0.50s – 0.98s) ── */
  const brStartPt = maskBr.getPointAtLength(0);
  tl.to(forgingOrb, {
    duration: 0.10,
    ease: 'power1.inOut',
    onUpdate: function() {
      const prog = this.progress();
      const tlEndPt = maskTl.getPointAtLength(lenTl);
      const x = tlEndPt.x + (brStartPt.x - tlEndPt.x) * prog;
      const y = tlEndPt.y + (brStartPt.y - tlEndPt.y) * prog;
      setOrbPos(x, y);
    }
  }, 0.50);

  tl.to(glowTraceBr, { opacity: 1, duration: 0.05 }, 0.60);

  tl.to({ p: 0 }, {
    p: 1,
    duration: 0.38,
    ease: 'power2.inOut',
    onUpdate: function() {
      const val = this.targets()[0].p;
      const curLen = val * lenBr;
      maskBr.style.strokeDashoffset = lenBr - curLen;
      glowTraceBr.style.strokeDashoffset = lenBr - curLen;
      const pt = maskBr.getPointAtLength(curLen);
      setOrbPos(pt.x, pt.y);
    }
  }, 0.60);

  tl.to(glowTraceBr, { opacity: 0.2, duration: 0.25 }, 0.98);

  /* ── PHASE 3: Orb Dives to Arrow Base & Blasts Up to Needle Tip (0.98s – 1.42s) ── */
  const arStartPt = maskArrow.getPointAtLength(0);
  tl.to(forgingOrb, {
    duration: 0.12,
    ease: 'power2.in',
    onUpdate: function() {
      const prog = this.progress();
      const brEndPt = maskBr.getPointAtLength(lenBr);
      const x = brEndPt.x + (arStartPt.x - brEndPt.x) * prog;
      const y = brEndPt.y + (arStartPt.y - brEndPt.y) * prog;
      setOrbPos(x, y);
    }
  }, 0.98);

  tl.to(glowTraceArrow, { opacity: 1, duration: 0.05 }, 1.10);

  tl.to({ p: 0 }, {
    p: 1,
    duration: 0.32,
    ease: 'power3.out',
    onUpdate: function() {
      const val = this.targets()[0].p;
      const curLen = val * lenArrow;
      maskArrow.style.strokeDashoffset = lenArrow - curLen;
      glowTraceArrow.style.strokeDashoffset = lenArrow - curLen;
      const pt = maskArrow.getPointAtLength(curLen);
      setOrbPos(pt.x, pt.y);
    }
  }, 1.10);

  /* ── PHASE 4: Needle Tip Impact Burst, Shockwave & Backlight Halo (1.40s – 1.85s) ── */
  if (tipBurst) {
    tl.set(tipBurst, { opacity: 1, scale: 0.3 }, 1.40);
    tl.to(tipBurst, {
      scale: 1.4,
      opacity: 1,
      duration: 0.18,
      ease: 'power2.out'
    }, 1.40);
    tl.to(tipBurst, {
      scale: 2.2,
      opacity: 0,
      duration: 0.45,
      ease: 'power2.out'
    }, 1.58);
  }

  tl.to(forgingOrb, { scale: 1.8, opacity: 0, duration: 0.15, ease: 'power2.out' }, 1.42);
  tl.to(glowTraceArrow, { opacity: 0, duration: 0.25 }, 1.42);

  // Halo blossoms behind emblem
  tl.to(emblemHalo, {
    opacity: 0.95,
    scale: 1,
    duration: 0.55,
    ease: 'power2.out'
  }, 1.40);

  // Shockwave pulse expands outward
  tl.to(loaderShockwave, {
    opacity: 0.85,
    scale: 1.2,
    duration: 0.22,
    ease: 'power2.out'
  }, 1.40);

  tl.to(loaderShockwave, {
    opacity: 0,
    scale: 3.6,
    duration: 0.45,
    ease: 'power2.out'
  }, 1.55);

  /* ── PHASE 5: Wordmark Slides Open & Lockup Stays Centered (1.48s – 2.30s) ── */
  tl.to(loaderTextWrap, {
    width: targetTextWidth,
    opacity: 1,
    marginLeft: targetMarginLeft,
    duration: 0.82,
    ease: 'power3.inOut'
  }, 1.48);

  tl.to(loaderSubWrap, {
    opacity: 1,
    y: 0,
    duration: 0.55,
    ease: 'power2.out'
  }, 1.65);

  tl.to(loaderProgressBar, {
    width: '100%',
    duration: 1.8,
    ease: 'power2.out'
  }, 0.60);

  /* ── PHASE 6: Letter-Strict Specular Glint Across "Ostrelya" (2.20s – 2.90s) ── */
  tl.to(loaderGlint, {
    left: '220%',
    duration: 0.72,
    ease: 'power1.inOut'
  }, 2.20);

  /* ── PHASE 7: Curtain Lift / Exit (3.10s – 3.85s) ── */
  tl.to([loaderLockup, loaderSubWrap], {
    y: -24,
    opacity: 0,
    duration: 0.45,
    ease: 'power2.in'
  }, 3.05);

  tl.to(studioLoader, {
    yPercent: -100,
    duration: 0.75,
    ease: 'power4.inOut',
    onComplete: () => {
      studioLoader.style.display = 'none';
      document.body.classList.remove('loader-active');
    }
  }, 3.25);

  const heroContent = document.querySelector('.hero-content');
  const heroEmblemStage = document.querySelector('.emblem-stage');
  if (heroContent && heroEmblemStage) {
    tl.fromTo([heroContent, heroEmblemStage], {
      y: 20,
      opacity: 0.8
    }, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out'
    }, 3.40);
  }

  // Check URL parameters for seek
  const urlParams = new URLSearchParams(window.location.search);
  const seekTime = urlParams.get('t');
  if (seekTime !== null) {
    tl.pause();
    tl.seek(parseFloat(seekTime), false);
  }
}

/* ==========================================================================
   7. OSTRELYA COOKIE CONSENT MANAGER (CMP)
   Architectural, GDPR & ePrivacy Compliant Consent System
   ========================================================================== */
function initCookieConsent() {
  const STORAGE_KEY = 'ostrelya_consent';
  const CONSENT_VERSION = 1;

  // Global API exposed on window
  window.OstrelyaConsent = {
    getConsent: () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.version === CONSENT_VERSION) return parsed;
        }
      } catch (e) {
        console.warn('Ostrelya Consent: LocalStorage access error', e);
      }
      return null;
    },
    setConsent: (preferences) => {
      const consentData = {
        necessary: true,
        analytics: Boolean(preferences.analytics),
        marketing: Boolean(preferences.marketing),
        timestamp: new Date().toISOString(),
        version: CONSENT_VERSION
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData));
      } catch (e) {
        console.warn('Ostrelya Consent: Failed to save consent', e);
      }
      window.dispatchEvent(new CustomEvent('ostrelya_consent_updated', { detail: consentData }));
      applyConsent(consentData);
      return consentData;
    },
    showPreferences: () => openPreferencesModal(),
    showBanner: () => openBanner(),
    hasAnswered: () => Boolean(window.OstrelyaConsent.getConsent()),
    reset: () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      openBanner();
    }
  };

  // Helper to activate conditional scripts
  function applyConsent(consent) {
    if (consent.analytics) {
      document.querySelectorAll('script[type="text/plain"][data-category="analytics"]').forEach(script => {
        activateScript(script);
      });
    }
    if (consent.marketing) {
      document.querySelectorAll('script[type="text/plain"][data-category="marketing"]').forEach(script => {
        activateScript(script);
      });
    }
  }

  function activateScript(scriptNode) {
    const newScript = document.createElement('script');
    Array.from(scriptNode.attributes).forEach(attr => {
      if (attr.name !== 'type' && attr.name !== 'data-category') {
        newScript.setAttribute(attr.name, attr.value);
      }
    });
    newScript.type = 'text/javascript';
    newScript.innerHTML = scriptNode.innerHTML;
    scriptNode.parentNode.replaceChild(newScript, scriptNode);
  }

  // Ensure CMP elements are present in the DOM
  ensureCmpDom();

  const currentConsent = window.OstrelyaConsent.getConsent();
  if (!currentConsent) {
    // Coordinate appearance: wait for preloader curtain lift (3.6s) or show promptly
    const hasLoader = document.getElementById('studioLoader');
    const delay = hasLoader ? 3600 : 700;
    setTimeout(() => {
      openBanner();
    }, delay);
  } else {
    applyConsent(currentConsent);
  }

  // Bind all trigger buttons across the site
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.open-cookie-settings, [data-action="open-cookie-settings"], #openCookieSettings');
    if (trigger) {
      e.preventDefault();
      openPreferencesModal(trigger);
    }
  });

  let lastActiveElement = null;

  function ensureCmpDom() {
    if (document.getElementById('ostrelyaCmpBanner')) return;

    const cmpContainer = document.createElement('div');
    cmpContainer.id = 'ostrelyaCmpContainer';
    cmpContainer.innerHTML = `
      <!-- Cookie Banner -->
      <aside class="ostrelya-cmp-banner" id="ostrelyaCmpBanner" role="region" aria-label="Cookie consent banner" aria-hidden="true" style="display: none;">
        <div class="cmp-banner-head">
          <span class="cmp-banner-badge">Privacy &amp; Cookies</span>
          <span class="cmp-banner-line" aria-hidden="true"></span>
        </div>
        <p class="cmp-banner-text">
          We use strictly necessary cookies to ensure the proper functioning of this website. Non-essential cookies (such as analytics) are optional and disabled by default. Read our <a href="cookies.html">Cookie Policy</a> and <a href="privacy.html">Privacy Notice</a>.
        </p>
        <div class="cmp-banner-actions">
          <div class="cmp-action-row">
            <button type="button" class="cmp-btn cmp-btn-primary" id="cmpAcceptAll">Accept all</button>
            <button type="button" class="cmp-btn cmp-btn-secondary" id="cmpRejectNonEssential">Reject non-essential</button>
          </div>
          <button type="button" class="cmp-btn cmp-btn-link" id="cmpOpenPreferences">Cookie settings</button>
        </div>
      </aside>

      <!-- Preferences Modal -->
      <div class="ostrelya-cmp-backdrop" id="ostrelyaCmpModal" role="dialog" aria-modal="true" aria-labelledby="cmpModalTitle" aria-hidden="true">
        <div class="ostrelya-cmp-modal">
          <div class="cmp-modal-header">
            <h2 class="cmp-modal-title" id="cmpModalTitle">Cookie Preferences</h2>
            <button type="button" class="cmp-modal-close" id="cmpCloseModal" aria-label="Close cookie settings (Escape)">
              <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="2" y1="12" x2="12" y2="2"></line>
                <polyline points="2 2 12 12"></polyline>
              </svg>
            </button>
          </div>
          <div class="cmp-modal-body">
            <p class="cmp-modal-intro">
              Customize your privacy preferences below. Strictly necessary cookies cannot be disabled as they are required for security and core navigation. Non-essential cookies help us measure performance and improve your experience.
            </p>

            <!-- Necessary -->
            <div class="cmp-category-card">
              <div class="cmp-category-head">
                <span class="cmp-category-name">Strictly Necessary</span>
                <span class="cmp-badge-locked">Always Active</span>
              </div>
              <p class="cmp-category-desc">
                Required for core website functionality, security, and storing your consent preferences. No personal tracking is performed.
              </p>
            </div>

            <!-- Analytics -->
            <div class="cmp-category-card">
              <div class="cmp-category-head">
                <label for="cmpToggleAnalytics" class="cmp-category-name" style="cursor:pointer;">Analytics &amp; Performance</label>
                <label class="cmp-switch" for="cmpToggleAnalytics">
                  <input type="checkbox" id="cmpToggleAnalytics" aria-label="Enable analytics cookies" />
                  <span class="cmp-slider" aria-hidden="true"></span>
                </label>
              </div>
              <p class="cmp-category-desc">
                Allows us to aggregate anonymous visitor telemetry to understand website performance and improve user journeys.
              </p>
            </div>

            <!-- Marketing -->
            <div class="cmp-category-card">
              <div class="cmp-category-head">
                <label for="cmpToggleMarketing" class="cmp-category-name" style="cursor:pointer;">Marketing &amp; Personalization</label>
                <label class="cmp-switch" for="cmpToggleMarketing">
                  <input type="checkbox" id="cmpToggleMarketing" aria-label="Enable marketing cookies" />
                  <span class="cmp-slider" aria-hidden="true"></span>
                </label>
              </div>
              <p class="cmp-category-desc">
                Currently not utilized by Ostrelya Studio. Kept disabled unless specific campaigns or personalized media are introduced.
              </p>
            </div>
          </div>
          <div class="cmp-modal-footer">
            <button type="button" class="cmp-btn cmp-btn-secondary" id="cmpModalRejectAll">Reject all</button>
            <button type="button" class="cmp-btn cmp-btn-primary" id="cmpSavePreferences">Save preferences</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(cmpContainer);

    // Bind CMP banner buttons
    document.getElementById('cmpAcceptAll').addEventListener('click', () => {
      window.OstrelyaConsent.setConsent({ analytics: true, marketing: true });
      closeBanner();
    });

    document.getElementById('cmpRejectNonEssential').addEventListener('click', () => {
      window.OstrelyaConsent.setConsent({ analytics: false, marketing: false });
      closeBanner();
    });

    document.getElementById('cmpOpenPreferences').addEventListener('click', () => {
      openPreferencesModal();
    });

    // Bind CMP Modal buttons
    document.getElementById('cmpCloseModal').addEventListener('click', () => {
      closePreferencesModal();
    });

    document.getElementById('cmpModalRejectAll').addEventListener('click', () => {
      window.OstrelyaConsent.setConsent({ analytics: false, marketing: false });
      closePreferencesModal();
      closeBanner();
    });

    document.getElementById('cmpSavePreferences').addEventListener('click', () => {
      const analyticsChecked = document.getElementById('cmpToggleAnalytics').checked;
      const marketingChecked = document.getElementById('cmpToggleMarketing').checked;
      window.OstrelyaConsent.setConsent({ analytics: analyticsChecked, marketing: marketingChecked });
      closePreferencesModal();
      closeBanner();
    });

    // Close on backdrop click
    const modalBackdrop = document.getElementById('ostrelyaCmpModal');
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closePreferencesModal();
      }
    });

    // Keyboard navigation (Escape on document & focus trap on modal)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('ostrelyaCmpModal');
        if (modal && modal.classList.contains('active')) {
          closePreferencesModal();
        }
      }
    });

    modalBackdrop.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const focusable = modalBackdrop.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  function openBanner() {
    const banner = document.getElementById('ostrelyaCmpBanner');
    if (!banner) return;
    banner.style.display = 'flex';
    banner.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      banner.classList.add('active', 'visible');
    });
  }

  function closeBanner() {
    const banner = document.getElementById('ostrelyaCmpBanner');
    if (!banner) return;
    banner.classList.remove('active', 'visible');
    banner.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      banner.style.display = 'none';
    }, 400);
  }

  function openPreferencesModal(triggerElement = null) {
    lastActiveElement = triggerElement || document.activeElement;
    const modal = document.getElementById('ostrelyaCmpModal');
    if (!modal) return;

    // Load existing settings into toggles
    const existing = window.OstrelyaConsent.getConsent() || { analytics: false, marketing: false };
    const toggleAnalytics = document.getElementById('cmpToggleAnalytics');
    const toggleMarketing = document.getElementById('cmpToggleMarketing');
    if (toggleAnalytics) toggleAnalytics.checked = Boolean(existing.analytics);
    if (toggleMarketing) toggleMarketing.checked = Boolean(existing.marketing);

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button
    const closeBtn = document.getElementById('cmpCloseModal');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 50);
    }
  }

  function closePreferencesModal() {
    const modal = document.getElementById('ostrelyaCmpModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }
}

/* ==========================================================================
   8. ACCESSIBLE SERVICE MODALS CONTROLLER (services.html)
   Near-fullscreen architectural dialogs with WCAG 2.2 focus management
   ========================================================================== */
function initServiceModals() {
  const cards = document.querySelectorAll('.service-card[data-service-id]');
  if (!cards.length) return;

  let activeModal = null;
  let activeTrigger = null;

  cards.forEach(card => {
    const serviceId = card.getAttribute('data-service-id');
    const targetModal = document.getElementById(`service-modal-${serviceId}`);
    if (!targetModal) return;

    const handleOpen = (e) => {
      e.preventDefault();
      openModal(targetModal, card);
    };

    card.addEventListener('click', handleOpen);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(targetModal, card);
      }
    });
  });

  // Modal close handlers
  const allModals = document.querySelectorAll('.service-modal-backdrop');
  allModals.forEach(modal => {
    const closeBtn = modal.querySelector('.service-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  });

  // Global Escape key support for active service modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeModal) {
      closeModal(activeModal);
    }
  });

  function openModal(modal, trigger) {
    activeModal = modal;
    activeTrigger = trigger;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const closeBtn = modal.querySelector('.service-modal-close');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 60);
    }
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    const triggerToFocus = activeTrigger;
    activeModal = null;
    activeTrigger = null;

    if (triggerToFocus && typeof triggerToFocus.focus === 'function') {
      setTimeout(() => {
        triggerToFocus.focus();
      }, 50);
    }
  }
}

/* ==========================================================================
   9. PROJECT INQUIRY FORM CONTROLLER
   Privacy-first, data-minimized client validation and accessible live feedback
   ========================================================================== */
function initInquiryForm() {
  const form = document.getElementById('inquiryForm');
  if (!form) return;

  const statusBox = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmitBtn');
  const nameInput = document.getElementById('formName');
  const emailInput = document.getElementById('formEmail');
  const messageInput = document.getElementById('formMessage');
  const honeypotInput = document.getElementById('formWebsite');
  const tokenInput = document.getElementById('formTimestamp');

  // Set anti-bot timestamp token
  if (tokenInput) {
    tokenInput.value = Date.now().toString();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check honeypot (anti-spam without invasive tracking)
    if (honeypotInput && honeypotInput.value.trim() !== '') {
      // Bot detected: simulate success silently
      showSuccessFeedback();
      form.reset();
      return;
    }

    // Reset validation states
    clearErrors();

    let isValid = true;
    let firstInvalid = null;

    // Validate Name
    if (!nameInput.value.trim()) {
      setError(nameInput, 'Please enter your name.');
      isValid = false;
      if (!firstInvalid) firstInvalid = nameInput;
    }

    // Validate Email
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
      setError(emailInput, 'Please enter your work email address.');
      isValid = false;
      if (!firstInvalid) firstInvalid = emailInput;
    } else if (!emailRegex.test(emailValue)) {
      setError(emailInput, 'Please provide a valid email format (e.g. name@domain.com).');
      isValid = false;
      if (!firstInvalid) firstInvalid = emailInput;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      setError(messageInput, 'Please provide a brief overview of your project or requirements.');
      isValid = false;
      if (!firstInvalid) firstInvalid = messageInput;
    } else if (messageInput.value.trim().length < 10) {
      setError(messageInput, 'Please provide at least 10 characters describing your inquiry.');
      isValid = false;
      if (!firstInvalid) firstInvalid = messageInput;
    }

    if (!isValid) {
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // UI Feedback: Submitting
    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending inquiry...</span>';

    try {
      // Simulate respectful async processing
      await new Promise((resolve) => setTimeout(resolve, 800));

      showSuccessFeedback();
      form.reset();
      if (tokenInput) tokenInput.value = Date.now().toString();
    } catch (err) {
      showErrorFeedback('An error occurred while submitting your message. Please try again or reach out directly to hello@ostrelya.com.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHtml;
    }
  });

  function setError(input, message) {
    input.setAttribute('aria-invalid', 'true');
    input.classList.add('has-error');
    const errorElem = document.getElementById(`${input.id}Error`);
    if (errorElem) {
      errorElem.textContent = message;
      errorElem.style.display = 'block';
    }
  }

  function clearErrors() {
    [nameInput, emailInput, messageInput].forEach((input) => {
      if (input) {
        input.removeAttribute('aria-invalid');
        input.classList.remove('has-error');
        const errorElem = document.getElementById(`${input.id}Error`);
        if (errorElem) {
          errorElem.textContent = '';
          errorElem.style.display = 'none';
        }
      }
    });
    if (statusBox) {
      statusBox.className = 'form-status';
      statusBox.style.display = 'none';
      statusBox.textContent = '';
    }
  }

  function showSuccessFeedback() {
    if (!statusBox) return;
    statusBox.className = 'form-status success';
    statusBox.textContent = 'Thank you for reaching out. Your inquiry has been received with strict confidentiality. We typically respond within 24–48 business hours.';
    statusBox.style.display = 'block';
    statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showErrorFeedback(msg) {
    if (!statusBox) return;
    statusBox.className = 'form-status error';
    statusBox.textContent = msg;
    statusBox.style.display = 'block';
    statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}


