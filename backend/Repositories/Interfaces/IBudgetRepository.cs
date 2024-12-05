using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IBudgetRepository
    {
        Task<IEnumerable<Budget>> GetAllBudgets();
        Task<Budget> GetBudgetById(int id);
        Task AddBudget(Budget budget);
        Task UpdateBudget(Budget budget);
        Task DeleteBudget(int id);
    }
}
