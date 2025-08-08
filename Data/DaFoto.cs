using Fotografia.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using Dapper;

namespace Fotografia.Data;

public class DaFoto
{
    private readonly string _connection;

    public DaFoto(IConfiguration configuration) => _connection = configuration?.GetConnectionString("DefaultConnection") ?? "";

    public List<MoFoto> ObtenerFotos()
    {
        using var connection = new SqlConnection(_connection);
        var parametros = new DynamicParameters();
        var result = connection.Query<MoFoto>(
            "PA_OBTENER_FOTOS",
            commandType: CommandType.StoredProcedure
        );
        return result.ToList();
    }
}
