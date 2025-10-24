const btnProcesar = document.querySelector('#procesar');
const tableData = document.getElementById("transactionBody"); // Tabla de procesos ingresados
const resultTableData = document.getElementById("resultTableBody"); // Tabla de resultados
const promEspera = document.getElementById("espera");
const promRetorno = document.getElementById("retorno");
const newSimulation = document.getElementById("newSimulation");

newSimulation.addEventListener("click", function() {
    // Limpiar datos anteriores
    window.location.reload();
});

let procesos = [];

// Función que simula obtener el número de procesos
function obtenerNumeroProcesos() {
    let n;
    while (true) {
        const entrada = prompt("Ingrese el número de procesos:");
        if (entrada === null) {
            // Usuario canceló: no hacer nada y salir sin mostrar error
            return null;
        }
        n = parseInt(entrada, 10);
        if (Number.isInteger(n) && n > 0) {
            break;
        } else {
            alert("Error: Debe ingresar un número entero mayor a 0");
        }
    }
    return n;
}

// Función que simula llenar los datos de los procesos
function llenarDatosProcesos(numProcesos) {
    for (let i = 0; i < numProcesos; i++) {
        let procesoId = "P" + (i + 1);
        let rafaga, llegada;

        // Validación de los datos
        while (true) {
            rafaga = parseInt(prompt(`Ingrese ráfaga de CPU para ${procesoId}:`));
            llegada = parseInt(prompt(`Ingrese tiempo de llegada para ${procesoId}:`));

            if (Number.isInteger(rafaga) && rafaga > 0 && Number.isInteger(llegada) && llegada >= 0) {
                break;
            }
            alert("Error: Valores inválidos. Intente nuevamente.");
        }

        procesos.push({
            id: procesoId,
            rafaga: rafaga,
            llegada: llegada,
            inicio: 0,
            fin: 0,
            espera: 0,
            retorno: 0
        });
        
        // Insertar en la tabla de procesos ingresados
        let newRow = tableData.insertRow();
        newRow.insertCell(0).textContent = procesoId;
        newRow.insertCell(1).textContent = rafaga;
        newRow.insertCell(2).textContent = llegada;
    }
}

// Función que simula ordenar los procesos por tiempo de llegada
function ordenarPorLlegada() {
    procesos.sort((a, b) => a.llegada - b.llegada);
}

// Función que calcula los tiempos de ejecución
function calcularTiemposEjecucion() {
    let tiempoActual = 0;

    for (let i = 0; i < procesos.length; i++) {
        let proceso = procesos[i];

        // Calcular inicio y fin
        if (proceso.llegada > tiempoActual) {
            tiempoActual = proceso.llegada;
        }

        proceso.inicio = tiempoActual;
        proceso.fin = tiempoActual + proceso.rafaga;
        tiempoActual = proceso.fin;
    }
}

// Función que calcula los tiempos de espera y retorno
function calcularTiemposEsperaRetorno() {
    for (let i = 0; i < procesos.length; i++) {
        let proceso = procesos[i];
        proceso.espera = proceso.inicio - proceso.llegada;
        proceso.retorno = proceso.fin;
    }
}

// Función que muestra los resultados
function mostrarResultados() {
    let sumaEspera = 0;
    let sumaRetorno = 0;

    // Limpiar la tabla de resultados antes de llenarla
    resultTableData.innerHTML = ''; 

    // Mostrar tabla de resultados
    for (let proceso of procesos) {
        let row = resultTableData.insertRow();
        row.insertCell(0).textContent = proceso.id;
        row.insertCell(1).textContent = proceso.rafaga;
        row.insertCell(2).textContent = proceso.llegada;
        row.insertCell(3).textContent = proceso.espera;
        row.insertCell(4).textContent = proceso.retorno;
        
        sumaEspera += proceso.espera;
        sumaRetorno += proceso.retorno;
    }

    // Calcular promedios
    let promedioEspera = sumaEspera / procesos.length;
    let promedioRetorno = sumaRetorno / procesos.length;

    // Mostrar promedios
    promEspera.textContent = promedioEspera.toFixed(2);
    promRetorno.textContent = promedioRetorno.toFixed(2);
}

// Función principal que coordina las acciones
function ejecutarSimulacion() {
    let numProcesos = obtenerNumeroProcesos();
    llenarDatosProcesos(numProcesos);
    ordenarPorLlegada();
    calcularTiemposEjecucion();
    calcularTiemposEsperaRetorno();
    mostrarResultados();
}

// Escuchar el clic en el botón "Procesar"
btnProcesar.addEventListener('click', ejecutarSimulacion);
