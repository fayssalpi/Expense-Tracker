import { Component, ViewChild } from '@angular/core';
import { BudgetService } from '../__Services/budget.service';
import { CommonModule } from '@angular/common'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { FormsModule } from '@angular/forms'; 
import { CategoryService } from '../__Services/category.service';
import { ExpensesService } from '../__Services/expenses.service';

import { NgApexchartsModule } from 'ng-apexcharts'; 
import { ChartComponent } from 'ng-apexcharts'; 

import Swal from 'sweetalert2';



export type ChartOptions = {
  series: any;
  chart: any;
  plotOptions: any;
  dataLabels: any;
  stroke: any;
  xaxis: any;
  yaxis: any;
  fill: any;
  tooltip: any;
  labels: any; 
  legend?: any;     
};



@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {

  public chartOptions: Partial<ChartOptions> = {}; 
  public pieChartOptions: Partial<ChartOptions> = {}; 

  notifications: { type: string; message: string; time: string }[] = [];

  budgets: any[] = [];  
  newBudget = { monthlyLimit: 0, spent: 0, month: 1, year: 2024 }; 
  newExpense = { amount: 0, date: '', categoryId: 0, budgetId: 0 }; 

  categories: any[] = []; 
  newCategory = { name: '' }; 

  successMessage: string | null = null;  
  errorMessage: string | null = null;  

  selectedBudget: any = null; 

  minDate: string = '';
  maxDate: string = '';

  currentMonthBudgetObject: any = null; 
  currentMonthBudget: any = null;
  currentMonthSpent: number = 0;
  currentMonthRemaining: number = 0;

  incrementAmount: number = 0; // Default value




  @ViewChild('addBudgetModal') addBudgetModal: any; 
  @ViewChild('addExpenseModal') addExpenseModal: any;
  @ViewChild("chart") chart!: ChartComponent;
  @ViewChild('incrementLimitModal') incrementLimitModal: any;





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
    this.loadCurrentMonthBudget();

    this.budgetService.getBudgets().subscribe(
      (response) => {
        this.budgets = response;  
      },
      (error) => {
        console.error('Error fetching budgets:', error);  
      }
    );
  }

  loadChart() {
    if (this.currentMonthBudget > 0) {
      const total = this.currentMonthBudget; 
      const spent = this.currentMonthSpent; 
  
      const progress = total > 0 ? (spent / total) * 100 : 0;
  
      const startColor = progress < 50 ? '#a8e7ed' : '#7fdbe4'; 
      const endColor = progress >= 75 ? '#5fd0df' : '#70d8e8'; 
  
      this.chartOptions = {
        series: [progress], 
        chart: {
          type: 'radialBar', 
          height: 350,
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: '70%', 
            },
            dataLabels: {
              name: {
                show: true,
                text: 'Budget Progress', 
                fontSize: '16px',
                color: '#888',
                offsetY: -10,
              },
              value: {
                show: true, 
                fontSize: '22px',
                color: '#111',
                formatter: (val: any) => `${Math.round(val)}%`, 
              },
            },
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'horizontal',
            shadeIntensity: 0.3,
            gradientToColors: [endColor], 
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 0.5,
            stops: [0, 100],
          },
        },        tooltip: {
          enabled: true, 
          y: {
            formatter: (val: any) => `${Math.round(val)}% of your budget spent`, 
          },
        },
        labels: [], // Set to an empty array to hide "series-1"
      };
    } else {
      console.warn('Budget data is not available to load the chart.');
    }
  }
  
  loadPieChart(): void {
    if (this.currentMonthBudgetObject && this.currentMonthBudgetObject.expenses) {
      const categorySpendMap: { [key: string]: number } = {};
      this.currentMonthBudgetObject.expenses.forEach((expense: any) => {
        if (categorySpendMap[expense.categoryName]) {
          categorySpendMap[expense.categoryName] += expense.amount;
        } else {
          categorySpendMap[expense.categoryName] = expense.amount;
        }
      });
  
      const categories = Object.keys(categorySpendMap); 
      const amounts = Object.values(categorySpendMap); 
  
      this.pieChartOptions = {
        series: amounts, 
        chart: {
          type: 'pie',
          height: 350,
        },
        labels: categories, 
        dataLabels: {
          enabled: true,
          formatter: (val: any, opts: any) => {
            const label = opts.w.globals.labels[opts.seriesIndex];
            return `${label}: ${Math.round(val)} %`;
          },
        },
        tooltip: {
          y: {
            formatter: (val: any) => `${val.toFixed(2)} %`,
          },
        },
        legend: {
          position: 'bottom',
        },
      };
    } else {
      console.warn('No expenses found for the current budget.');
    }
  }

  loadCurrentMonthBudget(): void {
    this.budgetService.getCurrentMonthBudget().subscribe(
      (response) => {
        console.log('API Response:', response);  
  
        if (response.message === 'No budget for this month') {
          this.currentMonthBudget = 0;  
          this.currentMonthSpent = 0;
          this.currentMonthRemaining = 0;
          this.currentMonthBudgetObject = null; 
        } else {
          this.currentMonthBudget = response.budget.monthlyLimit || 0;  
          this.currentMonthSpent = response.budget.spent || 0;
          this.currentMonthRemaining = this.currentMonthBudget - this.currentMonthSpent;
          this.currentMonthBudgetObject = response.budget; 

        }
        this.loadPieChart(); 
        this.loadChart(); 
        this.generateNotifications();
      },
      (error) => {
        console.error('Error fetching current month budget:', error);
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

  generateNotifications(): void {
    const progress = (this.currentMonthSpent / this.currentMonthBudget) * 100;
  
    this.notifications = [];
  
    if (progress >= 50 && progress < 75) {
      this.notifications.push({
        type: 'warning',
        message: 'You have spent more than 50% of your budget!',
        time: 'Just now',
      });
    }
    if (progress >= 75 && progress <= 100) {
      this.notifications.push({
        type: 'danger',
        message: 'You have spent more than 75% of your budget!',
        time: 'Just now',
      });
    }
    if (progress > 100) {
      this.notifications.push({
        type: 'danger',
        message: 'You have exceeded your budget!',
        time: 'Just now',
      });
    }
    if (progress < 50) {
      this.notifications.push({
        type: 'info',
        message: 'Your budget spending is on track.',
        time: 'Just now',
      });
    }
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
          this.showSuccessAlert('Budget added successfully!');

          this.errorMessage = null;
  
          this.budgets.push(this.newBudget); 
          this.closeModal(); 
  
          setTimeout(() => {
            window.location.reload(); 
          }, 1000); 
        }
      },
      (error) => {
        this.showErrorAlert(error.message || 'An error occurred while adding the budget');
        this.successMessage = null;
      }
    );
  }

  addCategory(): void {
    if (!this.newCategory.name) {
      this.showErrorAlert('Category name is required.');
      return;
    }
  
    this.categoryService.addCategory(this.newCategory).subscribe(
      (response) => {
        this.showSuccessAlert('Category added successfully.');
        this.categories.push(response); 
        this.newCategory.name = ''; 
      },
      (error) => {
        console.error('Error adding category:', error);
        
        if (error?.error?.message) {
          this.errorMessage = error.error.message; 
        } else {
          this.showErrorAlert(error?.error?.message || 'Error adding category.');
        }
      }
    );
  }

  openExpenseModal(budget: any): void {
    if (!this.currentMonthBudget) {
      Swal.fire({
        icon: 'error',
        title: 'No Budget Available',
        text: 'There is no budget for this month. Please add a budget first!',
        showConfirmButton: true
      });
      return; 
    }

    this.selectedBudget = budget;
    this.newExpense.budgetId = budget.id;
  
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

            this.loadCurrentMonthBudget();
      
            this.generateNotifications();

    },
    (error) => {
      this.errorMessage = error.error?.message || 'Error adding expense.';
    }
  ); }

  deleteExpense(expenseId: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expensesService.deleteExpense(expenseId).subscribe(
        () => {
          this.showSuccessAlert('Expense deleted successfully.');
          this.errorMessage = null;
  
          this.loadCurrentMonthBudget();
  
          this.budgetService.getBudgets().subscribe(
            (updatedBudgets) => {
              this.budgets = updatedBudgets;
            },
            (error) => {
              console.error('Error fetching updated budgets:', error);
            }
          );
        },
        (error) => {
          console.error('Error deleting expense:', error);
          this.showErrorAlert('Failed to delete expense.');
        }
      );
    }
  }


  addBudgetForThisMonth(): void {
    const currentDate = new Date();
    this.newBudget.month = currentDate.getMonth() + 1; // Months are 0-indexed
    this.newBudget.year = currentDate.getFullYear();
    this.newBudget.monthlyLimit = 0; // Default value
    this.newBudget.spent = 0;       // Default value
  
    this.modalService.open(this.addBudgetModal, { centered: true }); // Open the modal
  }
  
  
  
  handleAddExpense(): void {
    if (!this.currentMonthBudget) {
      this.showErrorAlert('No budget available for this month. Please add a budget first!');
    } else {
      this.openExpenseModal(this.currentMonthBudgetObject);
    }
  }

  openIncrementLimitModal(): void {
    this.incrementAmount = 0; 
    this.modalService.open(this.incrementLimitModal, { centered: true }); 
  }

  incrementMonthlyLimit(): void {
    console.log('Current month budget in increment method:', this.currentMonthBudgetObject?.id);
    if (!this.currentMonthBudget || !this.currentMonthBudgetObject?.id) {
      console.error('No current budget to increment');
      return;
    }
  
    this.budgetService.incrementMonthlyLimit(this.currentMonthBudgetObject.id, this.incrementAmount).subscribe({
      next: (response) => {

        this.showSuccessAlert('Monthly limit incremented successfully!');

        this.loadCurrentMonthBudget();
        this.loadChart();
        this.loadPieChart();
  
        this.closeModal();
  
        this.incrementAmount = 0;
  
        console.log('Monthly limit incremented successfully:', response);
      },
      error: (err) => {
        this.showErrorAlert(err.message || 'Failed to increment monthly limit');
      }
    });
  }
  
  

}
