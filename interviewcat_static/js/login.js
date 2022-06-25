import * as localStorage from "./tokenutil.js";

const form = document.querySelector("form");
const email_id = document.querySelector("#email");
const password = document.querySelector("#password");
console.log("Before event listener :", {
  email_id: email_id.value,
  password: password.value,
});

const moveToHomePage = () => {
  window.location.href = "../static/home.html";
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = { email_id: email_id.value, password: password.value };
  console.log("After event listener :", formData);
  const result = await fetch("http://localhost:3000/users/login", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email_id: formData.email_id,
      password: formData.password,
    }),
  });

  if (result.ok) {
    const parsedData = await result.json();
    localStorage.setToken(parsedData.token);
    console.log("Status ok: ", parsedData);
    moveToHomePage();
  } else {
    alert((await result.json()).error);
    document.querySelector("form").reset();
  }
});
