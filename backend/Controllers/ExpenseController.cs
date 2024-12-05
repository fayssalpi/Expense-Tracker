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
        public async Task<IActionResult> GetAllExpenses()
        {
            var expenses = await _repository.GetAllExpenses();

            var expenseDtos = expenses.Select(ExpenseMapper.ToDto);

            return Ok(expenseDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetExpenseById(int id)
        {
            var expense = await _repository.GetExpenseById(id);
            if (expense == null) return NotFound();

            var expenseDto = ExpenseMapper.ToDto(expense);

            return Ok(expenseDto);
        }

        [HttpPost]
        public async Task<IActionResult> AddExpense([FromBody] Expense expense)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == expense.BudgetId);
            if (budget == null) return BadRequest(new { error = "Invalid BudgetId." });

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == expense.CategoryId);
            if (!categoryExists) return BadRequest(new { error = "Invalid CategoryId." });

            await _repository.AddExpense(expense);

            budget.Spent += expense.Amount;
            _context.Budgets.Update(budget);

            if (budget.Spent > budget.MonthlyLimit)
            {
                await NotifyUserBudgetExceeded(budget);
            }

            await _context.SaveChangesAsync();

            var expenseDto = ExpenseMapper.ToDto(expense);

            return CreatedAtAction(nameof(GetExpenseById), new { id = expense.Id }, expenseDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExpense(int id, [FromBody] Expense expense)
        {
            if (id != expense.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == expense.CategoryId);
            if (!categoryExists) return BadRequest("Invalid CategoryId.");

            await _repository.UpdateExpense(expense);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var expense = await _repository.GetExpenseById(id);
            if (expense == null) return NotFound();

            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == expense.BudgetId);
            if (budget == null) return BadRequest(new { error = "Invalid BudgetId." });

            budget.Spent -= expense.Amount;

            if (budget.Spent < 0)
            {
                budget.Spent = 0;
            }

            _context.Budgets.Update(budget);

            await _repository.DeleteExpense(id);

            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpGet("by-category/{categoryId}")]
        public async Task<IActionResult> GetExpensesByCategory(int categoryId)
        {
            var expenses = await _context.Expenses
                                          .Include(e => e.Category)
                                          .Where(e => e.CategoryId == categoryId)
                                          .ToListAsync();

            var expenseDtos = expenses.Select(ExpenseMapper.ToDto);
            return Ok(expenseDtos);
        }

        [HttpGet("by-budget/{budgetId}")]
        public async Task<IActionResult> GetExpensesByBudget(int budgetId)
        {
            var expenses = await _context.Expenses
                                          .Include(e => e.Category)
                                          .Include(e => e.Budget)
                                          .Where(e => e.BudgetId == budgetId)
                                          .ToListAsync();

            var expenseDtos = expenses.Select(ExpenseMapper.ToDto);
            return Ok(expenseDtos);
        }

        private async Task NotifyUserBudgetExceeded(Budget budget)
        {
            Console.WriteLine($"Budget exceeded! Budget ID: {budget.Id}, Limit: {budget.MonthlyLimit}, Spent: {budget.Spent}");

        }




    }





}

