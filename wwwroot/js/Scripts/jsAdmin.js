document.addEventListener("DOMContentLoaded", function () {

    $("#tblEmpleados").DataTable({
        "paging": true,
        "searching": true,
        "info": true,
        "order": [[0, "desc"]]
    });

});

// This script initializes a DataTable on the element with ID 'tblEmpleados'.
function fnMostrarAgregarEmpleado() {
    $("#mdlAgregarEmpleado").modal("show");
}