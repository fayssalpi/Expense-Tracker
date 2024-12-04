using backend.Models;
using backend.Repositories;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        // GET: api/category
        [HttpGet]
        [Authorize] // Make sure the user is authenticated
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0"); // Get userId from custom claim
            var categories = await _repository.GetCategoriesByUserId(userId);
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _repository.GetCategoryById(id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        // POST: api/category
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Category>> AddCategory(Category category)
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0"); // Get userId from custom claim
            category.UserId = userId; // Assign the UserId to the category

            // Check if a category with the same name already exists for this user
            var existingCategory = await _repository.GetCategoryByNameAndUserId(category.Name, userId);
            if (existingCategory != null)
            {
                return BadRequest(new { message = "Category name already exists for this user.", success = false });
            }

            // Add the category to the repository
            await _repository.AddCategory(category);

            // Return the newly created category with the appropriate response
            return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
        {
            if (id != category.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await _repository.UpdateCategory(category);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _repository.GetCategoryById(id);
            if (category == null) return NotFound();

            await _repository.DeleteCategory(id);
            return NoContent();
        }





    }
}
