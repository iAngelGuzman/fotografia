using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Fotografia.Models;

namespace Fotografia.Controllers;

public class AdminController : Controller
{
    private readonly ILogger<AdminController> _logger;

    public AdminController(ILogger<AdminController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        var model = new List<MoEmpleado>
        {
        };
        return View(model);
    }

    public IActionResult AgregarEmpleado()
    {
        return View();
    }
}
