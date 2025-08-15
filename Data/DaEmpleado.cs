using Fotografia.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using Dapper;

namespace Fotografia.Data;

public class DaEmpleado
{
    private readonly string _connection;

    public DaEmpleado(IConfiguration configuration) => _connection = configuration?.GetConnectionString("DefaultConnection") ?? "";

    public List<MoEmpleado> ObtenerEmpleados()
    {
        using var connection = new SqlConnection(_connection);
        var result = connection.Query<MoEmpleado>(
            "PAS_EMPLEADO",
            commandType: CommandType.StoredProcedure
        );
        return result.ToList();
    }

    public async Task InsertarEmpleado(MoEmpleado moEmpleado)
    {
        using var connection = new SqlConnection(_connection);
        await connection.ExecuteAsync(
            "PAI_EMPLEADO",
            new
            {
                moEmpleado.SUsuario,
                moEmpleado.NNoPerson,
                moEmpleado.SDep,
                moEmpleado.CPermisos,
                moEmpleado.BAdmin,
            },
            commandType: CommandType.StoredProcedure
        );
    }

    public void ActualizarEmpleado(MoEmpleado moEmpleado)
    {
        using var connection = new SqlConnection(_connection);
        connection.Execute(
            "PAA_EMPLEADO",
            new
            {
                moEmpleado.SUsuario,
                moEmpleado.NNoPerson,
                moEmpleado.SDep,
                moEmpleado.CPermisos,
                moEmpleado.BAdmin,
                moEmpleado.CIndActivo,
            },
            commandType: CommandType.StoredProcedure
        );
    }

    public void EliminarEmpleado(string nId)
    {
        using var connection = new SqlConnection(_connection);
        connection.Execute(
            "PAE_EMPLEADO",
            new { nId = nId },
            commandType: CommandType.StoredProcedure
        );
    }
}
