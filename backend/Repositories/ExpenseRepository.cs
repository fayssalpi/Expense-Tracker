using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace backend.Repositories
{
    public class ExpenseRepository : IExpenseRepository
    {
        private readonly AppDbContext _context;
        public ExpenseRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddExpense(Expense expense)
        {
            _context.Expenses.Add(expense);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteExpense(int id)
        {
            var expense = await _context.Expenses.FindAsync(id);
            if (expense != null)
            {
                _context.Expenses.Remove(expense);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<Expense>> GetAllExpenses()
        {
            return await _context.Expenses.Include(e => e.Category).Include(e => e.Budget).ToListAsync();
        }

        public async Task<Expense> GetExpenseById(int id)
        {
            return await _context.Expenses.Include(e => e.Category).Include(e => e.Budget).FirstOrDefaultAsync(e => e.Id == id);
        }
        public async Task UpdateExpense(Expense expense)
        {
            _context.Expenses.Update(expense);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Expense>> GetExpensesByBudgetId(int budgetId)
        {
            return await _context.Expenses
                .Include(e => e.Category)
                .Include(e => e.Budget)
                .Where(e => e.BudgetId == budgetId)
                .ToListAsync();
        }
    }
}
