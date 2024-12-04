using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

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

        // Foreign key to User
        public int UserId { get; set; } // Foreign key

        // Navigation property to User
        public User? User { get; set; }  // Nullable if you don't need the full User object here

        // Month and Year fields to prevent duplicate budgets for the same month
        [Required]
        public int Month { get; set; } // 1 = January, 12 = December

        [Required]
        public int Year { get; set; } // Year (e.g., 2024)









    }
}
