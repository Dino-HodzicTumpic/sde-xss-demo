const checkbox = document.getElementById("sde-checkbox");
const form = document.getElementById("register-form");
const tableBody = document.querySelector("#users-table");

checkbox.addEventListener("change", async () => {
  try {
    const isChecked = checkbox.checked;
    document.getElementById("sde-label-text").textContent = isChecked
      ? "Ranjivost uključena"
      : "Ranjivost isključena";
    const res = await axios.post("/sde-toggle", { insecure: checkbox.checked });
  } catch (err) {
    console.error(err);
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await axios.post("/register", { username, password });
    const newUser = res.data.user;

    const tr = document.createElement("tr");
    tr.className = "hover:bg-gray-50";
    tr.innerHTML = `
  <td class="py-2 px-4 border-b">${newUser.id}</td>
  <td class="py-2 px-4 border-b">${newUser.username}</td>
  <td class="py-2 px-4 border-b">${newUser.passwordDisplay}</td>
`;
    tableBody.prepend(tr);

    form.reset();
  } catch (err) {
    console.error(err);
  }
});
