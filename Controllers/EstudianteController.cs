using Microsoft.AspNetCore.Mvc;
using Fotografia.Models;
using Fotografia.ViewModels;
using System;
using Fotografia.Data;
using Microsoft.IdentityModel.Tokens;

namespace Fotografia.Controllers
{
    public class EstudianteController : Controller
    {
        private readonly DaFoto _daFoto;

        public EstudianteController(DaFoto daFoto)
        {
            _daFoto = daFoto ?? throw new ArgumentNullException(nameof(daFoto));
        }

        public IActionResult Index()
        {
            var lsEstudiantes = _daFoto.ObtenerFotos() ?? new List<MoFoto>();
            return View(lsEstudiantes);
        }

        [HttpPost]
        public async Task<IActionResult> AgregarFoto([FromBody] VmAgregarFoto vmAgregarFoto)
        {
            if (string.IsNullOrEmpty(vmAgregarFoto.SMatricula) || string.IsNullOrEmpty(vmAgregarFoto.BFotoBase64))
            {
                return Json(new { success = false, message = "Datos incompletos." });
            }

            try
            {
                byte[] bFoto = Convert.FromBase64String(vmAgregarFoto.BFotoBase64);

                var moFoto = new MoFoto
                {
                    SMatricula = vmAgregarFoto.SMatricula,
                    BFoto = bFoto,
                    DFAlta = DateTime.Now,
                    SUsrResp = User.Identity?.Name ?? "Anónimo"
                };

                if (_daFoto == null)
                {
                    return Json(new { success = false, message = "El servicio de datos no está disponible." });
                }

                await _daFoto.InsertarFoto(moFoto);

                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                // Aquí podrías loggear el error
                return Json(new { success = false, message = ex.Message });
            }
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
