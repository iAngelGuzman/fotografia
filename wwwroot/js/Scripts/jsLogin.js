//document.addEventListener("DOMContentLoaded", function () {
//    document.getElementById("txtPassword").addEventListener("keypress", inputPassword);

//    // Validar formulario al enviarlo
//    document.querySelector(".inisesion-form").addEventListener("submit", function (e) {
//        const usuario = document.getElementById("txtUser").value.trim();
//        const contrasena = document.getElementById("txtPassword").value.trim();

//        if (!usuario || !contrasena) {
//            e.preventDefault();
//            alert("Por favor, completa todos los campos antes de iniciar sesión.");
//        }
//    });
//});

function inputPassword(e) {
    if (e.code == "Enter") {
        e.preventDefault();
        togglePassword();
    }
}

function fnAlternarContrasena() {
    const contra = document.getElementById("txtContra");
    const icon = document.getElementById("contrasenaIcono");

    const isPassword = contra.type === "password";
    contra.type = isPassword ? "text" : "password";
    icon.classList.toggle("fa-eye", isPassword);
    icon.classList.toggle("fa-eye-slash", !isPassword);
}
