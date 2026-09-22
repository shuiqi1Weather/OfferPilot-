(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const config = window.OFFERPILOT_CONFIG || {};
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let motionPaused = reduceMotion.matches;
  const motionToggle = $("#motion-toggle");
  const tilt = $("[data-tilt]");
  function setMotion(paused) {
    motionPaused = paused || reduceMotion.matches;
    document.body.classList.toggle("motion-paused", motionPaused);
    motionToggle.setAttribute("aria-pressed", String(motionPaused));
    motionToggle.disabled = reduceMotion.matches;
    motionToggle.innerHTML = reduceMotion.matches ? '已遵循系统减少动效设置' : motionPaused ? '开启动效 <span aria-hidden="true">▷</span>' : '暂停动效 <span aria-hidden="true">Ⅱ</span>';
    if (motionPaused) tilt.style.removeProperty("transform");
  }
  setMotion(motionPaused);
  motionToggle.addEventListener("click", () => setMotion(!motionPaused));
  reduceMotion.addEventListener("change", (event) => setMotion(event.matches));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    document.body.classList.add("motion-ready");
  }
  const visual = $(".hero-visual");
  visual.addEventListener("pointermove", (event) => {
    if (motionPaused || reduceMotion.matches || event.pointerType !== "mouse" || window.innerWidth < 901) return;
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tilt.style.transform = `rotateY(${-10 + x * 6}deg) rotateX(${4 - y * 5}deg) rotateZ(1deg)`;
  });
  visual.addEventListener("pointerleave", () => tilt.style.removeProperty("transform"));

  const menu = $(".menu-toggle");
  const nav = $("#nav-links");
  function closeMenu() { menu.setAttribute("aria-expanded", "false"); menu.setAttribute("aria-label", "打开导航"); nav.classList.remove("is-open"); }
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
    nav.classList.toggle("is-open", open);
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") { closeMenu(); menu.focus(); } });
  document.addEventListener("click", (event) => { if (!event.target.closest(".nav-wrap")) closeMenu(); });

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function activateTab(tab, moveFocus = false) {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute("aria-controls")).hidden = !selected;
    });
    if (moveFocus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
    });
  });
  $("#year").textContent = new Date().getFullYear();

  function detectRepository() {
    const valid = /^[a-zA-Z0-9][a-zA-Z0-9-]*\/[a-zA-Z0-9_.-]+$/;
    if (config.repository && valid.test(config.repository)) return config.repository;
    const host = location.hostname.toLowerCase();
    if (!host.endsWith(".github.io")) return null;
    const owner = host.slice(0, -".github.io".length);
    let segment;
    try { segment = decodeURIComponent(location.pathname.split("/").filter(Boolean)[0] || ""); } catch { return null; }
    const name = !segment || segment.endsWith(".html") ? `${owner}.github.io` : segment;
    const candidate = `${owner}/${name}`;
    return valid.test(candidate) ? candidate : null;
  }
  const button = $("#download-button");
  const label = $("#download-label");
  const status = $("#download-status");
  const version = $("#version-label");
  const releaseLink = $("#release-link");
  version.textContent = config.version || "v53";
  async function connectDownload() {
    const repository = detectRepository();
    if (!repository) {
      label.textContent = "发布后即可下载";
      status.textContent = "本地预览：上传 GitHub 并发布 Windows 下载包后，这里会自动连接下载。";
      return;
    }
    const repoURL = `https://github.com/${repository}`;
    const githubLink = $("#github-link");
    githubLink.href = repoURL;
    githubLink.hidden = false;
    releaseLink.href = `${repoURL}/releases`;
    releaseLink.hidden = false;
    const assetName = config.assetName || "OfferPilot_v53_Windows.zip";
    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), 8000);
    try {
      const response = await fetch(`https://api.github.com/repos/${repository}/releases/latest`, { headers: { Accept: "application/vnd.github+json" }, signal: abort.signal, credentials: "omit" });
      if (response.status === 404) {
        label.textContent = "下载包即将发布";
        status.textContent = "当前仓库尚未发布正式 Release 下载包，请稍后再来。";
        return;
      }
      if (!response.ok) throw new Error("Release service unavailable");
      const release = await response.json();
      const asset = Array.isArray(release.assets) ? release.assets.find((item) => item.name === assetName && item.state === "uploaded") : null;
      if (!asset) {
        label.textContent = "查看已发布文件";
        button.href = `${repoURL}/releases`;
        status.textContent = "此版本暂未附带对应的 Windows 安装包，可查看发行页。";
        return;
      }
      const assetURL = new URL(asset.browser_download_url);
      const expectedPrefix = `/${repository}/releases/download/`.toLowerCase();
      if (assetURL.protocol !== "https:" || assetURL.hostname !== "github.com" || !assetURL.pathname.toLowerCase().startsWith(expectedPrefix)) throw new Error("Unexpected release asset location");
      button.href = assetURL.href;
      label.textContent = "下载 Windows 版";
      button.setAttribute("download", assetName);
      const size = Number(asset.size) > 0 ? ` · ${(Number(asset.size) / 1024 / 1024).toFixed(1)} MB` : "";
      status.textContent = `${config.version || "v53"} · 64 位 ZIP 安装包${size} · 由 GitHub 提供下载`;
      if (/Android|iPhone|iPad/i.test(navigator.userAgent)) status.textContent += "；请在 Windows 电脑上安装";
    } catch {
      // 即使公共 API 被限流或网络失败，也保留不依赖 API 的官方发行页入口。
      label.textContent = "前往 GitHub 下载";
      button.href = `${repoURL}/releases`;
      status.textContent = "暂时无法读取版本信息，仍可从 GitHub 发行页下载。";
    } finally { clearTimeout(timeout); }
  }
  connectDownload();
})();
