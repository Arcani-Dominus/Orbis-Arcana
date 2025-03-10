export async function loadAnnouncements() {
    try {
        console.log("📢 Fetching announcements...");
        const response = await fetch("announcements.json");

        if (!response.ok) throw new Error("Failed to load announcements");

        const data = await response.json();
        console.log("✅ Announcements data:", data);

        const announcementsElement = document.getElementById("announcements");

        if (!announcementsElement) {
            console.error("❌ Element with ID 'announcements' not found in the HTML!");
            return;
        }

        announcementsElement.innerText = data.length > 0 ? data[0].message : "No announcements at this time.";
        console.log("✅ Announcements updated successfully!");

    } catch (error) {
        console.error("❌ Error loading announcements:", error);
        document.getElementById("announcements").innerText = "📢 Failed to load announcements.";
    }
}

// Ensure script runs AFTER page loads
document.addEventListener("DOMContentLoaded", loadAnnouncements);
