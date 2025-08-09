using System.ComponentModel.DataAnnotations;

namespace Fotografia.Models
{
    public class MoFoto
    {
        public string? SId { get; set; }
        public string? SMatricula { get; set; }
        public byte[]? BFoto { get; set; }
        public DateTime? DFAlta { get; set; }
        public DateTime? DFUltModif { get; set; }
        public DateTime? DFBaja { get; set; }
        public string? CIndActivo { get; set; }
        public string? SUsuario { get; set; }

        public string? SFoto
        {
            get
            {
                if (BFoto == null) return null;
                // Cambia image/jpeg si el formato es diferente
                return $"data:image/jpeg;base64,{Convert.ToBase64String(BFoto)}";
            }
        }
    }
}