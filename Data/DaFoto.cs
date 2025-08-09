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
        var sql = @"SELECT TOP 5
                sID AS SId,
                bFoto AS BFoto,
                bFirma AS BFirma,
                dFAlta AS DFAlta,
                dFUltModif AS DFUltModif,
                dFBaja AS DFBaja,
                cIndActivo AS CIndActivo,
                sUsuario AS SUsuario
            FROM GGVESTUDI";
        var result = connection.Query<MoFoto>(sql);
        return result.ToList();
        //using var connection = new SqlConnection(_connection);
        //var parametros = new DynamicParameters();
        //var result = connection.Query<MoFoto>(
        //    "PA_OBTENER_FOTOS",
        //    commandType: CommandType.StoredProcedure
        //);
        //return result.ToList();
    }
}
