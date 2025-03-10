async function loadAnnouncements() {
    console.log("Fetching announcements...");
    
    try {
        const response = await fetch("announcements.json");
        if (!response.ok) throw new Error("Failed to fetch announcements.");
        
        const announcements = await response.json();
        const announcementsElement = document.getElementById("announcements");

        if (!announcementsElement) {
            console.error("Announcements element not found in DOM.");
            return;
        }

        if (announcements.length === 0) {
            announcementsElement.innerHTML = "<p>No announcements as of yet.</p>";
            return;
        }

        let announcementsHTML = "<ul>";
        announcements.forEach(announcement => {
            announcementsHTML += `<li><strong>${announcement.date}:</strong> ${announcement.message}</li>`;
        });
        announcementsHTML += "</ul>";

        announcementsElement.innerHTML = announcementsHTML;
        console.log("✅ Announcements updated successfully!");
    } catch (error) {
        console.error("❌ Error loading announcements:", error);
        document.getElementById("announcements").innerHTML = "<p>Error loading announcements.</p>";
    }
}

// Load announcements when the page loads
document.addEventListener("DOMContentLoaded", loadAnnouncements);
