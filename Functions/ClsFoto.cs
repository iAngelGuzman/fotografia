using System;
using System.Threading.Tasks;
using Fotografia.Models;
using Fotografia.ViewModels;
using Fotografia.Data;

namespace Fotografia.Functions
{
    public class ClsFoto
    {
        private readonly DaFoto _daFoto;

        public ClsFoto(DaFoto daFoto)
        {
            _daFoto = daFoto;
        }

        public async Task<(bool Success, string Message)> AgregarFoto(VmAgregarFoto vmAgregarFoto, string sUsuario)
        {
            if (string.IsNullOrEmpty(vmAgregarFoto.SMatricula) || string.IsNullOrEmpty(vmAgregarFoto.BFotoBase64))
            {
                return (false, "Datos incompletos.");
            }

            try
            {
                byte[] bFoto = Convert.FromBase64String(vmAgregarFoto.BFotoBase64);

                var moFoto = new MoFoto
                {
                    SMatricula = vmAgregarFoto.SMatricula,
                    BFoto = bFoto,
                    DFAlta = DateTime.Now,
                    SUsrResp = string.IsNullOrEmpty(sUsuario) ? "Anónimo" : sUsuario
                };

                if (_daFoto == null)
                {
                    return (false, "El servicio de datos no está disponible.");
                }

                await _daFoto.InsertarFoto(moFoto);

                return (true, "Foto agregada correctamente.");
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
        }
    }
}
