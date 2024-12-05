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
        [Authorize]
        public async Task<IActionResult> GetAllBudgets()
        {
            try
            {
                var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");

                var budgets = await _context.Budgets
                    .Where(b => b.UserId == userId)
                    .Include(b => b.Expenses)
                    .ThenInclude(e => e.Category)
                    .ToListAsync();

                var budgetDtos = budgets.Select(BudgetMapper.ToDto).ToList();

                return Ok(budgetDtos);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error fetching budgets: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while fetching budgets." });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetBudgetById(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");

                var budget = await _context.Budgets
                    .Where(b => b.UserId == userId)
                    .Include(b => b.Expenses)
                    .ThenInclude(e => e.Category)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (budget == null) return NotFound(new { message = "Budget not found." });

                var budgetDto = BudgetMapper.ToDto(budget);
                return Ok(budgetDto);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error fetching budget by ID: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while fetching the budget." });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddBudget([FromBody] Budget budget)
        {
            try
            {
                var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");

                if (!ModelState.IsValid)
                    return BadRequest(new { message = "Invalid data", success = false });

                budget.UserId = userId;

                await _repository.AddBudget(budget);
                return CreatedAtAction(nameof(GetBudgetById), new { id = budget.Id }, new { message = "Budget added successfully", success = true });
            }
            catch (InvalidOperationException ex)
            {
                Console.Error.WriteLine($"Error adding budget: {ex.Message}");
                return BadRequest(new { message = ex.Message, success = false });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Unexpected error adding budget: {ex.Message}");
                return StatusCode(500, new { message = "An unexpected error occurred.", success = false });
            }
        }


        [HttpGet("current-month")]
        [Authorize]
        public async Task<ActionResult<BudgetDto>> GetCurrentMonthBudget()
        {
            try
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

                var budgetDto = BudgetMapper.ToDto(budget);
                var remaining = budgetDto.MonthlyLimit - budgetDto.Spent;

                return Ok(new { budget = budgetDto, remaining });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error fetching current month budget: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while fetching the current month budget." });
            }
        }

        [HttpPatch("{id}/increment-monthly-limit")]
        [Authorize]
        public async Task<IActionResult> IncrementMonthlyLimit(int id, [FromBody] IncrementLimitDto data)
        {
            try
            {
                var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");

                var budget = await _context.Budgets.FindAsync(id);
                if (budget == null || budget.UserId != userId)
                {
                    return NotFound(new { message = "Budget not found or not authorized", success = false });
                }

                if (data == null || data.Amount <= 0)
                {
                    return BadRequest(new { message = "Invalid amount", success = false });
                }

                budget.MonthlyLimit += data.Amount;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Monthly limit incremented successfully", success = true, newMonthlyLimit = budget.MonthlyLimit });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error incrementing monthly limit: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while incrementing the monthly limit.", success = false });
            }
        }
    }
}

