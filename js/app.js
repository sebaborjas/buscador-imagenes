const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const paginacion = document.querySelector("#paginacion");

let cantPaginas;
let iterador;
let actualPagina = 1;

window.onload = () => {
  formulario.addEventListener("submit", verificarFormulario);
};

function verificarFormulario(e) {
  e.preventDefault();
  const terminoBusqueda = document.querySelector("#termino").value;

  if (terminoBusqueda === "") {
    mostrarError("Ingrese un termino de busqueda");
    return;
  }
  buscarImagen();
}

function mostrarError(texto) {
  const hayError = document.querySelector(".hay-error");
  if (!hayError) {
    const mensaje = document.createElement("p");
    mensaje.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center",
      "hay-error"
    );
    mensaje.innerHTML = `
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline">${texto}</span>
          `;
    resultado.appendChild(mensaje);

    setTimeout(() => {
      mensaje.remove();
    }, 3000);
  }
}

function buscarImagen() {
  const termino = document.querySelector("#termino").value;
  const key = "28593367-59abc67e420a5f5f39c4a348e";
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=30&page=${actualPagina}`;
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => {
      cantPaginas = calcularPaginas(resultado.totalHits);
      imprimirHTMl(resultado.hits);
    });
}

function imprimirHTMl(busqueda) {
  limpiarHTMl();
  busqueda.forEach((imagen) => {
    const {
      previewURL,
      views,
      likes,
      largeImageURL,
      webformatWidth,
      webformatHeight,
    } = imagen;
    resultado.innerHTML += `
    
    <div class="flex m-3 w-56">
  <div class="rounded-lg shadow-lg bg-white w-full flex flex-col justify-between">
    <div class="flex justify-center" >
    <img class="rounded-lg my-2  " src="${previewURL}" alt=""/>
    </div>
      
    
    <div class="p-6 flex flex-col align-middle">

    <p class="text-gray-700 text-base font-bold mb-4">
      Size:  <span class="font-light"> ${webformatWidth}x${webformatHeight} </span>
      </p>
      <p class="text-gray-700 text-base font-bold mb-4">
      ${likes} <span class="font-light"> Likes </span>
      </p>
      <p class="text-gray-700 text-base font-bold mb-4">
      ${views} <span class="font-light"> Visitas </span>
      </p>
      <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer" class="text-center inline-block px-5 py-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Ver Imagen</a>
    </div>
  </div>
</div>
    `;
  });
  //Limpiar paginas previas
  while (paginacion.firstChild) {
    paginacion.removeChild(paginacion.firstChild);
  }
  imprimirPaginador();
}

function limpiarHTMl() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function calcularPaginas(total) {
  return parseInt(Math.ceil(total / 30));
}

function* crearPaginador(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

function imprimirPaginador() {
  iterador = crearPaginador(cantPaginas);
  while (true) {
    const { value, done } = iterador.next();
    if (done) return;

    //Caso contrario genero boton para cada pagina
    const boton = document.createElement("a");
    boton.href = "#";
    boton.dataset.pagina = value;
    boton.textContent = value;
    boton.classList.add(
      "siguiente",
      "bg-yellow-400",
      "px-4",
      "py-1",
      "mr-2",
      "font-bold",
      "mb-1",
      "rounded"
    );
    boton.onclick = () => {
      actualPagina = value;
      buscarImagen();
    };
    paginacion.appendChild(boton);
  }
}
