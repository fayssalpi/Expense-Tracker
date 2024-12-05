using backend.Dtos;
using backend.Models;
using backend.Repositories;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {

        private readonly ICategoryRepository _repository;

        public CategoryController(ICategoryRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Authorize] 
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            try
            {
                var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
                var categories = await _repository.GetCategoriesByUserId(userId);

                return Ok(categories);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error fetching categories: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while fetching categories." });
            }
        }



        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Category>> AddCategory(Category category)
        {
            try
            {
                var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
                category.UserId = userId;

                var existingCategory = await _repository.GetCategoryByNameAndUserId(category.Name, userId);
                if (existingCategory != null)
                {
                    return BadRequest(new { message = "Category name already exists for this user.", success = false });
                }

                await _repository.AddCategory(category);

                return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error adding category: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while adding the category." });
            }
        }


    }
}
