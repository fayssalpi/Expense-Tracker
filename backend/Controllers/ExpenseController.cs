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
    public class ExpenseController : ControllerBase
    {
        private readonly IExpenseRepository _repository;
        private readonly AppDbContext _context;

        public ExpenseController(IExpenseRepository repository, AppDbContext context)
        {
            _repository = repository;
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllExpenses()
        {
            try
            {
                var expenses = await _repository.GetAllExpenses();
                var expenseDtos = expenses.Select(ExpenseMapper.ToDto);
                return Ok(expenseDtos);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error fetching expenses: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while fetching expenses." });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetExpenseById(int id)
        {
            try
            {
                var expense = await _repository.GetExpenseById(id);
                if (expense == null) return NotFound(new { message = "Expense not found." });

                var expenseDto = ExpenseMapper.ToDto(expense);
                return Ok(expenseDto);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error fetching expense by ID: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while fetching the expense." });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddExpense([FromBody] Expense expense)
        {
            try
            {
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == expense.BudgetId);
                if (budget == null) return BadRequest(new { error = "Invalid BudgetId." });

                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == expense.CategoryId);
                if (!categoryExists) return BadRequest(new { error = "Invalid CategoryId." });

                await _repository.AddExpense(expense);

                budget.Spent += expense.Amount;
                _context.Budgets.Update(budget);

                await _context.SaveChangesAsync();

                var expenseDto = ExpenseMapper.ToDto(expense);

                return CreatedAtAction(nameof(GetExpenseById), new { id = expense.Id }, expenseDto);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error adding expense: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while adding the expense." });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody] Expense expense)
        {
            try
            {
                if (id != expense.Id) return BadRequest(new { message = "Expense ID mismatch." });
                if (!ModelState.IsValid) return BadRequest(ModelState);

                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == expense.CategoryId);
                if (!categoryExists) return BadRequest(new { message = "Invalid CategoryId." });

                await _repository.UpdateExpense(expense);
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error updating expense: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while updating the expense." });
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            try
            {
                var expense = await _repository.GetExpenseById(id);
                if (expense == null) return NotFound(new { message = "Expense not found." });

                var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == expense.BudgetId);
                if (budget == null) return BadRequest(new { error = "Invalid BudgetId." });

                budget.Spent -= expense.Amount;
                budget.Spent = Math.Max(budget.Spent, 0);

                _context.Budgets.Update(budget);

                await _repository.DeleteExpense(id);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error deleting expense: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while deleting the expense." });
            }

        }


        [HttpGet("by-budget/{budgetId}")]
        [Authorize]
        public async Task<IActionResult> GetExpensesByBudget(int budgetId)
        {
            try
            {
                var expenses = await _repository.GetExpensesByBudgetId(budgetId);
                var expenseDtos = expenses.Select(ExpenseMapper.ToDto);
                return Ok(expenseDtos);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error fetching expenses by budget: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while fetching expenses by budget." });
            }
        }

    }

}

