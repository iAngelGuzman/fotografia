namespace Fotografia.ViewModels;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class VmIniciarSesion
{
    [Required(ErrorMessage = "El usuario es obligatorio.")]
    [MaxLength(50, ErrorMessage = "El usuario no puede tener más de 50 caracteres.")]
    [JsonPropertyName("sUsuario")]
    public string? SUsuario { get; set; }

    [Required(ErrorMessage = "La contraseña es obligatoria.")]
    [MaxLength(20, ErrorMessage = "La contraseña no puede tener más de 20 caracteres.")]
    [JsonPropertyName("sContrasena")]
    public string? SContra { get; set; }

}
