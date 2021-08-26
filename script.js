const MY_DOMAIN = "https://newaccount1613809040854.freshdesk.com/";
const API_KEY = "Ra5AmsHDgpFbZCfH8oLW";
const container = document.querySelector(".container");
const filterPriority = document.getElementById("priority-filter");
let ticketData;
// Base64 encoding of API_KEY
const Base64API_KEY = window.btoa(API_KEY);
const TICKET_PATH = "api/v2/tickets";
const config = {
  headers: {
    Authorization: "Basic " + btoa(API_KEY),
  },
};
async function getData() {
  try {
    const res = await fetch(MY_DOMAIN + TICKET_PATH, config);
    const data = await res.json();
    ticketData = data;
    render(data);
  } catch (err) {
    console.log(err);
  }
}
getData();
function render(data) {
  container.innerHTML = "";
  data.forEach((ticket) => {
    const ticketEl = document.createElement("div");
    ticketEl.classList.add("ticket");
    const dueBy = ticket.due_by.split("T")[0];
    const priority = ticket.priority;
    if (ticket.priority === 4) {
      ticketEl.classList.add("very-high");
    }
    if (ticket.priority === 3) {
      ticketEl.classList.add("high");
    }
    if (ticket.priority === 2) {
      ticketEl.classList.add("medium");
    }
    if (ticket.priority === 1) {
      ticketEl.classList.add("low");
    }
    ticketEl.innerHTML = `
    <div class="ticket-header">
          <p>Ticket Id : ${ticket.id}</p>
        </div>
        <div class="subject">
          <p>Subject:</p><br>
          <p>${ticket.subject}</p>
        </div>
        <div class="priority">
          <p class="priority-para">Priority</p>
          <p class="priority-number">${priority}</p>
        </div>
        <div class="status">
          <p class="status-para">Status</p>
          <p class="status-number">${ticket.status}</p>
        </div>
        <div class="type">
          <div class="type-para">Type</div>
          <div class="type-description">${ticket.type}</div>
        </div>
        <div class="due">
          <div class="due-by">Due-by</div>
          <div class="due-date">${dueBy}</div>
        </div>
        <div class="update">
          <button class = "btn update-btn">
            Update
          </button>
    </div>
    `;
    container.appendChild(ticketEl);
    const updateButton = ticketEl.querySelector(".update-btn");
    updateButton.addEventListener("click", () => {
      hideContainer(ticket.id, ticket.priority, ticket.status);
    });
  });
}

async function updateTicket(updatedPriority, updatedStatus, id) {
  let editTicket = {
    priority: updatedPriority,
    status: updatedStatus,
  };
  try {
    await fetch(MY_DOMAIN + TICKET_PATH + `/${id}`, {
      method: "PUT",
      body: JSON.stringify(editTicket),
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + btoa(API_KEY),
      },
    });
  } catch (err) {
    alert(err);
  }

  getData();
}

filterPriority.addEventListener("change", (e) => {
  if (e.target.value === "all") {
    render(ticketData);
  } else {
    const priority = parseInt(e.target.value.split("-")[1]);
    const prioritisedTickets = ticketData.filter((ticket) => {
      return ticket.priority === priority;
    });
    render(prioritisedTickets);
  }
});

function hideContainer(id, priority, status) {
  const updateContainer = document.createElement("div");
  updateContainer.classList.add("update-container");
  updateContainer.innerHTML = `
      <div class="ticket-header">
        Ticket Id : ${id}
      </div>
      <div class="priority-update">
        <label for="priority">
          Priority:
        </label>
        <input type="number" class = "input" name="priority" id="priority" min="1" max="4" value="${priority}">
      </div>
      <div class="status-update">
        <label for="status">
          Status:
        </label>
        <input type="number" class = "input" name="status" id="status" min="2" max="4" value = "${status}">
      </div>
      <div class="save-changes">
        <button class="btn save-btn">
          Save Changes
        </button>
        <button class="cancel-btn btn">
          Cancel
        </button>
      </div>
  `;
  const cancelButton = updateContainer.querySelector(".cancel-btn");
  cancelButton.addEventListener("click", () => {
    container.classList.remove("hide");
    updateContainer.style.display = "none";
  });

  const saveChangesButton = updateContainer.querySelector(".save-btn");
  saveChangesButton.addEventListener("click", () => {
    const updatedPriority = parseInt(
      updateContainer.querySelector("#priority").value
    );
    const updatedStatus = parseInt(
      updateContainer.querySelector("#status").value
    );
    updateTicket(updatedPriority, updatedStatus, id);
    container.classList.remove("hide");
    updateContainer.style.display = "none";
  });

  document.body.appendChild(updateContainer);
  container.classList.add("hide");
  updateContainer.style.display = "block";
}
