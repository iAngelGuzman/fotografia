document.addEventListener("DOMContentLoaded", function () {
    $('#ddlEstudiante').val('5');
    var tblEstudiante = new DataTable('#tblEstudiante', {
        pageLength: 5,
        responsive: true,
        ordering: false,
        paging: true,
        searching: true,
        destroy: true,
        lengthChange: true,
        dom: 'rtip',
        lengthMenu: [
            [1, 5], /* Valores a mostrar */
            [1, 5], /* Etiquetas a mostrar */
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json',
            info: 'Mostrando _START_ de _TOTAL_ usuarios',
            lengthMenu: 'Ver _MENU_',
            infoEmpty: "Ningun usuario encontrado",
        }
    })

    // cambiar el tamaño de la tabla
    $('#ddlEstudiante').on('change', function () {
        var selectedValue = parseInt($(this).val());
        tblEstudiante.page.len(selectedValue).draw();
    });

    // buscar en la tabla
    $('#txtBuscarEstudiante').on('keyup', function () {
        tblEstudiante.search(this.value).draw();
    });
});

function fnMostrarAgregarImagen() {
    $('#mdlAgregar').modal('show');
}

let idFotoEditar = null;

function fnMostrarEditarImagen(foto) {
    console.log(foto.SFoto)
    $('#imgEditarPrincipal').attr('src', foto.SFoto);
    $('#txtMatriculaEditar').val(foto.SMatricula);
    idFotoEditar = foto.NId;
    $('#mdlEditar').modal('show');
}

function fnMostrarVerImagen(matricula, fotoBase64) {
    if (!matricula) {
        matricula = 'Sin matrícula';
    }
    // Asigna la matrícula y la imagen
    document.getElementById('spMatriculaVerFoto').textContent = matricula;
    document.getElementById('imgVerFoto').src = fotoBase64;

    // Muestra el modal
    var modal = new bootstrap.Modal(document.getElementById('mdlVerFoto'));
    modal.show();
}
