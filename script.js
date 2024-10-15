document.addEventListener("DOMContentLoaded", function () {
  var cards = document.querySelectorAll("a.card");
  var background = document.querySelector(".background");

  // Función para registrar un usuario
  function registrarUsuario() {
    // Solicita el nombre al usuario
    var nombre = prompt("Ingrese su nombre para registrarse:");

    if (nombre) {
      // Guarda el nombre en localStorage con un timestamp
      const registro = {
        nombre: nombre,
        timestamp: Date.now(),
      };
      localStorage.setItem("registroUsuario", JSON.stringify(registro));

      // Eliminar el registro después de 24 horas (86400000 ms)
      setTimeout(() => {
        localStorage.removeItem("registroUsuario");
        alert("El registro ha sido eliminado.");
      }, 24 * 60 * 60 * 1000); // 24 horas en milisegundos

      alert("Usuario registrado: " + nombre);
    }
  }

  // Código existente para el efecto hover y el zoom
  var lastHoveredCardIndex = localStorage.getItem("lastHoveredCardIndex") || 0;
  var cardRect = cards[lastHoveredCardIndex].getBoundingClientRect();
  var x = cardRect.left + window.scrollX + cardRect.width / 2;
  var y = cardRect.top + window.scrollY + cardRect.height / 2;

  background.style.width = cardRect.width + "px";
  background.style.height = cardRect.height + "px";
  background.style.transform = `translate(${x - cardRect.width / 2}px, ${
    y - cardRect.height / 2
  }px)`;
  background.style.opacity = "0";

  cards.forEach(function (card, index) {
    card.addEventListener("mouseenter", function (e) {
      if (card.classList.contains("zoomed")) {
        return;
      }

      var rect = card.getBoundingClientRect();
      x = rect.left + window.scrollX + rect.width / 2;
      y = rect.top + window.scrollY + rect.height / 2;

      background.style.width = rect.width + "px";
      background.style.height = rect.height + "px";
      background.style.transform = `translate(${x - rect.width / 2}px, ${
        y - rect.height / 2
      }px)`;
      background.style.opacity = "1";
      background.style.top = "0%";
      background.style.left = "0%";
      background.style.transformOrigin = "center";
      localStorage.setItem("lastHoveredCardIndex", index);
    });

    card.addEventListener("mouseleave", function (e) {
      background.style.opacity = "0";
      background.style.width = "0px";
      background.style.height = "0px";
    });

    card.addEventListener("click", function () {
      if (card.classList.contains("zoomed")) {
        card.classList.remove("zoomed");
        card.style.transform = "none";
        card.style.position = "relative";
        card.style.width = "unset";
        card.style.height = "unset";
        card.style.top = "0";
        card.style.left = "0";
        card.style.zIndex = "0";
        document.body.classList.remove("overflow");

        cards.forEach(function (otherCard) {
          if (otherCard !== card) {
            otherCard.classList.remove("opacity-0");
          }
        });
      } else {
        card.classList.add("zoomed");
        card.style.position = "fixed";
        card.style.top = "50%";
        card.style.left = "50%";
        requestAnimationFrame(function () {
          card.style.transform = "translate(-50%, -50%)";
        });
        card.style.width = "90vw";
        card.style.height = "90vh";
        card.style.zIndex = "1000";
        document.body.classList.add("overflow");

        cards.forEach(function (otherCard) {
          if (otherCard !== card) {
            otherCard.classList.add("opacity-0");
          }
        });
      }
    });
  });
});
