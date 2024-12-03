using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Budget
    {

        [Key] // Primary key
        public int Id { get; set; }

        [Required] // Ensures the column is not nullable
        public decimal MonthlyLimit { get; set; }

        public decimal Spent { get; set; }

        public ICollection<Expense>? Expenses { get; set; } = new List<Expense>();





    }
}
