﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Expense
    {

        [Key]
        public int Id { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public DateTime Date { get; set; }

        // Foreign Key for Category
        public int CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        public Category? Category { get; set; }


        // Foreign Key for Budget
        public int BudgetId { get; set; }

        [ForeignKey("BudgetId")]
        public Budget? Budget { get; set; }




    }
}