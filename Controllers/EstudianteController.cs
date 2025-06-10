using Microsoft.AspNetCore.Mvc;
using Fotografia.Models;
using System;

namespace Fotografia.Controllers
{
    public class EstudianteController : Controller
    {
        public IActionResult Index()
        {
            var estudiantes = new List<MoEstudiante>
            {
                new MoEstudiante
                {
                    Id = 1,
                    Nombre = "Juan",
                    Apellido = "Perez",
                    FechaNacimiento = new DateTime(1990, 1, 1)
                },
                new MoEstudiante
                {
                    Id = 2,
                    Nombre = "Pedro",
                    Apellido = "Perez",
                    FechaNacimiento = new DateTime(1990, 2, 1)
                },
                new MoEstudiante
                {
                    Id = 3,
                    Nombre = "Luis",
                    Apellido = "Perez",
                    FechaNacimiento = new DateTime(1990, 3, 1)
                }
            };
            return View(estudiantes);
        }
    }
}
