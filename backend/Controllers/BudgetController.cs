using System.Security.Claims;
using backend.Data;
using backend.Dtos;
using backend.Mapper;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class BudgetController : ControllerBase
    {

        private readonly IBudgetRepository _repository;
        private readonly AppDbContext _context;


        public BudgetController(IBudgetRepository repository, AppDbContext context)
        {
            _repository = repository;
            _context = context;

        }

        [HttpGet]
        public async Task<IActionResult> GetAllBudgets()
        {
            // Get the userId from the custom claim "userId"
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");  // Get userId from custom claim

            // Fetch all budgets for the logged-in user
            var budgets = await _context.Budgets
                .Where(b => b.UserId == userId)  // Filter by the logged-in user's ID
                .Include(b => b.Expenses)
                .ThenInclude(e => e.Category)
                .ToListAsync();

            var budgetDtos = budgets.Select(BudgetMapper.ToDto).ToList();

            return Ok(budgetDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBudgetById(int id)
        {
            // Get the userId from the custom claim "userId"
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0"); // Get userId from custom claim

            var budget = await _context.Budgets
                .Where(b => b.UserId == userId)  // Filter by the logged-in user's ID
                .Include(b => b.Expenses)
                .ThenInclude(e => e.Category)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (budget == null) return NotFound();

            var budgetDto = BudgetMapper.ToDto(budget);
            return Ok(budgetDto);
        }

        [HttpPost]
        public async Task<IActionResult> AddBudget([FromBody] Budget budget)
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");

            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid data", success = false });

            // Ensure the budget has the correct userId
            budget.UserId = userId;

            try
            {
                await _repository.AddBudget(budget);
                return CreatedAtAction(nameof(GetBudgetById), new { id = budget.Id }, new { message = "Budget added successfully", success = true });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message, success = false });
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBudget(int id, [FromBody] Budget budget)
        {
            // Get the userId from the custom claim "userId"
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0"); // Get userId from custom claim

            // Log the userId and budget.UserId to check if they match
            Console.WriteLine($"UserId from token: {userId}");

            if (id != budget.Id) return BadRequest("Budget ID mismatch");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Find the budget from the database
            var existingBudget = await _context.Budgets.FindAsync(id);
            if (existingBudget == null)
            {
                return NotFound("Budget not found.");
            }

            // Ensure the budget belongs to the logged-in user
            if (existingBudget.UserId != userId)
            {
                return Unauthorized("You can only modify your own budgets.");
            }

            // Update the fields that are allowed to be updated
            existingBudget.MonthlyLimit = budget.MonthlyLimit;
            existingBudget.Spent = budget.Spent;

            await _repository.UpdateBudget(existingBudget);
            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(int id)
        {
            // Get the userId from the custom claim "userId"
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0"); // Get userId from custom claim

            var budget = await _repository.GetBudgetById(id);
            if (budget == null || budget.UserId != userId) return NotFound();

            await _repository.DeleteBudget(id);
            return NoContent();
        }

        [HttpGet("current-month")]
        [Authorize]
        public async Task<ActionResult<BudgetDto>> GetCurrentMonthBudget()
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            var currentDate = DateTime.Now;

            var budget = await _context.Budgets
                .Where(b => b.UserId == userId && b.Month == currentDate.Month && b.Year == currentDate.Year)
                .Include(b => b.Expenses)
                .ThenInclude(e => e.Category)
                .FirstOrDefaultAsync();

            if (budget == null)
            {
                return Ok(new { message = "No budget for this month", budget = (object)null });
            }

            var budgetDto = BudgetMapper.ToDto(budget); // Map to DTO
            var remaining = budgetDto.MonthlyLimit - budgetDto.Spent; // Calculate remaining amount

            return Ok(new { budget = budgetDto, remaining }); // Return DTO with additional data
        }





    }
}
