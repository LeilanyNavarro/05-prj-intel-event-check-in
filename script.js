// Get All DOM Elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const attendeeListBody = document.getElementById("attendeeListBody");
const attendeeListCount = document.getElementById("attendeeListCount");

// Track Attendance
let count = 0;
let attendees = [];
const maxCount = 50;
const savedAttendance = localStorage.getItem("attendanceData");

if (savedAttendance) {
  const attendance = JSON.parse(savedAttendance);
  count = attendance.count;
  document.getElementById("waterCount").textContent = attendance.teams.water;
  document.getElementById("zeroCount").textContent = attendance.teams.zero;
  document.getElementById("powerCount").textContent = attendance.teams.power;
  attendees = attendance.attendees || [];
}

attendeeCount.textContent = count;
progressBar.style.width = Math.round((count / maxCount) * 100) + "%";

function renderAttendees() {
  attendeeListBody.textContent = "";

  if (attendees.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 2;
    emptyCell.textContent = "No attendees checked in yet";
    emptyRow.appendChild(emptyCell);
    attendeeListBody.appendChild(emptyRow);
  } else {
    for (let i = 0; i < attendees.length; i++) {
      const row = document.createElement("tr");
      const nameCell = document.createElement("td");
      const teamCell = document.createElement("td");

      nameCell.textContent = attendees[i].name;
      teamCell.textContent = attendees[i].team;
      row.appendChild(nameCell);
      row.appendChild(teamCell);
      attendeeListBody.appendChild(row);
    }
  }

  attendeeListCount.textContent = attendees.length;
}

renderAttendees();

function showGoalCelebration() {
  const teamCards = document.querySelectorAll(".team-card");
  let highestTeamCount = 0;

  for (let i = 0; i < teamCards.length; i++) {
    const teamCount = parseInt(
      teamCards[i].querySelector(".team-count").textContent,
    );
    if (teamCount > highestTeamCount) {
      highestTeamCount = teamCount;
    }
  }

  const winningTeams = [];
  for (let i = 0; i < teamCards.length; i++) {
    const teamCount = parseInt(
      teamCards[i].querySelector(".team-count").textContent,
    );
    if (teamCount === highestTeamCount) {
      winningTeams.push(
        teamCards[i].querySelector(".team-name").textContent.trim(),
      );
      teamCards[i].classList.add("winning-team");
    }
  }

  const winningLabel =
    winningTeams.length > 1 ? "Winning teams: " : "Winning team: ";
  greeting.textContent = `🎉 Check-in goal reached! ${winningLabel}`;

  const winningTeamNames = document.createElement("strong");
  winningTeamNames.textContent = winningTeams.join(", ");
  greeting.appendChild(winningTeamNames);
  greeting.classList.add("success-message");
  greeting.style.display = "block";
  document.getElementById("checkInBtn").disabled = true;
}

if (count >= maxCount) {
  showGoalCelebration();
}

// Handle Form Subission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (count >= maxCount) {
    return;
  }

  // Get Form Values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  // Increment Count
  count++;
  console.log("Total check-ins: ", count);
  attendeeCount.textContent = count;

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Progress: ${percentage}`);
  progressBar.style.width = percentage;

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  attendees.push({ name: name, team: teamName });
  renderAttendees();

  const attendance = {
    count: count,
    teams: {
      water: parseInt(document.getElementById("waterCount").textContent),
      zero: parseInt(document.getElementById("zeroCount").textContent),
      power: parseInt(document.getElementById("powerCount").textContent),
    },
    attendees: attendees,
  };
  localStorage.setItem("attendanceData", JSON.stringify(attendance));

  // Show welcome message
  const message = `🎉 Welcome, ${name} from ${teamName}`;
  console.log(message);
  greeting.textContent = message;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  if (count === maxCount) {
    showGoalCelebration();
  }

  form.reset();
});
