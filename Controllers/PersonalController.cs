using Microsoft.AspNetCore.Mvc;
using Fotografia.Models;
using System;

namespace Fotografia.Controllers
{
    public class PersonalController : Controller
    {
        public IActionResult Index()
        {
            var personales = new List<MoPersonal>
            {
                new MoPersonal
                {
                    Id = 1,
                    Nombre = "Juan",
                    Apellido = "Perez",
                    FechaNacimiento = new DateTime(1990, 1, 1)
                },
                new MoPersonal
                {
                    Id = 2,
                    Nombre = "Pedro",
                    Apellido = "Perez",
                    FechaNacimiento = new DateTime(1990, 2, 1)
                },
                new MoPersonal
                {
                    Id = 3,
                    Nombre = "Luis",
                    Apellido = "Perez",
                    FechaNacimiento = new DateTime(1990, 3, 1)
                }
            };
            return View(personales);
        }
    }
}
