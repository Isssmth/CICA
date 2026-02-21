
const authorityEmail = "admin@campushealth.org";

let locations = JSON.parse(localStorage.getItem("padLocations")) || [
  { id: 1, name: "Library - Ground Floor", status: "In Stock", reports: 0 },
  { id: 2, name: "Engineering Block - 2nd Floor", status: "In Stock", reports: 0 },
  { id: 3, name: "Cafeteria Washroom", status: "In Stock", reports: 0 }
];

const container = document.getElementById("locations-container");


function renderLocations() {
  container.innerHTML = "";

  locations.forEach(location => {
    const card = document.createElement("div");
    card.className = "location-card";

    const statusClass =
      location.status === "In Stock" ? "in-stock" : "out-of-stock";

   card.innerHTML = `
  <h3>${location.name}</h3>
  <p class="status ${statusClass}">
    Status: ${location.status}
  </p>
  <p>Reports: ${location.reports}</p>
  <button onclick="reportOutOfStock(${location.id})">
    Report Out of Stock
  </button>

`;

    container.appendChild(card);
  });

  updateInsights();
  saveToLocalStorage();
}


function reportOutOfStock(id) {
  const location = locations.find(loc => loc.id === id);

  location.reports++;

  
  if (location.reports >= 2 && location.status !== "Out of Stock") {
  location.status = "Out of Stock";
  simulateEmailNotification(location);
}

  renderLocations();
  renderNotificationLog();
}

function simulateEmailNotification(location) {

  const notification = {
    to: authorityEmail,
    location: location.name,
    status: location.status,
    time: new Date().toLocaleString()
  };

 
  let emailLogs = JSON.parse(localStorage.getItem("emailLogs")) || [];
  emailLogs.push(notification);
  localStorage.setItem("emailLogs", JSON.stringify(emailLogs));
  renderNotificationLog();

  console.log("📧 Email Sent:");
  console.log(`
    To: ${authorityEmail}
    Subject: Pad Out of Stock Alert
    Location: ${location.name}
    Time: ${notification.time}
    Action Required: Immediate Restocking
  `);

  alert(`📧 Alert sent to ${authorityEmail}`);
}


function updateInsights() {
  document.getElementById("totalLocations").innerText = locations.length;

  const outOfStock = locations.filter(
    loc => loc.status === "Out of Stock"
  ).length;

  document.getElementById("outOfStockCount").innerText = outOfStock;
}


function saveToLocalStorage() {
  localStorage.setItem("padLocations", JSON.stringify(locations));
}


renderLocations();
renderNotificationLog();



function toggleSection(id) {
  const element = document.getElementById(id);
  element.classList.toggle("hidden-content");
}

function renderNotificationLog() {
  const logContainer = document.getElementById("notification-log");
  const logs = JSON.parse(localStorage.getItem("emailLogs")) || [];

  logContainer.innerHTML = "";

  if (logs.length === 0) {
    logContainer.innerHTML = "<p>No alerts sent yet.</p>";
    return;
  }

  logs.forEach(log => {
    const entry = document.createElement("div");
    entry.style.marginBottom = "10px";
    entry.innerHTML = `
      <strong>Location:</strong> ${log.location}<br>
      <strong>Time:</strong> ${log.time}<br>
      <strong>Status:</strong> ${log.status}
      <hr>
    `;
    logContainer.appendChild(entry);
  });
}

function restock() {
  locations.forEach(location => {
    location.status = "In Stock";
    location.reports = 0;
  });

  saveToLocalStorage();
  renderLocations();
  updateInsights();

  alert("✅ All locations have been restocked by Admin.");
}

function clearLogs() {
  localStorage.removeItem("emailLogs");
  renderNotificationLog();
  alert("🗑 Notification log cleared by Admin.");
}