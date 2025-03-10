// ✅ Load announcements from announcements.json
export async function loadAnnouncements() {
    console.log("📢 Loading announcements from announcements.json...");

    try {
        const response = await fetch("announcements.json"); // Fetch local file
        const data = await response.json();

        const announcementsElement = document.getElementById("announcements");

        if (!data.announcements || data.announcements.length === 0) {
            console.log("ℹ️ No announcements found.");
            announcementsElement.innerHTML = "No announcements at the moment.";
            return;
        }

        // ✅ Display the latest announcement
        const latestAnnouncement = data.announcements[0];
        announcementsElement.innerHTML = `<strong>${latestAnnouncement.title}</strong>: ${latestAnnouncement.message}`;

        console.log("✅ Announcements updated successfully!");
    } catch (error) {
        console.error("❌ Error fetching announcements:", error);
        document.getElementById("announcements").innerHTML = "Error loading announcements.";
    }
}
