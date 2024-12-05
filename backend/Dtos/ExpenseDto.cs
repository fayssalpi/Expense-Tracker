namespace backend.Dtos
{
    public class ExpenseDto
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } 
        public int BudgetId { get; set; }
        public decimal BudgetLimit { get; set; } 
    }
}
