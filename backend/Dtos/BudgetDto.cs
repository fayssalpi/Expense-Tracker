namespace backend.Dtos
{
    public class BudgetDto
    {

        public int Id { get; set; }
        public decimal MonthlyLimit { get; set; }
        public decimal Spent { get; set; }
        public List<ExpenseDto> Expenses { get; set; } // List of related expenses
        public int UserId { get; set; } // Add UserId in the DTO
        public int Month { get; set; } // Month (1 = January, 12 = December)
        public int Year { get; set; } // Year (e.g., 2024)




    }
}
