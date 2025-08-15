using System.ComponentModel.DataAnnotations;

namespace Fotografia.Models
{
    public class MoEstudiante
    {
        public int NId { get; set; }
        public required byte[] BFoto { get; set; }
    }
}