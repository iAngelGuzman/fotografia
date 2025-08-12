using Microsoft.AspNetCore.Mvc;
using Fotografia.Models;
using System;

namespace Fotografia.Controllers
{
    public class PersonalController : Controller
    {
        public IActionResult Index()
        {
            var personal = new List<MoFoto>
            {
            };
            return View(personal);
        }
    }
}
