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
