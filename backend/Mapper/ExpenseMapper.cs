using backend.Dtos;
using backend.Models;

namespace backend.Mapper
{
    public class ExpenseMapper
    {

        public static ExpenseDto ToDto(Expense expense)
        {
            return new ExpenseDto
            {
                Id = expense.Id,
                Amount = expense.Amount,
                Date = expense.Date,
                CategoryId = expense.CategoryId,
                CategoryName = expense.Category?.Name ?? "Uncategorized",
                BudgetId = expense.BudgetId,
                BudgetLimit = expense.Budget?.MonthlyLimit ?? 0
            };
        }

    }
}
