function fnSubirFoto() {
    document.getElementById('txtImagenes').click();
}

async function fnSubirFotoSeleccionada(txtImagenes) {
    const files = txtImagenes.files;
    if (!files.length) return;
    for (let i = 0; i < files.length; i++) {
        const res = await fnVerificarDuplicado(files[i]);
        if (res === 'cancelar') break;
    }
    txtImagenes.value = '';
}

// --- Variables globales ---
let currentImageIndex = -1;
let cerrarModalPendiente = false;

// --- Utilidades ---
function fnQuitarExtension(nombre) {
    return nombre.replace(/\.[^/.]+$/, "");
}

function fnObtenerImagenes() {
    return Array.from(document.querySelectorAll('#divFotos .btnImg'));
}

function fnSeleccionarImgDefault() {
    const buttons = fnObtenerImagenes();
    if (buttons.length === 0) {
        currentImageIndex = -1;
        document.getElementById('imgPrincipal').src = "";
        document.getElementById('spFotoPrincipal').textContent = "MATRICULA";
        return;
    }
    if (currentImageIndex === -1 || currentImageIndex >= buttons.length) {
        fnMostrarPrincipal(buttons[0]);
    }
}

function fnActualizarInfo() {
    const divContenedorFotos = document.getElementById('divContenedorFotos');
    const modalFooter = document.getElementById('mdlAgregar').querySelector('.modal-footer');
    const divInfo = document.getElementById('divInfo');
    const buttons = fnObtenerImagenes();
    if (buttons.length === 0) {
        divInfo.classList.remove('d-none');
        divContenedorFotos.classList.add('d-none');
        modalFooter.classList.add('d-none');
    } else {
        divInfo.classList.add('d-none');
        divContenedorFotos.classList.remove('d-none');
        modalFooter.classList.remove('d-none');
    }
}

// --- Subir foto ---
function fnSubirFoto() {
    document.getElementById('txtImagenes').click();
}

async function fnSubirFotoSeleccionada(txtImagenes) {
    const files = txtImagenes.files;
    if (!files.length) return;
    for (let i = 0; i < files.length; i++) {
        const res = await fnVerificarDuplicado(files[i]);
        if (res === 'cancelar') break;
    }
    txtImagenes.value = '';
}

// --- Imagen principal ---
function fnActualizarIndex(btn) {
    currentImageIndex = fnObtenerImagenes().indexOf(btn);
}

function fnMostrarPrincipal(btn) {
    const img = btn.querySelector('img');
    if (!img) return;
    document.getElementById('imgPrincipal').src = img.src;
    document.getElementById('spFotoPrincipal').textContent = fnQuitarExtension(img.alt || 'Foto seleccionada');
    fnActualizarIndex(btn);
    fnObtenerImagenes().forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// --- Botón eliminar ---
function fnBtnEliminarImg(btn) {
    const btnClose = document.createElement('button');
    btnClose.type = 'button';
    btnClose.className = 'btn btn-sm btn-danger position-absolute rounded-circle d-flex align-items-center justify-content-center';
    Object.assign(btnClose.style, {
        width: '25px', height: '25px', zIndex: '10', top: '-9%', left: '64%', boxShadow: '0px 1px 2px black'
    });
    btnClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    btnClose.addEventListener('click', function (e) {
        e.stopPropagation();
        const buttons = fnObtenerImagenes();
        const idx = buttons.indexOf(btn);
        const wasActive = btn.classList.contains('active');
        btn.remove();
        fnActualizarInfo();
        const newButtons = fnObtenerImagenes();
        if (wasActive) {
            if (newButtons.length === 0) {
                fnSeleccionarImgDefault();
            } else if (idx < newButtons.length) {
                fnMostrarPrincipal(newButtons[idx]);
            } else {
                fnMostrarPrincipal(newButtons[newButtons.length - 1]);
            }
        }
    });
    return btnClose;
}

// --- Crear botón imagen ---
function crearBotonImagen(file, src) {
    const divFotos = document.getElementById('divFotos');
    const divSubirFoto = document.getElementById('divSubirFoto');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btnImg rounded-3 ratio ratio-1x1 position-relative p-0 b-0';
    Object.assign(btn.style, {
        minWidth: '60px', maxWidth: '60px', minHeight: '60px', maxHeight: '60px'
    });
    btn.addEventListener('click', function () { fnMostrarPrincipal(btn); });

    const img = document.createElement('img');
    img.src = src;
    img.alt = file.name || 'foto';
    img.className = 'img-fluid rounded';

    btn.appendChild(img);
    btn.appendChild(fnBtnEliminarImg(btn));
    divFotos.insertBefore(btn, divSubirFoto);
    fnSeleccionarImgDefault();
    fnActualizarInfo();
}

// --- Drag & Drop helpers ---
function fnProcesarArchivos(items) {
    for (let i = 0; i < items.length; i++) {
        const item = items[i].webkitGetAsEntry?.();
        if (item) fnRecorrerArchivos(item);
    }
}

function fnRecorrerArchivos(item, done) {
    if (item.isFile) {
        item.file(async function (file) {
            if (file.type === "image/jpeg") {
                const res = await fnVerificarDuplicado(file);
                if (res === 'cancelar') return done && done();
            }
            done && done();
        });
    } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries(function (entries) {
            let pending = entries.length;
            if (!pending) return done && done();
            entries.forEach(function (entry) {
                fnRecorrerArchivos(entry, function () {
                    if (!--pending) done && done();
                });
            });
        });
    }
}

// --- Control de duplicados ---
async function fnVerificarDuplicado(file) {
    const divFotos = document.getElementById('divFotos');
    const existente = Array.from(divFotos.querySelectorAll('.btnImg img'))
        .find(img => img.alt === file.name);

    let nuevaSrc = '';
    if (existente) {
        nuevaSrc = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
        const decision = await fnPreguntarDuplicado(
            file.name,
            existente.src,
            nuevaSrc
        );
        if (decision === 'cancelar') return 'cancelar';
        if (decision === 'omitir') return 'omitido';
        if (decision === 'reemplazar') {
            existente.closest('.btnImg').remove();
        }
    }

    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function (evt) {
            crearBotonImagen(file, evt.target.result);
            resolve('agregado');
        };
        reader.readAsDataURL(file);
    });
}

// --- Modal de duplicado ---
function fnPreguntarDuplicado(nombre, anteriorSrc, nuevaSrc) {
    return new Promise(resolve => {
        document.getElementById('spNombreImagenDuplicada').textContent = `"${fnQuitarExtension(nombre)}"`;
        document.getElementById('imgDuplicadaActual').src = anteriorSrc || '';
        document.getElementById('imgDuplicadaNueva').src = nuevaSrc || '';
        const modal = new bootstrap.Modal(document.getElementById('mdlImagenDuplicada'));
        modal.show();

        document.getElementById('btnReemplazar').onclick = () => { modal.hide(); resolve('reemplazar'); };
        document.getElementById('btnOmitir').onclick = () => { modal.hide(); resolve('omitir'); };
        document.getElementById('btnCancelarCarga').onclick = () => { modal.hide(); resolve('cancelar'); };
    });
}

// --- Navegación con teclado ---
function fnObtenerImagenesPorFila() {
    const divFotos = document.getElementById('divFotos');
    const buttons = fnObtenerImagenes();
    if (buttons.length < 2) return 1;
    const firstBtn = buttons[0];
    const btnWidth = firstBtn.offsetWidth + parseInt(getComputedStyle(firstBtn).marginRight || 0);
    const divWidth = divFotos.offsetWidth;
    return Math.max(1, Math.floor(divWidth / btnWidth));
}

document.addEventListener('keydown', function (e) {
    const modal = document.getElementById('mdlAgregar');
    if (!modal.classList.contains('show')) return;
    const buttons = fnObtenerImagenes();
    if (!buttons.length) return;
    let imagesPerRow = fnObtenerImagenesPorFila();

    if (e.key === 'ArrowRight' && currentImageIndex < buttons.length - 1) currentImageIndex++;
    else if (e.key === 'ArrowLeft' && currentImageIndex > 0) currentImageIndex--;
    else if (e.key === 'ArrowDown' && currentImageIndex + imagesPerRow < buttons.length) currentImageIndex += imagesPerRow;
    else if (e.key === 'ArrowUp' && currentImageIndex - imagesPerRow >= 0) currentImageIndex -= imagesPerRow;
    else return;
    buttons[currentImageIndex].focus();
    fnMostrarPrincipal(buttons[currentImageIndex]);
});

// --- Modal de confirmación de cierre ---
document.getElementById('mdlAgregar').addEventListener('hide.bs.modal', function (e) {
    const buttons = fnObtenerImagenes();
    if (buttons.length > 0 && !cerrarModalPendiente) {
        e.preventDefault();
        const confirmModal = new bootstrap.Modal(document.getElementById('mdlConfirmarCerrar'));
        confirmModal.show();
        document.getElementById('btnConfirmarCerrar').onclick = function () {
            cerrarModalPendiente = true;
            confirmModal.hide();
            const modal = bootstrap.Modal.getInstance(document.getElementById('mdlAgregar'));
            modal.hide();
            setTimeout(() => { cerrarModalPendiente = false; }, 500);
        };
    }
});

document.getElementById('mdlAgregar').addEventListener('hidden.bs.modal', function () {
    fnObtenerImagenes().forEach(btn => btn.remove());
    currentImageIndex = -1;
    document.getElementById('imgPrincipal').src = "https://picsum.photos/id/10/500/300";
    document.getElementById('spFotoPrincipal').textContent = "MATRICULA";
    fnActualizarInfo();
});

// --- Drag & Drop y edición de nombre principal ---
document.addEventListener('DOMContentLoaded', function () {
    var modalContent = document.getElementById('mdlAgregar').querySelector('.modal-content');
    var divSoltarImagen = document.getElementById('divSoltarImagen');
    let dragCounter = 0;

    modalContent.addEventListener('dragenter', function (e) {
        e.preventDefault();
        dragCounter++;
        modalContent.classList.add('border', 'border-primary');
        divSoltarImagen.style.display = 'flex';
    });
    modalContent.addEventListener('dragleave', function (e) {
        dragCounter--;
        if (dragCounter === 0) {
            modalContent.classList.remove('border', 'border-primary');
            divSoltarImagen.style.display = 'none';
        }
    });
    modalContent.addEventListener('dragover', function (e) {
        e.preventDefault();
    });
    modalContent.addEventListener('drop', function (e) {
        e.preventDefault();
        dragCounter = 0;
        modalContent.classList.remove('border', 'border-primary');
        divSoltarImagen.style.display = 'none';
        fnProcesarArchivos(e.dataTransfer.items);
    });

    // Lógica para editar el nombre de la foto principal
    const span = document.getElementById('spFotoPrincipal');
    const btnEditar = document.getElementById('btnEditarNombre');
    const input = document.getElementById('txtFotoPrincipal');
    const btnGuardar = document.getElementById('btnGuardarNombre');
    const btnCancelar = document.getElementById('btnCancelarNombre');

    if (btnEditar && input && btnGuardar && btnCancelar && span) {
        btnEditar.addEventListener('click', function () {
            input.value = span.textContent;
            span.style.display = 'none';
            btnEditar.style.display = 'none';
            input.classList.remove('d-none');
            btnGuardar.classList.remove('d-none');
            btnCancelar.classList.remove('d-none');
            input.focus();
            input.select();
        });

        btnGuardar.addEventListener('click', fnGuardarNombre);
        btnCancelar.addEventListener('click', fnCancelarNombre);

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                fnGuardarNombre();
            } else if (e.key === 'Escape') {
                fnCancelarNombre();
            }
        });

        function fnGuardarNombre() {
            const nuevoNombre = fnQuitarExtension(input.value.trim()) || 'MATRICULA';
            // Validar duplicado (ignorando la imagen principal actual)
            const buttons = fnObtenerImagenes();
            const nombreConExtension = nuevoNombre + '.jpg';
            const existe = buttons.some((btn, idx) => {
                if (idx === currentImageIndex) return false;
                const imgMini = btn.querySelector('img');
                return imgMini && imgMini.alt === nombreConExtension;
            });
            if (existe) {
                // Mostrar modal de error en vez de alert
                document.getElementById('spNombreDuplicado').textContent = `"${nuevoNombre}"`;
                const modal = new bootstrap.Modal(document.getElementById('mdlNombreDuplicado'));
                modal.show();
                input.focus();
                input.select();
                return;
            }

            span.textContent = nuevoNombre;
            document.getElementById('imgPrincipal').alt = nuevoNombre;

            // Actualiza el alt de la miniatura activa
            if (currentImageIndex >= 0 && buttons[currentImageIndex]) {
                const imgMini = buttons[currentImageIndex].querySelector('img');
                if (imgMini) imgMini.alt = nombreConExtension;
            }

            span.style.display = 'inline-block';
            btnEditar.style.display = 'inline-block';
            input.classList.add('d-none');
            btnGuardar.classList.add('d-none');
            btnCancelar.classList.add('d-none');
        }

        function fnCancelarNombre() {
            input.classList.add('d-none');
            btnGuardar.classList.add('d-none');
            btnCancelar.classList.add('d-none');
            span.style.display = 'inline-block';
            btnEditar.style.display = 'inline-block';
        }
    }
});