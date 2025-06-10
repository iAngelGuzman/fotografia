document.addEventListener("DOMContentLoaded", function () {

    $("#tblEstudiante").DataTable({
        "paging": true,
        "searching": true,
        "info": true,
        "order": [[0, "desc"]]
    });

});
