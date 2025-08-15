// --- Variables globales ---
let nIndexImagenActual = -1;
let liDuplicados = [];
let bCerrarModalPendiente = false;

// --- Utilidades ---
function fnQuitarExtension(nombre) {
    return nombre.replace(/\.[^/.]+$/, "");
}

function fnObtenerFotografias() {
    return Array.from(document.querySelectorAll('#divFotos .btnImg'));
}

function fnSeleccionarImgDefault() {
    const liFotografias = fnObtenerFotografias();
    if (liFotografias.length === 0) {
        nIndexImagenActual = -1;
        document.getElementById('imgPrincipal').src = "";
        document.getElementById('spFotoPrincipal').textContent = "MATRICULA";
        return;
    }
    if (nIndexImagenActual === -1 || nIndexImagenActual >= liFotografias.length) {
        fnMostrarPrincipal(liFotografias[0]);
    }
}

function fnActualizarInfo() {
    const divContenedorFotos = document.getElementById('divContenedorFotos');
    const mdlFooter = document.getElementById('mdlAgregar').querySelector('.modal-footer');
    const divInfo = document.getElementById('divInfo');
    const liFotografias = fnObtenerFotografias();
    if (liFotografias.length === 0) {
        divInfo.classList.remove('d-none');
        divContenedorFotos.classList.add('d-none');
        mdlFooter.classList.add('d-none');
    } else {
        divInfo.classList.add('d-none');
        divContenedorFotos.classList.remove('d-none');
        mdlFooter.classList.remove('d-none');
    }
}

// --- Subir foto ---
function fnSubirFotosAContenedor() {
    document.getElementById('txtImagenes').click();
}

async function fnSubirFotoSeleccionada(txtImagenes) {
    const liFiles = txtImagenes.files;
    if (!liFiles.length) return;
    for (let i = 0; i < liFiles.length; i++) {
        const res = await fnVerificarDuplicado(liFiles[i]);
        if (res === 'cancelar') break;
    }
    txtImagenes.value = '';
}

async function fnGuardarFotos() {
    const liBotones = fnObtenerFotografias();
    if (liBotones.length === 0) {
        alert('No hay fotos para guardar.');
        return;
    }

    const tokenAgregarFotos = document.querySelector('#formAgregarFotos input[name="__RequestVerificationToken"]').value;

    const promesas = liBotones.map(btn => {
        const img = btn.querySelector('img');
        if (!img) return Promise.resolve();

        const bFoto = img.src.split(',')[1];
        const sMatricula = fnQuitarExtension(img.alt);

        const payload = {
            SMatricula: sMatricula,
            BFotoBase64: bFoto
        };

        return fetch('/Estudiante/AgregarFoto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': tokenAgregarFotos
            },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    throw new Error(`Error al guardar la foto ${sMatricula}: ${data.message}`);
                }
            });
    });

    try {
        await Promise.all(promesas);
        alert('Fotos guardadas correctamente.');
        const mdlAgregar = bootstrap.Modal.getInstance(document.getElementById('mdlAgregar'));
        mdlAgregar.hide();
        location.reload();
    } catch (err) {
        alert(err.message);
    }
}

// --- Actualizar foto ---
function fnActualizarFoto() {
    const sMatricula = $('#txtMatriculaEditar').val();
    // Si necesitas enviar la imagen, puedes obtenerla desde la fuente base64 actual en imgEditarPrincipal
    const bFoto = $('#imgEditarPrincipal').attr('src').split(',')[1];

    $.ajax({
        url: '/Estudiante/ActualizarFoto',  // Acción en el controlador que procesa la edición
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            NId: idFotoEditar,
            SMatricula: sMatricula,
            BFotoBase64: bFoto
        }),
        success: function (response) {
            if (response.success) {
                alert('Foto editada correctamente');
                $('#mdlEditar').modal('hide');
                location.reload();
            } else {
                alert('Error: ' + response.message);
            }
        },
        error: function () {
            alert('Error en la petición al servidor.');
        }
    });
}


// --- Imagen principal ---
function fnActualizarIndex(btn) {
    nIndexImagenActual = fnObtenerFotografias().indexOf(btn);
}

function fnMostrarPrincipal(btn) {
    const img = btn.querySelector('img');
    if (!img) return;
    document.getElementById('imgPrincipal').src = img.src;
    document.getElementById('spFotoPrincipal').textContent = fnQuitarExtension(img.alt || 'Foto seleccionada');
    fnActualizarIndex(btn);
    fnObtenerFotografias().forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// --- Botón eliminar ---
function fnBtnEliminarImg(btn) {
    const btnClose = document.createElement('button');
    btnClose.type = 'button';
    btnClose.className = 'btn btn-sm btn-danger position-absolute rounded-circle d-flex align-items-center justify-content-center';
    Object.assign(btnClose.style, {
        width: '1.5rem', height: '1.5rem', zIndex: '10', top: '-15%', left: '64%', boxShadow: '0px 1px 2px black'
    });
    btnClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    btnClose.addEventListener('click', function (e) {
        e.stopPropagation();
        const liFotografias = fnObtenerFotografias();
        const idx = liFotografias.indexOf(btn);
        const wasActive = btn.classList.contains('active');
        btn.remove();
        fnActualizarInfo();
        const newButtons = fnObtenerFotografias();
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
function fnCrearBotonImagen(file, src) {
    const divFotos = document.getElementById('divFotos');
    const divSubirFoto = document.getElementById('divSubirFoto');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btnImg rounded-3 ratio ratio-1x1 position-relative p-0 b-0';
    Object.assign(btn.style, {
        minWidth: '3.2rem', maxWidth: '3.2rem', minHeight: '3.2rem', maxHeight: '3.2rem'
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
    const bExistente = Array.from(divFotos.querySelectorAll('.btnImg img'))
        .find(img => img.alt === file.name);

    if (bExistente) {
        // Leer la imagen nueva como Base64
        const nuevaSrc = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.readAsDataURL(file);
        });

        // Preguntar al usuario
        const decision = await fnPreguntarDuplicado(
            file.name,
            bExistente.src,
            nuevaSrc
        );

        if (decision === 'cancelar') return 'cancelar';
        if (decision === 'omitir') return 'omitido';
        if (decision === 'reemplazar') {
            bExistente.closest('.btnImg').remove();
        }
    }

    // Si no existía o si reemplazó, agregar la nueva imagen
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function (evt) {
            fnCrearBotonImagen(file, evt.target.result);
            resolve('agregado');
        };
        reader.readAsDataURL(file);
    });
}


// --- Modal de duplicado ---
function fnPreguntarDuplicado(nombre, anteriorSrc, nuevaSrc) {
    return new Promise(resolve => {
        const spNombre = document.getElementById('spNombreImagenDuplicada');
        const imgActual = document.getElementById('imgDuplicadaActual');
        const imgNueva = document.getElementById('imgDuplicadaNueva');
        const modalEl = document.getElementById('mdlImagenDuplicada');

        spNombre.textContent = `"${fnQuitarExtension(nombre)}"`;
        imgActual.src = anteriorSrc || '';
        imgNueva.src = nuevaSrc || '';

        const modal = new bootstrap.Modal(modalEl);
        modal.show();

        const btnReemplazar = document.getElementById('btnReemplazar');
        const btnOmitir = document.getElementById('btnOmitir');
        const btnCancelar = document.getElementById('btnCancelarCarga');

        // eliminar handlers previos
        btnReemplazar.replaceWith(btnReemplazar.cloneNode(true));
        btnOmitir.replaceWith(btnOmitir.cloneNode(true));
        btnCancelar.replaceWith(btnCancelar.cloneNode(true));

        const btnR = document.getElementById('btnReemplazar');
        const btnO = document.getElementById('btnOmitir');
        const btnC = document.getElementById('btnCancelarCarga');

        btnR.onclick = () => {
            document.getElementById('txtImagenes').focus(); // o cualquier otro botón fuera del modal
            modal.hide();
            resolve('reemplazar');
        };
        btnO.onclick = () => {
            document.getElementById('txtImagenes').focus();
            modal.hide();
            resolve('omitir');
        };
        btnC.onclick = () => {
            document.getElementById('txtImagenes').focus();
            modal.hide();
            resolve('cancelar');
        };
    });
}


// --- Navegación con teclado ---
function fnObtenerImagenesPorFila() {
    const divFotos = document.getElementById('divFotos');
    const liFotografias = fnObtenerFotografias();
    if (liFotografias.length < 2) return 1;
    const firstBtn = liFotografias[0];
    const btnWidth = firstBtn.offsetWidth + parseInt(getComputedStyle(firstBtn).marginRight || 0);
    const divWidth = divFotos.offsetWidth;
    return Math.max(1, Math.floor(divWidth / btnWidth));
}

document.addEventListener('keydown', function (e) {
    const modal = document.getElementById('mdlAgregar');
    if (!modal.classList.contains('show')) return;
    const liFotografias = fnObtenerFotografias();
    if (!liFotografias.length) return;
    let imagesPerRow = fnObtenerImagenesPorFila();

    if (e.key === 'ArrowRight' && nIndexImagenActual < liFotografias.length - 1) nIndexImagenActual++;
    else if (e.key === 'ArrowLeft' && nIndexImagenActual > 0) nIndexImagenActual--;
    else if (e.key === 'ArrowDown' && nIndexImagenActual + imagesPerRow < liFotografias.length) nIndexImagenActual += imagesPerRow;
    else if (e.key === 'ArrowUp' && nIndexImagenActual - imagesPerRow >= 0) nIndexImagenActual -= imagesPerRow;
    else return;
    liFotografias[nIndexImagenActual].focus();
    fnMostrarPrincipal(liFotografias[nIndexImagenActual]);
});

// --- Modal de confirmación de cierre ---
document.getElementById('mdlAgregar').addEventListener('hide.bs.modal', function (e) {
    const liFotografias = fnObtenerFotografias();
    if (liFotografias.length > 0 && !bCerrarModalPendiente) {
        e.preventDefault();
        const confirmModal = new bootstrap.Modal(document.getElementById('mdlConfirmarCerrar'));
        confirmModal.show();
        document.getElementById('btnConfirmarCerrar').onclick = function () {
            bCerrarModalPendiente = true;
            confirmModal.hide();
            const modal = bootstrap.Modal.getInstance(document.getElementById('mdlAgregar'));
            modal.hide();
            setTimeout(() => { bCerrarModalPendiente = false; }, 500);
        };
    }
});

document.getElementById('mdlAgregar').addEventListener('hidden.bs.modal', function () {
    fnObtenerFotografias().forEach(btn => btn.remove());
    nIndexImagenActual = -1;
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
            const liFotografias = fnObtenerFotografias();
            const nombreConExtension = nuevoNombre + '.jpg';
            const existe = liFotografias.some((btn, idx) => {
                if (idx === nIndexImagenActual) return false;
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
            if (nIndexImagenActual >= 0 && liFotografias[nIndexImagenActual]) {
                const imgMini = [nIndexImagenActual].querySelector('img');
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
