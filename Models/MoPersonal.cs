using System.ComponentModel.DataAnnotations;

namespace Fotografia.Models
{
    public class MoPersonal
    {
        public int Id { get; set; }
        [Required]
        public string Nombre { get; set; }
        [Required]
        public string Apellido { get; set; }
        [Required]
        public DateTime FechaNacimiento { get; set; }
    }
}