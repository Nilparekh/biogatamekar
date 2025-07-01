let imageBase64 = "";

document.getElementById("photo").addEventListener("change", function (e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    imageBase64 = reader.result;
    // Show live preview
    document.getElementById("photoPreview").innerHTML = `<img src="${imageBase64}" style="max-width:120px; width:100%; height:auto; border-radius:10px; margin-top:10px;">`;
  };
  if (file) {
    reader.readAsDataURL(file);
  } else {
    document.getElementById("photoPreview").innerHTML = "";
  }
});

document.getElementById("biodataForm").addEventListener("submit", function (e) {
  e.preventDefault();
  generateBiodata();
});

function generateBiodata(data = null) {
  const get = (id) => data ? data[id] : document.getElementById(id).value.trim();

  const personalFields = {
    name: "Name",
    gender: "Gender",
    dob: "Date of Birth",
    birthplace: "Place of Birth",
    height: "Height",
    education: "Education",
    occupation: "Occupation"
  };

  const familyFields = {
    father: "Father's Name",
    fatherOcc: "Father's Occupation",
    mother: "Mother's Name",
    motherOcc: "Mother's Occupation",
    brothers: "Total Brothers",
    sisters: "Total Sisters"
  };

  const contactFields = {
    contact: "Contact Number",
    email: "Email",
    address: "Address"
  };

  let photoHTML = "";
  if (data && data.photo) {
    imageBase64 = data.photo;
  }

  if (imageBase64) {
    photoHTML = `<div style="text-align:center;">
      <img src="${imageBase64}" style="max-width:150px; width:100%; height:auto; border-radius:10px; margin-bottom:15px;">
    </div>`;
  }

  let personalDetailsHTML = `<h2>BIO DATA</h2><hr><br>`;
  personalDetailsHTML += `<h3>PERSONAL DETAILS:</h3><ul>`;
  for (const id in personalFields) {
    const value = get(id);
    if (value) {
      personalDetailsHTML += `<li><strong>${personalFields[id]}:</strong> ${value}</li>`;
    }
  }
  personalDetailsHTML += "</ul><br>";

  let familyDetailsHTML = `<h3>FAMILY DETAILS:</h3><ul>`;
  for (const id in familyFields) {
    const value = get(id);
    if (value) {
      familyDetailsHTML += `<li><strong>${familyFields[id]}:</strong> ${value}</li>`;
    }
  }
  familyDetailsHTML += "</ul><br>";

  let contactDetailsHTML = `<h3>CONTACT DETAILS:</h3><ul>`;
  for (const id in contactFields) {
    const value = get(id);
    if (value) {
      contactDetailsHTML += `<li><strong>${contactFields[id]}:</strong> ${value}</li>`;
    }
  }
  contactDetailsHTML += "</ul>";

  const finalHTML = photoHTML + personalDetailsHTML + familyDetailsHTML + contactDetailsHTML;

  document.getElementById("biodataOutput").innerHTML = finalHTML;
  document.getElementById("downloadBtn").style.display = "block";
}

function downloadPDF() {
  const element = document.getElementById("biodataOutput");
  html2pdf().from(element).save("Marriage_Biodata.pdf");
}

function saveProfile() {
  const fields = [
    "name", "address", "dob", "birthplace", "height", "weight",
    "education", "kul", "father", "fatherOcc", "mother", "brother", "contact"
  ];
  let profile = {};
  fields.forEach(id => {
    profile[id] = document.getElementById(id).value.trim();
  });
  profile.photo = imageBase64 || "";

  const saved = JSON.parse(localStorage.getItem("profiles") || "{}");
  if (!profile.name) {
    alert("Name is required to save profile.");
    return;
  }
  saved[profile.name] = profile;
  localStorage.setItem("profiles", JSON.stringify(saved));
  alert("Profile Saved!");
  loadProfilesList();
}

function loadProfilesList() {
  const profiles = JSON.parse(localStorage.getItem("profiles") || "{}");
  const select = document.getElementById("profileSelect");
  select.innerHTML = `<option value="">-- Load Saved Profile --</option>`;
  Object.keys(profiles).forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

function loadProfile() {
  const name = document.getElementById("profileSelect").value;
  if (!name) return;
  const profiles = JSON.parse(localStorage.getItem("profiles") || "{}");
  const data = profiles[name];
  if (!data) return;

  for (const key in data) {
    const el = document.getElementById(key);
    if (el && key !== "photo") {
      el.value = data[key];
    }
  }
  generateBiodata(data);
}

window.onload = loadProfilesList;

// Stepper navigation logic
function startBiodata() {
  document.querySelector('.hero-section').style.display = 'none';
  document.getElementById('biodataWizard').style.display = 'block';
  showStep(1);
}

function showStep(step) {
  // Hide all steps
  document.querySelectorAll('.form-step').forEach((el, idx) => {
    el.style.display = (idx === step - 1) ? 'block' : 'none';
    el.classList.toggle('active', idx === step - 1);
  });
  // Update stepper
  document.querySelectorAll('.stepper .step').forEach((el, idx) => {
    el.classList.toggle('active', idx === step - 1);
  });
}

function nextStep(step) {
  showStep(step);
}

function prevStep(step) {
  showStep(step);
}

// Template selection logic
function selectTemplate(templateId) {
  document.querySelectorAll('.template-card').forEach((el, idx) => {
    if (idx === templateId - 1) {
      el.classList.add('selected');
    } else {
      el.classList.remove('selected');
    }
  });
}

// Optionally, set default selected template on load
window.addEventListener('DOMContentLoaded', () => {
  selectTemplate(1);
});
