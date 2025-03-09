document.addEventListener("DOMContentLoaded", () => {
    fetch("announcements.json")
        .then(response => response.json())
        .then(data => {
            const announcementsElement = document.getElementById("announcements");

            if (data.length === 0) {
                announcementsElement.innerHTML = "📢 No announcements at the moment.";
            } else {
                let announcementHTML = "";
                data.forEach(announcement => {
                    announcementHTML += `<p>🔔 <strong>${announcement.title}:</strong> ${announcement.message}</p>`;
                });
                announcementsElement.innerHTML = announcementHTML;
            }
        })
        .catch(error => {
            console.error("Error loading announcements:", error);
            document.getElementById("announcements").innerHTML = "📢 Error loading announcements.";
        });
});
