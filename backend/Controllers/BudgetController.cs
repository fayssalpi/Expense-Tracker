using backend.Data;
using backend.Dtos;
using backend.Mapper;
using backend.Models;
using backend.Repositories.Interfaces;
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
            // Fetch all budgets with related expenses and categories
            var budgets = await _context.Budgets
                .Include(b => b.Expenses)
                .ThenInclude(e => e.Category) // Include Category for each Expense
                .ToListAsync();

            // Map to DTOs
            var budgetDtos = budgets.Select(BudgetMapper.ToDto).ToList();

            return Ok(budgetDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBudgetById(int id)
        {
            var budget = await _context.Budgets
                .Include(b => b.Expenses)
                .ThenInclude(e => e.Category)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (budget == null) return NotFound();

            // Use the mapper to transform to DTO
            var budgetDto = BudgetMapper.ToDto(budget);
            return Ok(budgetDto);
        }

        [HttpPost]
        public async Task<IActionResult> AddBudget([FromBody] Budget budget)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await _repository.AddBudget(budget);
            return CreatedAtAction(nameof(GetBudgetById), new { id = budget.Id }, budget);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBudget(int id, [FromBody] Budget budget)
        {
            if (id != budget.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await _repository.UpdateBudget(budget);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBudget(int id)
        {
            var budget = await _repository.GetBudgetById(id);
            if (budget == null) return NotFound();

            await _repository.DeleteBudget(id);
            return NoContent();


        }






    }
}
