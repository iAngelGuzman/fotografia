using Fotografia.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using Dapper;

namespace Fotografia.Data;

public class DaUsuario
{
    private readonly string _connection;

    public DaUsuario(IConfiguration configuration) => _connection = configuration?.GetConnectionString("DefaultConnection") ?? "";

    public bool UsuarioEsAdmin(string usuario)
    {
        using var connection = new SqlConnection(_connection);
        var parametros = new DynamicParameters();
        parametros.Add("@Usuario", usuario);
        var rol = connection.QueryFirstOrDefault<string>(
            "PA_OBTENER_ROL_USUARIO",
            parametros,
            commandType: CommandType.StoredProcedure
        );
        return rol != null && rol.Equals("Administrador", StringComparison.OrdinalIgnoreCase);
    }
}
