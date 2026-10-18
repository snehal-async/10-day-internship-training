import gsap from 'gsap';
/**
 * GSAP Enterprise Animation System for FacilityOps
 * Provides hardware-accelerated micro-animations, modal pop-ins, card staggers,
 * and numeric telemetry transitions.
 */
/**
 * Animate modal window entrance with smooth spring scale & fade
 */
export function animateModalEntrance(element) {
    if (!element)
        return null;
    return gsap.fromTo(element, {
        opacity: 0,
        scale: 0.94,
        y: 12,
    }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.24,
        ease: 'power2.out',
    });
}
/**
 * Animate stagger entrance of child cards / panels
 */
export function animateStaggerEntrance(selectorOrElements, delay = 0.05) {
    return gsap.fromTo(selectorOrElements, {
        opacity: 0,
        y: 16,
    }, {
        opacity: 1,
        y: 0,
        duration: 0.32,
        stagger: 0.06,
        delay,
        ease: 'power2.out',
    });
}
/**
 * Animate data table rows with subtle ripple stagger
 */
export function animateTableRowStagger(selectorOrElements) {
    return gsap.fromTo(selectorOrElements, {
        opacity: 0,
        x: -6,
    }, {
        opacity: 1,
        x: 0,
        duration: 0.22,
        stagger: 0.03,
        ease: 'power1.out',
    });
}
/**
 * Animate page container entrance on route transition
 */
export function animatePageEnter(element) {
    if (!element)
        return null;
    return gsap.fromTo(element, {
        opacity: 0,
        y: 8,
    }, {
        opacity: 1,
        y: 0,
        duration: 0.22,
        ease: 'power2.out',
    });
}
/**
 * Animate numeric counter value smoothly
 */
export function animateNumberCounter(element, start, end, duration = 0.8) {
    if (!element)
        return;
    const obj = { val: start };
    gsap.to(obj, {
        val: end,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
            element.innerText = Math.round(obj.val).toLocaleString();
        },
    });
}
