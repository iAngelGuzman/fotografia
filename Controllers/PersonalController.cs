using Microsoft.AspNetCore.Mvc;
using Fotografia.Models;
using System;

namespace Fotografia.Controllers
{
    public class PersonalController : Controller
    {
        public IActionResult Index()
        {
            var personal = new List<MoFoto>
            {
                new MoFoto
                {
                    SId = "test",
                    SMatricula = "Juan",
                    DFAlta = new DateTime(1990, 1, 1),
                    DFUltModif = new DateTime(1990, 1, 1),
                    DFBaja = new DateTime(1990, 1, 1),
                    CIndActivo = "C",
                    SUsuario = "Juan"
                },
                new MoFoto
                {
                    SId = "test",
                    SMatricula = "Pedro",
                    DFAlta = new DateTime(1990, 1, 1),
                    DFUltModif = new DateTime(1990, 1, 1),
                    DFBaja = new DateTime(1990, 1, 1),
                    CIndActivo = "C",
                    SUsuario = "Juan"
                },
            };
            return View(personal);
        }
    }
}
