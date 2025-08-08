using Microsoft.AspNetCore.Mvc;
using Fotografia.Models;
using System;

namespace Fotografia.Controllers
{
    public class EstudianteController : Controller
    {
        public IActionResult Index()
        {
            var estudiantes = new List<MoFoto>
            {
                new MoFoto
                {
                    SId = "test",
                    SMatricula = "Juan",
                    BFoto = "Perez",
                    DFAlta = new DateTime(1990, 1, 1),
                    DFUltModif = new DateTime(1990, 1, 1),
                    DFBaja = new DateTime(1990, 1, 1),
                    CIndActivo = "C",
                    SUsuario = "Juan"
                }
            };
            return View(estudiantes);
        }
    }
}
