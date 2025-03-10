export async function loadAnnouncements() {
    const announcementsElement = document.getElementById("announcements");

    try {
        const response = await fetch("announcements.json"); // Load JSON
        const data = await response.json();

        if (data.length > 0) {
            announcementsElement.innerHTML = data.map(a => `📢 ${a.message}`).join("<br>");
        } else {
            announcementsElement.innerText = "📢 No announcements as of yet.";
        }
    } catch (error) {
        console.error("Error loading announcements:", error);
        announcementsElement.innerText = "📢 Error loading announcements.";
    }
}

// ✅ Load on page load
document.addEventListener("DOMContentLoaded", loadAnnouncements);
