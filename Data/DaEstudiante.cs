using Fotografia.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using Dapper;

namespace Fotografia.Data;

public class DaEstudiante
{
    private readonly string _connection;

    public DaEstudiante(IConfiguration configuration) => _connection = configuration?.GetConnectionString("DefaultConnection") ?? "";

    public List<MoFoto> ObtenerFotos()
    {
        using var connection = new SqlConnection(_connection);
        var result = connection.Query<MoFoto>(
            "PAS_ESTUDI",   
            commandType: CommandType.StoredProcedure
        );
        return result.ToList();
    }

    public async Task InsertarFoto(MoEstudiante moEstudiante)
    {
        using var connection = new SqlConnection(_connection);
        await connection.ExecuteAsync(
            "PAI_ESTUDI",
            new
            {
                moEstudiante.NId,
                moEstudiante.BFoto
            },
            commandType: CommandType.StoredProcedure
        );
    }

    public void ActualizarFoto(MoFoto foto)
    {
        using var connection = new SqlConnection(_connection);
        connection.Execute(
            "PAA_ESTUDI",
            new
            {
                foto.NId,
                foto.SMatricula,
                foto.BFoto,
                foto.SUsrResp
            },
            commandType: CommandType.StoredProcedure
        );
    }

    public void EliminarFoto(string nId, string usuario)
    {
        using var connection = new SqlConnection(_connection);
        connection.Execute(
            "PAE_ESTUDI",
            new
            {
                nID = nId,
                sUsrResp = usuario
            },
            commandType: CommandType.StoredProcedure
        );
    }
}
