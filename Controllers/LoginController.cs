using Microsoft.AspNetCore.Mvc;
using Fotografia.Data;
using Fotografia.ViewModels;

namespace Fotografia.Controllers;

public class LoginController : Controller
{
    public IActionResult Index()
    {
        return View();
    }

    // Recibe el modelo y valida
    [HttpPost]
    public IActionResult Index(VmIniciarSesion model)
    {
        if (ModelState.IsValid)
        {
            // Si el modelo es válido, redirige al siguiente paso
            return RedirectToAction("IniciarSesion");
        }
        else
        {
            // Si el modelo no es válido, vuelve a mostrar la vista con los errores
            return View(model);
        }
    }

    // Acción para redirigir a otra parte del sistema
    public IActionResult IniciarSesion()
    {
        // Aquí iría la lógica de autenticación
        return RedirectToAction("Index", "Inicio");
    }
}
