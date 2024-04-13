document.querySelectorAll("#streaming_services_box img").forEach((img) => {
  img.addEventListener("click", toggleSelection);
});

function toggleSelection(event) {
  const img = event.target;
  const isSelected = img.getAttribute("data-selected") === "true";
  if (isSelected) {
    img.classList.remove("selected");
    img.setAttribute("data-selected", "false");
  } else {
    img.classList.add("selected");
    img.setAttribute("data-selected", "true");
  }
}
