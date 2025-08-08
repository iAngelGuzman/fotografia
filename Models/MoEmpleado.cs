using System.ComponentModel.DataAnnotations;

namespace Fotografia.Models
{
    public class MoEmpleado
    {
        public int NId { get; set; }
        [Required]
        public string? SNombre { get; set; }
        [Required]
        public string? SRol { get; set; }
        [Required]
        public string? SPermisos { get; set; }
        [Required]
        public DateTime DtFecCre { get; set; }
        public DateTime DtUltAct { get; set; }
    }
}