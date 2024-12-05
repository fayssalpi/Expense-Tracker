using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;



namespace backend.Repositories
{
    public class BudgetRepository : IBudgetRepository
    {
        private readonly AppDbContext _context;
        public BudgetRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddBudget(Budget budget)
        {
            var existingBudget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.UserId == budget.UserId && b.Month == budget.Month && b.Year == budget.Year);

            if (existingBudget != null)
            {
                throw new InvalidOperationException("A budget for this month and year already exists for this user.");
            }

            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();
        }
        public async  Task DeleteBudget(int id)
        {
            var budget = await _context.Budgets.FindAsync(id);
            if (budget != null)
            {
                _context.Budgets.Remove(budget);
                await _context.SaveChangesAsync();
            }
        }
        public async  Task<IEnumerable<Budget>> GetAllBudgets()
        {
            return await _context.Budgets.ToListAsync();
        }
        public async Task<Budget> GetBudgetById(int id)
        {
            return await _context.Budgets.FindAsync(id);
        }
        public async Task UpdateBudget(Budget budget)
        {
            _context.Budgets.Update(budget);
            await _context.SaveChangesAsync();
        }
    }
}
