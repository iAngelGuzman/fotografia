// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

// TOAST MESSAGE
function fnMostrarMensaje(msg, type, time = 3500) {
    const container = document.getElementById('divMensajes'); // Usa tu contenedor

    const colors = {
        success: "#43a047",
        info: "#1e88e5",
        warning: "#fb8c00",
        error: "#d50000"
    };

    const icons = {
        success: "fa-circle-check",
        info: "fa-circle-exclamation",
        warning: "fa-exclamation",
        error: "fa-triangle-exclamation"
    };

    // Crear nuevo toast
    const toast = document.createElement('div');
    toast.className = "toast border-0 rounded-3"; // Espaciado entre toasts
    toast.style.backgroundColor = colors[type];
    toast.style.boxShadow = "0 .1rem .6rem rgba(0,0,0,.4)";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");
    toast.setAttribute("data-bs-delay", time);

    toast.innerHTML = `
        <div class="d-flex align-items-center text-white" style="padding: .2rem 0;">
            <i class="fa-solid ${icons[type]} fs-4" style="padding: 0 .6rem; padding-left: .8rem;"></i>
            <span class="fs-6">${msg}</span>
            <i class="fa-solid fa-xmark ms-auto fs-4 btn text-white p-2 me-2" 
                style="text-shadow: 0 .1rem .1rem rgba(0,0,0,.2)" 
                data-bs-dismiss="toast"></i>
        </div>
    `;

    container.appendChild(toast);

    // Inicializar y mostrar el toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();

    // Opcional: eliminar el toast del DOM una vez ocultado
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

//function toastMessage(msg, type, time = 3500) {
//    const toast = document.getElementById(type + 'Toast');
//    const text = toast.querySelector('span');
//    text.textContent = msg;
//    toast.setAttribute('data-bs-delay', time);
//    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast)
//    toastBootstrap.show();
//}

//var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
//tooltipTriggerList.map(function (tooltipTriggerEl) {
//    return new bootstrap.Tooltip(tooltipTriggerEl)
//});


const encription = (() => {
    return {
        encryptMessage: (messageToencrypt = '') => {
            var keySize = 256;
            var ivSize = 128;
            var saltSize = 256;
            var iterations = 1000;
            var password = sAesKey;
            var salt = CryptoJS.lib.WordArray.random(saltSize / 8);

            //Key
            var key = CryptoJS.PBKDF2(password, salt, {
                keySize: keySize / 32,
                iterations: iterations
            });
            //

            var iv = CryptoJS.lib.WordArray.random(ivSize / 8);
            var encrypted = CryptoJS.AES.encrypt(messageToencrypt, key, {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC
            });
            var encryptedHex = base64ToHex(encrypted.toString());
            var base64result = hexToBase64(salt + iv + encryptedHex);
            return base64result;
        },

        decryptMessage: (encryptedMessage = '', secretkey = '') => {
            const keySize = 256;
            const ivSize = 128;
            const saltSize = 256;
            const iterations = 1000;

            // Convertir de Base64 a Hex
            const hexResult = base64ToHex(encryptedMessage);

            // Extraer salt, IV y el mensaje encriptado
            const salt = CryptoJS.enc.Hex.parse(hexResult.substr(0, 64));
            const iv = CryptoJS.enc.Hex.parse(hexResult.substr(64, 32));
            const encrypted = hexResult.substring(96);

            // Derivar la clave a partir de la contraseña y la sal
            const key = CryptoJS.PBKDF2(secretkey, salt, {
                keySize: keySize / 32,
                iterations: iterations
            });

            // Desencriptar el mensaje
            const decrypted = CryptoJS.AES.decrypt({
                ciphertext: CryptoJS.enc.Hex.parse(encrypted)
            }, key, {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC
            });
            // Convertir el resultado a UTF-8
            return decrypted.toString(CryptoJS.enc.Utf8);
        }
    }
})();