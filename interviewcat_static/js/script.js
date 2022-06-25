const phone_number = document.querySelector("#phone_number");
let phoneInput = window.intlTelInput(phone_number, {
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

// const info = document.querySelector(".alert-info");

// function process(event) {
//   event.preventDefault();

//   const phoneNumber = phoneInput.getNumber();

//   info.style.display = "";
//   info.innerHTML = `Phone number in E.164 format: <strong>${phoneNumber}</strong>`;
// }

function getIp(callback) {
  fetch("https://ipinfo.io/json?token=ec87b0a2b846df", {
    headers: { Accept: "application/json" },
  })
    .then((resp) => resp.json())
    .catch(() => {
      return {
        country: "IN",
      };
    })
    .then((resp) => callback(resp.country));
}

phoneInput = window.intlTelInput(phone_number, {
  initialCountry: "auto",
  geoIpLookup: getIp,
  utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

const form = document.querySelector("form");
const fullName = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const cnf_password = document.querySelector("#cnf_password");
console.log("Before event listener: ", {
  name: fullName.value,
  email: email.value,
  phone_number: phone_number.value,
  password: password.value,
});

const validatePhoneNumber = (phone_number) => {
  if (phone_number.length !== 10) {
    throw Error("Invalid phone number!!");
  }
};

const validatePassword = (password, cnf_password) => {
  if (!(cnf_password === password)) {
    throw Error("Password and confirm password ain't same!!");
  }
};

function moveToHomePage() {
  window.location.href = "../static/home.html";
}
form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const formData = {
    name: fullName.value,
    email: email.value,
    phone_number: phone_number.value,
    password: password.value,
    cnf_password: cnf_password.value,
  };
  console.log("After event listener: ", {
    name: fullName.value,
    email: email.value,
    phone_number: phone_number.value,
    password: password.value,
    cnf_password: cnf_password.value,
  });

  try {
    validatePhoneNumber(formData.phone_number);
  } catch (e) {
    alert(e.message);
  }

  try {
    validatePassword(formData.password, formData.cnf_password);
  } catch (e) {
    alert(e.message);
  }

  fullName.textContent = "";
  email.textContent = "";
  phone_number.textContent = "";
  password.textContent = "";
  cnf_password.textContent = "";

  const result = await fetch("http://localhost:3000/users/signup", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      name: formData.name,
      email_id: formData.email,
      phone_number: formData.phone_number,
      password: formData.password,
      cnf_password: formData.password,
    }),
  });

  if (result.ok) {
    console.log("Status ok: ", await result.json());
    moveToHomePage();
  } else {
    alert((await result.json()).error);
    document.querySelector("form").reset();
  }
});
