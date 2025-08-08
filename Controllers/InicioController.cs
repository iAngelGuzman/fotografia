using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Fotografia.Models;

namespace Fotografia.Controllers;

public class InicioController : Controller
{
    private readonly ILogger<InicioController> _logger;

    public InicioController(ILogger<InicioController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        var model = new List<MoFoto>
        {
        };
        return View(model);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    public IActionResult Estudiante()
    {
        return View();
    }

    public IActionResult Personal()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
