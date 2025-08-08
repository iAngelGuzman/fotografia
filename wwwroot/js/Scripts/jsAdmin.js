document.addEventListener("DOMContentLoaded", function () {

    $("#tblEmpleados").DataTable({
        "paging": true,
        "searching": true,
        "info": true,
        "order": [[0, "desc"]]
    });

});
