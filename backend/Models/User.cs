using System.ComponentModel.DataAnnotations;


namespace backend.Models



{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public ICollection<Budget> Budgets { get; set; } = new List<Budget>();

        // Navigation property for categories related to this user
        public ICollection<Category> Categories { get; set; } = new List<Category>();




    }
}
