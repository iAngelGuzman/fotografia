using System.ComponentModel.DataAnnotations;

namespace Fotografia.Models
{
    public class MoFoto
    {
        public string? SId { get; set; }
        public string? SMatricula { get; set; }
        public string? BFoto { get; set; }
        public DateTime? DFAlta { get; set; }
        public DateTime? DFUltModif { get; set; }
        public DateTime? DFBaja { get; set; }
        public string? CIndActivo { get; set; }
        public string? SUsuario { get; set; }
    }
}