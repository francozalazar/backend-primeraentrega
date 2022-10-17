const socket = io();

socket.on("updateProducts", (data) => {
  let products = data.products;
  fetch("productsTemplate.handlebars")
    .then((string) => string.text())
    .then((template) => {
      const processedTemplate = Handlebars.compile(template);
      const templateObjets = {
        products: products,
      };
      const html = processedTemplate(templateObjets);
      let div = document.getElementById("listContainer");
      div.innerHTML = html;
    });
});

document.addEventListener("submit", enviarFormulario);

function enviarFormulario(event) {
  event.preventDefault();
  let form = document.getElementById("productForm");
  let data = new FormData(form);
  fetch("/api/productos", {
    method: "POST",
    body: data,
  })
    .then((result) => {
      return result.json();
    })
    .then((json) => {
      Swal.fire({
        title: "Éxito",
        text: json.message,
        icon: "success",
        timer: 2000,
      }).then((result) => {
        location.href = "/";
      });
    });
}
let sendButton = document.addEventListener(
  "click",
  document.getElementById("send")
);
let input = document.getElementById("message");
let email = document.getElementById("email");
input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (!e.target.value) {
      Swal.fire({
        title: "Error!",
        text: "El mensaje se encuentra vacío",
        icon: "error",
        confirmButtonText: "Cool",
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      Swal.fire({
        title: "Error!",
        text: "El email no es válido",
        icon: "error",
        confirmButtonText: "Cool",
      });
      return;
    }
    socket.emit("message", {
      email: email.value,
      timestamp: new Date().toLocaleString(),
      message: e.target.value,
    });
    input.value = "";
  }
});
socket.on("messagelog", (data) => {
  let p = document.getElementById("log");
  let messages = data
    .map((message) => {
      return `<div>
                <span style="font-weight: bold; color:blue">
                  ${message.email}
                </span>
                <span style='color: brown'>${message.timestamp}</span>
                <span style="color:#379C5D">
                 : <i>${message.message}</i>
                </span>
              </div>`;
    })
    .join("");
  p.innerHTML = messages;
});