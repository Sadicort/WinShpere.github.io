document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registroForm');
    const nombreInput = document.getElementById('nombre');
    const listaNombres = document.getElementById('listaNombres');
    const contadorDisplay = document.getElementById('contador');
    const ruletaContainer = document.getElementById('ruletaContainer');
    const canvasRuleta = document.getElementById('ruleta');
    const ganadorDisplay = document.getElementById('ganador');
    
    let nombres = [];
    let tiempoRestante = 30; // 24 horas en segundos
    let anguloInicial = 0;
    let velocidadGiro = 0;
    let girando = false;

    // Manejar el envío del formulario
    registroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = nombreInput.value.trim();
    
        if (nombre) {
            nombres.push(nombre);
            agregarNombreATabla(nombre);
            nombreInput.value = '';
            guardarNombres();
        }
    });

    // Guardar los nombres en localStorage
    function guardarNombres() {
        localStorage.setItem('nombres', JSON.stringify(nombres));
    }

    // Cargar los nombres desde localStorage
    function cargarNombres() {
        const nombresGuardados = localStorage.getItem('nombres');
        if (nombresGuardados) {
            nombres = JSON.parse(nombresGuardados);
            nombres.forEach(agregarNombreATabla);
        }
    }

    // Agregar un nombre a la tabla
    function agregarNombreATabla(nombre) {
        const fila = document.createElement('tr');
        const celda = document.createElement('td');
        celda.textContent = nombre;
        fila.appendChild(celda);
        listaNombres.appendChild(fila);
    }

    // Actualizar el contador de tiempo
    function actualizarContador() {
        const horas = Math.floor(tiempoRestante / 3600);
        const minutos = Math.floor((tiempoRestante % 3600) / 60);
        const segundos = tiempoRestante % 60;
        contadorDisplay.textContent = `${horas}h ${minutos}m ${segundos}s`;

        if (tiempoRestante > 0) {
            tiempoRestante--;
        } else {
            iniciarRuleta();
        }
    }

    // Función para iniciar la ruleta
    function iniciarRuleta() {
        ruletaContainer.style.display = 'block';
        girando = true;
        velocidadGiro = 10; // Velocidad inicial del giro
        animarRuleta();
    }

    // Función para animar la ruleta
    function animarRuleta() {
        if (girando) {
            anguloInicial += velocidadGiro;
            velocidadGiro *= 0.98; // Reducción gradual de la velocidad
            if (velocidadGiro < 0.1) {
                girando = false;
                seleccionarGanador();
                return;
            }
            dibujarRuleta();
            requestAnimationFrame(animarRuleta);
        }
    }

    // Dibujar la ruleta
    function dibujarRuleta() {
        const ctx = canvasRuleta.getContext('2d');
        const anguloPorNombre = (2 * Math.PI) / nombres.length;
        ctx.clearRect(0, 0, 400, 400); // Limpiar el canvas
    
        nombres.forEach((nombre, i) => {
            const anguloInicio = anguloInicial + i * anguloPorNombre;
            const anguloFinal = anguloInicio + anguloPorNombre;
            
            ctx.beginPath();
            ctx.moveTo(200, 200); // Centro del círculo
            ctx.arc(200, 200, 200, anguloInicio, anguloFinal);
            ctx.fillStyle = i % 2 === 0 ? '#f00' : '#333';
            ctx.fill();
            ctx.stroke();
    
            // Dibujar el nombre en el segmento
            ctx.save();
            ctx.translate(200, 200);
            ctx.rotate(anguloInicio + anguloPorNombre / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#fff';
            ctx.font = '20px Arial';
            ctx.fillText(nombre, 180, 10);
            ctx.restore();
        });
    }

    // Seleccionar un ganador y mostrar animación
    function seleccionarGanador() {
        const ganador = nombres[Math.floor(Math.random() * nombres.length)];
        ganadorDisplay.textContent = ganador;
        animarGanador(ganador);
        setTimeout(() => {
            borrarNombres();
        }, 3000); // Borrar los nombres después de 3 segundos
    }

    // Animar el nombre del ganador
    function animarGanador(nombre) {
        ganadorDisplay.textContent = nombre;
        ganadorDisplay.style.animation = "parpadear 1s infinite";
    }

    // Borrar nombres de la tabla
    function borrarNombres() {
        nombres = [];
        listaNombres.innerHTML = '';
        localStorage.removeItem('nombres');
        ganadorDisplay.style.animation = "";
    }

    // Cargar nombres al iniciar
    cargarNombres();
    setInterval(actualizarContador, 1000);

    // Animación de parpadeo para el nombre ganador
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes parpadear {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});
