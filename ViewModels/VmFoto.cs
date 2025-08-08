using System.ComponentModel.DataAnnotations;

namespace Fotografia.ViewModels
{
    public class VmFoto
    {
        public int NId { get; set; } required
        public string SMatricula { get; set; } required
        public string STipo { get; set; } required
        public string SResponsable { get; set; } required
        public DateTime DtCreacion { get; set; } = DateTime.Now;
        public DateTime DtUltModif { get; set; } = DateTime.Now;
    }
}