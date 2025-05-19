const container = document.getElementById("notify-container");
const activeNotifies = {}; // track duplicates by type+message

window.addEventListener("message", (event) => {
    if (event.data.action === "showNotification") {
        showNotification(event.data.data);
    }
});

function showNotification(data) {
    const duration = data.duration || 5000;
    const key = `${data.type}|${data.message}`;
    let notify = activeNotifies[key];

    if (notify) {
        // Duplicate notification: increment counter and reset timer
        const counter = notify.querySelector(".counter");
        counter.textContent = parseInt(counter.textContent) + 1;
        clearTimeout(notify.timeout);
        notify.timeout = setTimeout(() => removeNotification(key), duration);
        return;
    }

    // Create notification element
    notify = document.createElement("div");
    notify.classList.add("notify", data.type || "info", data.animationIn || "fadeInDown");
    notify.textContent = data.message || "Notification";

    // Add counter span for duplicates
    const counter = document.createElement("span");
    counter.classList.add("counter");
    counter.textContent = "1";
    notify.appendChild(counter);

    // Set container position
    container.className = data.position || "top-right";
    container.appendChild(notify);

    // Play sound safely, with preload
    if (data.sound) {
        try {
            const audio = new Audio(data.sound);
            audio.volume = 1.0;
            audio.load(); // Preload to avoid autoplay issues
            audio.play().catch(() => {
                // Silent catch — no sound if blocked
            });
        } catch {
            // Ignore errors silently
        }
    }

    // Remove entrance animation class after it ends
    notify.addEventListener("animationend", () => {
        notify.classList.remove(data.animationIn);
    }, { once: true });

    // Setup exit animation and removal timer
    notify.timeout = setTimeout(() => {
        notify.classList.add(data.animationOut || "fadeOutUp");
        notify.addEventListener("animationend", () => {
            removeNotification(key);
        }, { once: true });
    }, duration);

    activeNotifies[key] = notify;
}

function removeNotification(key) {
    const notify = activeNotifies[key];
    if (!notify) return;
    if (notify.parentNode) notify.parentNode.removeChild(notify);
    delete activeNotifies[key];
}
