﻿using backend.Data;
using backend.Dtos;
using backend.Mapper;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BudgetController : ControllerBase
    {
        private readonly IBudgetRepository _repository;
        private readonly AppDbContext _context;



        public BudgetController(IBudgetRepository repository, AppDbContext context)
        {
            _repository = repository;
            _context = context;

        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllBudgets()
        {
            try
            {
                var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");

                var budgets = await _repository.GetBudgetsByUserIdWithDetails(userId);
                var budgetDtos = budgets.Select(BudgetMapper.ToDto).ToList();

                return Ok(budgetDtos);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error fetching budgets: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while fetching budgets." });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetBudgetById(int id)
        {
            try
            {
                var budget = await _repository.GetBudgetById(id);

                if (budget == null) return NotFound(new { message = "Budget not found." });

                var budgetDto = BudgetMapper.ToDto(budget);
                return Ok(budgetDto);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error fetching budget by ID: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while fetching the budget." });
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddBudget([FromBody] Budget budget)
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized(new { success = false, message = "Unauthorized access." });

                var userId = int.Parse(userIdClaim);
                budget.UserId = userId;

                await _repository.AddBudget(budget);

                return CreatedAtAction(nameof(GetBudgetById), new { id = budget.Id }, new
                {
                    success = true,
                    message = "Budget added successfully",
                    id = budget.Id
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Unexpected error adding budget: {ex.Message}");
                return StatusCode(500, new { success = false, message = "An unexpected error occurred." });
            }
        }


        [HttpGet("current-month")]
        [Authorize]
        public async Task<IActionResult> GetCurrentMonthBudget()
        {
            try
            {
                var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
                var currentDate = DateTime.Now;

                var budget = await _repository.GetCurrentMonthBudget(userId, currentDate.Month, currentDate.Year);

                if (budget == null)
                {
                    return Ok(new { message = "No budget for this month" });
                }

                var budgetDto = BudgetMapper.ToDto(budget);
                var remaining = budgetDto.MonthlyLimit - budgetDto.Spent;

                return Ok(new { budget = budgetDto, remaining });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error fetching current month budget: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while fetching the current month budget." });
            }
        }

        [HttpPatch("{id}/increment-monthly-limit")]
        [Authorize]

        public async Task<IActionResult> IncrementMonthlyLimit(int id, [FromBody] IncrementLimitDto data)
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");

            var budget = await _context.Budgets.FindAsync(id);
            if (budget == null || budget.UserId != userId)
            {
                return NotFound(new { message = "Budget not found or not authorized", success = false });
            }

            if (data == null || data.Amount <= 0)
            {
                return BadRequest(new { message = "Invalid amount", success = false });
            }

            budget.MonthlyLimit += data.Amount;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Monthly limit incremented successfully", success = true, newMonthlyLimit = budget.MonthlyLimit });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message, success = false });
            }
        }
    }
}
