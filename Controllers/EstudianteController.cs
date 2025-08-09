using Microsoft.AspNetCore.Mvc;
using Fotografia.Models;
using System;
using Fotografia.Data;

namespace Fotografia.Controllers
{
    public class EstudianteController : Controller
    {
        private readonly DaFoto? _daFoto;

        public EstudianteController(DaFoto daFoto)
        {
            _daFoto = daFoto ?? throw new ArgumentNullException(nameof(daFoto));
        }

        public IActionResult Index()
        {
            var estudiantes = _daFoto?.ObtenerFotos() ?? new();
            return View(estudiantes);
        }
    }
}
