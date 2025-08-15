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
            if (model.SUsuario != null && model.SUsuario.Equals("admin"))
            {
                return RedirectToAction("Index", "Admin");
            }
            return RedirectToAction("Index", "Inicio");
        }
        else
        {
            // Si el modelo no es válido, vuelve a mostrar la vista con los errores
            return View(model);
        }
    }
}
