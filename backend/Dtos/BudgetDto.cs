namespace backend.Dtos
{
    public class BudgetDto
    {

        public int Id { get; set; }
        public decimal MonthlyLimit { get; set; }
        public decimal Spent { get; set; }
        public List<ExpenseDto> Expenses { get; set; } // List of related expenses
    }
}
