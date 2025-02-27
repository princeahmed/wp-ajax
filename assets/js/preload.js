const wpAjaxPreload = () => {

  const maxRPS = 3;
  const delay = 0;
  const hoverDelay = 50;
  const ignoreKeywords = ['/wp-admin','/wp-login.php','/cart','/checkout','add-to-cart','logout','#','?','.png','.jpeg','.jpg','.gif','.svg','.webp'];

  const toPrefetch = new Set();
  const alreadyPrefetched = new Set();

  // Check browser support for native 'prefetch'
  const prefetcher = document.createElement("link");

  const isSupported =
    prefetcher.relList &&
    prefetcher.relList.supports &&
    prefetcher.relList.supports("prefetch") &&
    window.IntersectionObserver &&
    "isIntersecting" in IntersectionObserverEntry.prototype;

  // Checks if user is on slow connection or has enabled data saver
  const isSlowConnection =
    navigator.connection &&
    (navigator.connection.saveData ||
      (navigator.connection.effectiveType || "").includes("2g"));

  // Don't start preloading if user is on a slow connection or not supported
  if (isSlowConnection || !isSupported) return;

  // Prefetch the given url using native 'prefetch'. Fallback to 'xhr' if not supported
  const prefetch = url => new Promise((resolve, reject) => {
    const link = document.createElement(`link`);
    link.rel = `prefetch`;
    link.href = url;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });

  // Prefetch pages with a timeout
  const prefetchWithTimeout = url => {
    const timer = setTimeout(() => stopPreloading(), 5000);
    prefetch(url).catch(() => stopPreloading()).finally(() => clearTimeout(timer));
  };

  const addUrlToQueue = (url, processImmediately = false) => {

    if (alreadyPrefetched.has(url) || toPrefetch.has(url)) return;

    // Prevent preloading 3rd party domains
    const origin = window.location.origin;
    if (url.substring(0, origin.length) !== origin) return;

    // Prevent current page from preloading
    if (window.location.href === url) return;

    // Ignore keywords in the array, if matched to the url
    for (let i = 0; i < ignoreKeywords.length; i++) {
      if (url.includes(ignoreKeywords[i])) return;
    }

    // If max RPS is 0 or is on mouse hover, process immediately (without queue)
    if (processImmediately) {
      prefetchWithTimeout(url);
      alreadyPrefetched.add(url);
    } else toPrefetch.add(url);

  };

  // Observe the links in viewport, add url to queue if found intersecting
  const linksObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const url = entry.target.href;
        addUrlToQueue(url, !maxRPS);
      }
    });
  });

  // Queue that process requests based on max RPS (requests per second)
  const startQueue = () =>
    setInterval(() => {
      Array.from(toPrefetch)
        .slice(0, maxRPS)
        .forEach(url => {
          prefetchWithTimeout(url);
          alreadyPrefetched.add(url);
          toPrefetch.delete(url);
        });
    }, 1000);

  let hoverTimer = null;

  // Add URL to queue on mouse hover, after timeout
  const mouseOverListener = event => {
    const elm = event.target.closest("a");
    if (elm && elm.href && !alreadyPrefetched.has(elm.href)) {
      hoverTimer = setTimeout(() => {
        addUrlToQueue(elm.href, true);
      }, hoverDelay);
    }
  };

  // Preload on touchstart on mobile
  const touchStartListener = event => {
    const elm = event.target.closest("a");
    if (elm && elm.href && !alreadyPrefetched.has(elm.href))
      addUrlToQueue(elm.href, true);
  };

  // Clear timeout on mouse out if not already preloaded
  const mouseOutListener = event => {
    const elm = event.target.closest("a");
    if (elm && elm.href && !alreadyPrefetched.has(elm.href)) {
      clearTimeout(hoverTimer);
    }
  };

  // Fallback for requestIdleCallback https://caniuse.com/#search=requestIdleCallback
  const requestIdleCallback =
    window.requestIdleCallback ||
    function (cb) {
      const start = Date.now();
      return setTimeout(function () {
        cb({
          didTimeout: false,
          timeRemaining: function () {
            return Math.max(0, 50 - (Date.now() - start));
          }
        });
      }, 1);
    };

  // Stop preloading in case server is responding slow/errors
  const stopPreloading = () => {
    // Find all links are remove it from observer (viewport)
    document.querySelectorAll("a").forEach(e => linksObserver.unobserve(e));

    // Clear pending links in queue
    toPrefetch.clear();

    // Remove event listeners for mouse hover and mobile touch
    document.removeEventListener("mouseover", mouseOverListener, true);
    document.removeEventListener("mouseout", mouseOutListener, true);
    document.removeEventListener("touchstart", touchStartListener, true);
  };

  // Start Queue
  startQueue();

  // Start preloading links in viewport on idle callback, with a delay
  requestIdleCallback(() =>
    setTimeout(() =>
        document.querySelectorAll("a").forEach(e => linksObserver.observe(e)), delay * 1000
    )
  );

  // Add event listeners to detect mouse hover and mobile touch
  const listenerOptions = {capture: true, passive: true};
  document.addEventListener("mouseover", mouseOverListener, listenerOptions);
  document.addEventListener("mouseout", mouseOutListener, listenerOptions);
  document.addEventListener("touchstart", touchStartListener, listenerOptions);
};

export default wpAjaxPreload;
