using backend.Dtos;
using backend.Models;

namespace backend.Mapper
{
    public class BudgetMapper
    {

        public static BudgetDto ToDto(Budget budget)
        {
            return new BudgetDto
            {
                Id = budget.Id,
                MonthlyLimit = budget.MonthlyLimit,
                Spent = budget.Spent,
                Expenses = budget.Expenses?.Select(ExpenseMapper.ToDto).ToList() ?? new List<ExpenseDto>(),
                UserId = budget.UserId,
                Month = budget.Month,  // Ensure month is included
                Year = budget.Year     // Ensure year is included

            };
        }
    }
}
