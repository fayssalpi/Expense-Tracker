using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace backend.Models
{
    public class Budget
    {
        [Key] 
        public int Id { get; set; }

        [Required] 
        public decimal MonthlyLimit { get; set; }

        public decimal Spent { get; set; }

        public ICollection<Expense>? Expenses { get; set; } = new List<Expense>();

        public int UserId { get; set; } 

        public User? User { get; set; }  

        [Required]
        public int Month { get; set; } 

        [Required]
        public int Year { get; set; } 

    }
}
