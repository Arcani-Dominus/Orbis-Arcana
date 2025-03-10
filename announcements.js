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

        if (data.length === 0) {
            announcementsElement.innerText = "No announcements at this time.";
            return;
        }

        announcementsElement.innerText = data[0].message;
        console.log("✅ Announcements updated successfully!");

    } catch (error) {
        console.error("❌ Error loading announcements:", error);
        document.getElementById("announcements").innerText = "📢 Failed to load announcements.";
    }
}
