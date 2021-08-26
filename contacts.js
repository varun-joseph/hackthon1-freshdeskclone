const MY_DOMAIN = "https://newaccount1613809040854.freshdesk.com/";
const API_KEY = "Ra5AmsHDgpFbZCfH8oLW";
const container = document.querySelector(".container");
// Base64 encoding of API_KEY
const Base64API_KEY = window.btoa(API_KEY);
let contactData;
const config = {
  headers: {
    Authorization: "Basic " + btoa(API_KEY),
  },
};
const CONTACTS_PATH = "api/v2/contacts";

async function getContacts() {
  try {
    const res = await fetch(MY_DOMAIN + CONTACTS_PATH, config);
    const data = await res.json();
    contactData = data;
    renderContacts(contactData);
  } catch (err) {
    console.log(err);
  }
}

getContacts();

async function updateContact(
  id,
  updatedName,
  updatedEmail,
  updatedPhone,
  updatedTwitter,
  updatedExternal
) {
  let editContact = {
    name: updatedName,
    email: updatedEmail,
    phone: updatedPhone,
    unique_external_id: updatedExternal,
  };
  try {
    await fetch(MY_DOMAIN + CONTACTS_PATH + `/${id}`, {
      method: "PUT",
      body: JSON.stringify(editContact),
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + btoa(API_KEY),
      },
    });
    alert("Contact updated");
  } catch (err) {
    alert(err);
  }
  getContacts();
}

async function createContact(newName, newEmail, newPhone, newExternal) {
  let newContact = {
    name: newName,
    email: newEmail,
    phone: newPhone,
    unique_external_id: newExternal,
  };
  try {
    await fetch(MY_DOMAIN + CONTACTS_PATH, {
      method: "POST",
      body: JSON.stringify(newContact),
      headers: {
        "content-type": "application/json",
        Authorization: "Basic " + btoa(API_KEY),
      },
    });
  } catch (err) {
    alert(err);
  }
  getContacts();
}

function renderContacts(contacts) {
  container.innerHTML = "";
  contacts.forEach((contact) => {
    const contactEl = document.createElement("div");
    contactEl.classList.add("contact");
    contactEl.innerHTML = `
    <div class="contact-header">
        <p>${contact.name}</p>
      </div>
      <div class="id">
        <p>Id</p>
        <p>${contact.id}</p>
      </div>
      <div class="phone">
        <p>Phone</p>
        <p>${contact.phone} <i class="fas fa-clipboard copy phone-copy"></i></p>
      </div>
      <div class="email">
        <p>Email</p>
        <p>${contact.email} <i class="fas fa-clipboard copy email-copy"></i></p>
      </div>
      <div class="preferred-source">
        <p>Preferred Source</p>
        <p>${contact.preferred_source}</p>
      </div>
      <div class="update">
        <button class="btn update-btn">
          Update / View
        </button>
      </div>
    `;
    container.appendChild(contactEl);
    const emailClipboard = contactEl.querySelector(".email-copy");
    emailClipboard.addEventListener("click", () => {
      const textarea = document.createElement("textarea");
      const email = contactEl.querySelector(".email");
      const userEmail = email.lastElementChild.innerText;
      if (userEmail.length === 0) {
        return;
      }
      textarea.value = userEmail;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      alert("Email copied to clipboard");
    });
    const phoneClipboard = contactEl.querySelector(".phone-copy");
    phoneClipboard.addEventListener("click", () => {
      const textarea = document.createElement("textarea");
      const phone = contactEl.querySelector(".phone");
      const phoneNo = phone.lastElementChild.innerText;
      if (phoneNo.length === 0) {
        return;
      }
      textarea.value = phoneNo;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      alert("Phone Number copied to clipboard");
    });

    const updateButton = contactEl.querySelector(".update-btn");
    updateButton.addEventListener("click", () => {
      hideContainer(
        contact.id,
        contact.name,
        contact.email,
        contact.phone,
        contact.twitter_id,
        contact.unique_external_id
      );
    });
  });
}

function hideContainer(id, name, email, phone, twitterId, externalId) {
  // console.log(id)
  const updateContainer = document.createElement("div");
  updateContainer.classList.add("update-container");
  updateContainer.innerHTML = `
      <div class="contact-header">
        ${name}
      </div>
      <p style="text-align:center">External id should be defined to update fields</p>
      <div class="name">
        <label for="name">
          Name:
        </label>
        <input type="text" class = "input" name="name" id="name" value="${name}">
      </div>
      <div class="email">
        <label for="email">
          Email:
        </label>
        <input type="text" class = "input" name="email" id="email" value = "${email}">
      </div>
      <div class = "phone">
        <label for="phone">
          Phone:
        </label>
        <input type = "text" class="input" name="phone" id="phone" value = "${phone}">
      </div>
      <div class = "twitter">
        <label for="twitter">
          Twitter Id:
        </label>
        <input type = "text" class="input" name="twitter" id="twitter" value = "${twitterId}">
      </div>
      <div class = "external">
        <label for="external">
          External Id:
        </label>
        <input type = "text" class="input" name="external" id="external" value = "${externalId}">
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
    const userId = id;
    let updatedName = updateContainer.querySelector("#name").value;
    let updatedEmail = updateContainer.querySelector("#email").value;
    let updatedPhone = updateContainer.querySelector("#phone").value;
    let updatedTwitter = updateContainer.querySelector("#twitter").value;
    let updatedExternal = updateContainer.querySelector("#external").value;
    //Only Unique phone numbers and emails are allowed
    let isUnique = checkIsPresent(
      userId,
      updatedName,
      updatedEmail,
      updatedPhone,
      updatedTwitter,
      updatedExternal
    );
    if (isUnique) {
      if (updatedPhone.trim().length === 0) {
        updatedPhone = "null";
      }
      if (updatedTwitter.trim().length === 0) {
        updatedTwitter = "null";
      }
      if (updatedExternal.trim().length === 0) {
        updatedExternal = "null";
      }
      if (updatedEmail.trim().length === 0) {
        updatedEmail = "null";
      }
      updateContact(
        userId,
        updatedName,
        updatedEmail,
        updatedPhone,
        updatedTwitter,
        updatedExternal
      );
      container.classList.remove("hide");
      updateContainer.style.display = "none";
    }
  });

  document.body.appendChild(updateContainer);
  container.classList.add("hide");
  updateContainer.style.display = "block";
}

function checkIsPresent(
  id,
  updatedName,
  updatedEmail,
  updatedPhone,
  updatedTwitter,
  updatedExternal
) {
  if (updatedName.trim().length === 0) {
    alert("Name Field cannot be empty");
    return false;
  }
  if (updatedPhone.trim().length === 0 || updatedPhone === "null") {
    updatedPhone = "";
  }
  if (updatedTwitter.trim().length === 0 || updatedTwitter === "null") {
    updatedTwitter = "";
  }
  if (updatedExternal.trim().length === 0 || updatedExternal === "null") {
    updatedExternal = "";
  }
  if (updatedEmail.trim().length === 0 || updatedEmail === "null") {
    updatedEmail = "";
  }
  console.log(updatedEmail, updatedExternal, updatedName, updatedPhone);
  if (
    updatedEmail === "null" &&
    updatedPhone === "null" &&
    updatedTwitter === "null" &&
    updatedExternal === "null"
  ) {
    alert(
      "Atleast one field of Email, Phone, Twitter Id, External Id should be unique/not null"
    );
    return false;
  }

  for (let i = 0; i < contactData.length; i++) {
    if (contactData[i].id !== id) {
      if (contactData[i].email === updatedEmail && updatedEmail !== "null") {
        alert("Email already exists");
        return false;
      }
      if (contactData[i].phone === updatedPhone && updatedPhone !== "null") {
        alert("Phone number already exists");
        return false;
      }
      if (
        contactData[i].twitter_id === updatedTwitter &&
        updatedTwitter !== "null"
      ) {
        alert("Twitter ID already exists");
        return false;
      }
      if (
        contactData[i].unique_external_id === updatedExternal &&
        updatedExternal !== "null"
      ) {
        alert("External ID already exists");
        return false;
      }
    }
  }
  return true;
}

const addButton = document.querySelector(".add-btn");
addButton.addEventListener("click", () => {
  displayForm();
});

function displayForm() {
  const form = document.createElement("form");
  form.innerHTML = "";
  form.classList.add("form");
  form.innerHTML = `
  <div class="contact-header">Add Contact</div>
  <p style="text-align:center">External id should be defined to update fields</p>
  <div class="name">
    <label for="new-name">Name: </label>
    <input type="text" class="name" id="new-name" />
  </div>
  <div class="email">
    <label for="new-email">Email: </label>
    <input type="text" class="email" id="new-email" />
  </div>
  <div class="phone">
    <label for="new-phone">Phone: </label>
    <input type="text" class="phone" id="new-phone" />
  </div>
  <div class="twitter">
    <label for="new-twitter">Twitter: </label>
    <input type="text" class="name" id="new-twitter" />
  </div>
  <div class="external">
    <label for="new-external">External Id: </label>
    <input type="text" class="name" id="new-external" />
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
  const addContactInfo = document.querySelector(".add-contact-info");
  const cancelButton = form.querySelector(".cancel-btn");
  cancelButton.addEventListener("click", () => {
    container.classList.remove("hide");
    form.style.display = "none";
  });

  const saveChangesButton = form.querySelector(".save-btn");
  saveChangesButton.addEventListener("click", (e) => {
    e.preventDefault();
    // const userId = id;
    let newName = form.querySelector("#new-name").value;
    let newEmail = form.querySelector("#new-email").value;
    let newPhone = form.querySelector("#new-phone").value;
    let newTwitter = form.querySelector("#new-twitter").value;
    let newExternal = form.querySelector("#new-external").value;

    //Only Unique phone numbers and emails are allowed
    let isUnique = checkIsNewContact(
      newName,
      newEmail,
      newPhone,
      newTwitter,
      newExternal
    );
    if (isUnique) {
      if (newPhone.trim().length === 0) {
        newPhone = "null";
      }
      if (newTwitter.trim().length === 0) {
        newTwitter = "null";
      }
      if (newExternal.trim().length === 0) {
        newExternal = "null";
      }
      if (newEmail.trim().length === 0) {
        newEmail = "null";
      }
      // console.log(updatedTwitter)
      console.log(newName, newEmail, newPhone, newTwitter, newExternal);
      createContact(newName, newEmail, newPhone, newExternal);
      container.classList.remove("hide");
      form.style.display = "none";
    }
  });

  addContactInfo.appendChild(form);
  container.classList.add("hide");
  form.style.display = "block";
}

function checkIsNewContact(
  newName,
  newEmail,
  newPhone,
  newTwitter,
  newExternal
) {
  if (newName.trim().length === 0) {
    alert("Name Field cannot be empty");
    return false;
  }

  if (
    newEmail === "" &&
    newPhone === "" &&
    newTwitter === "" &&
    newExternal === ""
  ) {
    alert(
      "Atleast one field of Email, Phone, Twitter Id, External Id should be unique/not null"
    );
    return false;
  }

  for (let i = 0; i < contactData.length; i++) {
    if (contactData[i].email === newEmail && newEmail !== "null") {
      alert("Email already exists");
      return false;
    }
    if (contactData[i].phone === newPhone && newPhone !== "null") {
      alert("Phone number already exists");
      return false;
    }
    if (contactData[i].twitter_id === newTwitter && newTwitter !== "null") {
      alert("Twitter ID already exists");
      return false;
    }
    if (
      contactData[i].unique_external_id === newExternal &&
      newExternal !== "null"
    ) {
      alert("External ID already exists");
      return false;
    }
  }
  return true;
}
