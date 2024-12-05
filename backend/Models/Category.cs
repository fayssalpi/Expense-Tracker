using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Category
    {
        [Key] 
        public int Id { get; set; }

        [Required] 
        public string Name { get; set; }

        public ICollection<Expense>? Expenses { get; set; } = new List<Expense>();

        public int UserId { get; set; }  

        public User? User { get; set; }

    }
}
