import { Component, ViewChild } from '@angular/core';
import { BudgetService } from '../__Services/budget.service';
import { CommonModule } from '@angular/common'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { FormsModule } from '@angular/forms'; 
import { CategoryService } from '../__Services/category.service';
import { ExpensesService } from '../__Services/expenses.service';

import Swal from 'sweetalert2';



@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent {



  budgets: any[] = [];  
  newBudget = { monthlyLimit: 0, spent: 0, month: 1, year: 2024 }; 
  newExpense = { amount: 0, date: '', categoryId: 0, budgetId: 0 }; 

  categories: any[] = []; 

  successMessage: string | null = null;  
  errorMessage: string | null = null;  

  selectedBudget: any = null; 

  minDate: string = '';
  maxDate: string = '';

  currentMonthBudgetObject: any = null; 
  currentMonthBudget: any = null;
  currentMonthSpent: number = 0;
  currentMonthRemaining: number = 0;



  @ViewChild('addBudgetModal') addBudgetModal: any; 
  @ViewChild('addExpenseModal') addExpenseModal: any;

  constructor(private budgetService: BudgetService,
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private expensesService: ExpensesService
  ) { }


    showSuccessAlert(message: string): void {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message,
        showConfirmButton: false,
        timer: 3000 
      });
    }
  
    showErrorAlert(message: string): void {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message,
        showConfirmButton: false,
        timer: 3000 
      });
    }

  ngOnInit(): void {
    this.loadCategories();


    this.budgetService.getBudgets().subscribe(
      (response) => {
        this.budgets = response;  
      },
      (error) => {
        console.error('Error fetching budgets:', error);  
      }
    );
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (response) => {
        this.categories = response; 
      },
      (error) => {
        console.error('Error fetching categories:', error);
        this.showErrorAlert('Error fetching categories.');
      }
    );
  }


  
  getMonthName(month: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1]; 
  }

  openModal(content: any) {
    this.modalService.open(content); 
  }

  closeModal() {
    this.modalService.dismissAll(); 
  }

  onSubmit() {
    this.budgetService.addBudget(this.newBudget).subscribe(
      (response) => {
        if (response.success) {
          this.successMessage = response.message;
          this.errorMessage = null;  
          this.budgets.push(this.newBudget);  
          this.showSuccessAlert('Budget added successfully');

          this.closeModal();  
        }
      },
      (error) => {
        this.showErrorAlert(error.message || 'An error occurred while adding the budget');
        this.successMessage = null;  
      }
    );
  }


  openExpenseModal(budget: any) {
    this.selectedBudget = budget;
    this.newExpense.budgetId = budget.id;

    console.error('Budget Idddddd',  this.newExpense.budgetId);


    const year = budget.year;
    const month = budget.month;

    const startDate = new Date(year, month - 1, 1); 
    const endDate = new Date(year, month, 0); 

    this.minDate = startDate.toISOString().split('T')[0];
    this.maxDate = endDate.toISOString().split('T')[0];

    this.openModal(this.addExpenseModal);
  }


  addExpense(): void {
    if (!this.newExpense.amount || !this.newExpense.date || !this.newExpense.categoryId) {
      this.showErrorAlert('All fields are required!');
      return;
    }
  
    this.expensesService.addExpense(this.newExpense).subscribe(
      (response) => {
        this.showSuccessAlert('Expense added successfully!');
  
        this.budgetService.getBudgets().subscribe(
          (updatedBudgets) => {
            this.budgets = updatedBudgets;  
          },
          (error) => {
            console.error('Error fetching updated budgets:', error);
            this.showErrorAlert('Error updating budgets.');
          }
        );
  
              this.budgetService.getCurrentMonthBudget().subscribe(
                (response) => {
                  if (response.message === 'No budget for this month') {
                    this.currentMonthBudget = null;
                    this.currentMonthSpent = 0;
                    this.currentMonthRemaining = 0;
                  } else {
                    this.currentMonthBudget = response.budget;
                    this.currentMonthSpent = this.currentMonthBudget.spent || 0;
                    this.currentMonthRemaining = this.currentMonthBudget.MonthlyLimit - this.currentMonthSpent;
                  }
                },
                (error) => {
                  console.error('Error fetching current month budget:', error);
                  this.showErrorAlert(error.error?.message || 'Error adding expense.');
                }
              );
  
        this.newExpense = { amount: 0, date: '', categoryId: 0, budgetId: 0 };
        this.closeModal();
  
        
      },
      (error) => {
        this.errorMessage = error.error?.message || 'Error adding expense.';
      }
    ); }

  


}
