const hero = document.querySelector('.hero');
const artwork = document.querySelector('.hero-art');
const motionButton = document.querySelector('.motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let manuallyPaused = false;
let framePending = false;
let heroHeight = hero.offsetHeight;

function updateArtwork() {
    framePending = false;
    if (reducedMotion.matches || manuallyPaused) return;

    const scroll = Math.max(0, window.scrollY);
    // Move only the artwork, keeping the text and fade in the normal page flow.
    const progress = Math.min(scroll / heroHeight, 1);
    artwork.style.transform = `translate3d(0, ${Math.min(scroll, heroHeight) * 0.24}px, 0)`;
    artwork.style.opacity = String(1 - progress * 0.85);
}

function requestUpdate() {
    if (framePending || reducedMotion.matches || manuallyPaused) return;
    framePending = true;
    window.requestAnimationFrame(updateArtwork);
}

function updateMotionPreference() {
    const paused = reducedMotion.matches || manuallyPaused;
    document.documentElement.classList.toggle('motion-paused', paused);
    motionButton.hidden = reducedMotion.matches;
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.textContent = paused ? 'Resume motion' : 'Pause motion';
    if (paused) {
        artwork.style.removeProperty('transform');
        artwork.style.removeProperty('opacity');
    } else {
        requestUpdate();
    }
}

motionButton.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    updateMotionPreference();
});
reducedMotion.addEventListener('change', updateMotionPreference);
window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', () => {
    heroHeight = hero.offsetHeight;
    requestUpdate();
}, { passive: true });
updateMotionPreference();
