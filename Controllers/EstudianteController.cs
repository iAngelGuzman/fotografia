using Microsoft.AspNetCore.Mvc;
using Fotografia.Models;
using Fotografia.ViewModels;
using System;
using Fotografia.Functions;
using Fotografia.Data;
using Microsoft.IdentityModel.Tokens;

namespace Fotografia.Controllers
{
    public class EstudianteController : Controller
    {
        private readonly DaFoto _daFoto;
        private readonly ClsFoto _clsFoto;

        public EstudianteController(DaFoto daFoto, ClsFoto clsFoto)
        {
            _daFoto = daFoto ?? throw new ArgumentNullException(nameof(daFoto));
            _clsFoto = clsFoto ?? throw new ArgumentNullException(nameof(clsFoto));
        }

        public IActionResult Index()
        {
            var lsEstudiantes = _daFoto.ObtenerFotos() ?? new List<MoFoto>();
            return View(lsEstudiantes);
        }

        /// <summary>
        /// AgregarFoto: Agrega una fotografía a la base de datos a partir de un objeto ViewModel />.
        /// </summary>
        /// <param name="vmAgregarFoto">ViewModel-Objeto que contiene la matrícula y la imagen en formato Base64</param>
        /// <param name="sUsuario">  Nombre del usuario responsable de la acción. Si es nulo o vacío, se asignará "Anónimo"</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> AgregarFoto([FromBody] VmAgregarFoto vmAgregarFoto)
        {
            var resultado = await _clsFoto.AgregarFoto(vmAgregarFoto, User.Identity?.Name ?? "Anónimo");
        
            if (!resultado.Success)
                return BadRequest(new { success = false, message = resultado.Message });
        
            return Ok(new { success = true, message = resultado.Message });
        }

        [HttpPost]
        public IActionResult ActualizarFoto([FromBody] MoFoto foto)
        {
            if (foto == null || foto.NId == 0)
            {
                return BadRequest(new { success = false, message = "Datos inválidos" });
            }

            try
            {
                _daFoto.ActualizarFoto(foto);
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

    }
}
