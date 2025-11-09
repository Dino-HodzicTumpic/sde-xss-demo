const checkbox = document.getElementById("xss-checkbox");
const label = document.getElementById("xss-label");
const input = document.getElementById("comment");
const form = document.getElementById("xss-form");

checkbox.addEventListener("change", async () => {
  try {
    const response = await axios.post("/xss-toggle", {
      xss: checkbox.checked,
    });
    label.textContent = response.data.xss
      ? "Ranjivost uključena"
      : "Ranjivost isključena";
  } catch (err) {
    console.log("error when updating on/off button/checkbox", err);
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const res = await axios.post("/comment", {
      comment: input.value,
      xss: checkbox.checked,
    });

    const newComment = res.data.newComment;

    const container = document.getElementById("comments-container");

    const commentEl = document.createElement("div");
    commentEl.className =
      "bg-gray-200 rounded p-2 border mb-3 min-w-1/2 flex flex-col";

    const ts = document.createElement("span");
    ts.textContent = newComment.formatted_datetime;
    commentEl.appendChild(ts);

    const msgWrapper = document.createElement("div");
    msgWrapper.className = "comment-message";

    msgWrapper.innerHTML = newComment.message;
    commentEl.appendChild(msgWrapper);

    if (container.firstChild) {
      container.insertBefore(commentEl, container.firstChild);
    } else {
      container.appendChild(commentEl);
    }

    input.value = "";
    input.focus();
  } catch (err) {
    console.log("error while submiting form", err);
  }
});
