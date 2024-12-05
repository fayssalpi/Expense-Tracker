namespace backend.Dtos
{
    public class BudgetDto
    {

        public int Id { get; set; }
        public decimal MonthlyLimit { get; set; }
        public decimal Spent { get; set; }
        public List<ExpenseDto> Expenses { get; set; } 
        public int UserId { get; set; } 
        public int Month { get; set; } 
        public int Year { get; set; } 


    }
}
