using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Category
    {

        [Key] // Primary key
        public int Id { get; set; }

        [Required] // Ensure the name is not null
        public string Name { get; set; }

        // Navigation property for related expenses
        public ICollection<Expense>? Expenses { get; set; } = new List<Expense>();

        // Foreign key for User
        public int UserId { get; set; }  // This will be the foreign key to associate with User

        // Navigation property for related user
        public User? User { get; set; }




    }
}
