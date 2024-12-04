import { Component, ViewChild } from '@angular/core';
import { BudgetService } from '../__Services/budget.service';
import { CommonModule } from '@angular/common'; // Import CommonModule to use built-in pipes
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // If you're using ng-bootstrap modal
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MessageService } from '../__Services/message.service'; // Inject the message service
import { CategoryService } from '../__Services/category.service';
import { ExpensesService } from '../__Services/expenses.service';

import { NgApexchartsModule } from 'ng-apexcharts'; // Import NgApexchartsModule
import { ChartComponent } from 'ng-apexcharts'; // Import ChartComponent for ApexCharts


// Define the chart options interface
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
  labels: any; // Add labels here
  legend?: any;      // Add legend for better control


};






@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {

  public chartOptions: Partial<ChartOptions> = {}; // Initialize chart options

  public pieChartOptions: Partial<ChartOptions> = {}; // Pie chart options


  



  budgets: any[] = [];  
  newBudget = { monthlyLimit: 0, spent: 0, month: 1, year: 2024 }; 
  newExpense = { amount: 0, date: '', categoryId: 0, budgetId: 0 }; // Expense data model


  categories: any[] = []; 
  newCategory = { name: '' }; 



  successMessage: string | null = null;  
  errorMessage: string | null = null;  

  selectedBudget: any = null; // To store the selected budget



  minDate: string = '';
  maxDate: string = '';

  // Variables for the current month's budget info
  currentMonthBudgetObject: any = null; 
  currentMonthBudget: any = null;
  currentMonthSpent: number = 0;
  currentMonthRemaining: number = 0;



  @ViewChild('addBudgetModal') addBudgetModal: any; 
  @ViewChild('addExpenseModal') addExpenseModal: any;
  @ViewChild("chart") chart!: ChartComponent; // Chart reference




  constructor(private budgetService: BudgetService,
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private messageService: MessageService ,
    private expensesService: ExpensesService



  ) { }

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
    // Ensure data is available before rendering the chart
    if (this.currentMonthBudget > 0) {
      const total = this.currentMonthBudget; // Monthly limit from API response
      const spent = this.currentMonthSpent;  // Spent amount from API response
  
      // Calculate percentage progress
      const progress = total > 0 ? (spent / total) * 100 : 0;


      // Define gradient shades of red based on spending percentage
      const startColor = progress < 50 ? '#a8e7ed' : '#7fdbe4'; // Light cyan for <50%, medium for 50-75%
      const endColor = progress >= 75 ? '#5fd0df' : '#70d8e8';  // Saturated cyan for >75%, medium-dark otherwise
    
      // Update chart options with real data
      this.chartOptions = {
        series: [
          {
            name: 'Progress', // Name for the series
            data: [progress], // Data array, containing the progress value
          },
        ],
        chart: {
          type: 'bar', // Set chart type to bar for a linear progress bar
          height: 100,
          sparkline: {
            enabled: true, // Use sparklines to show in-line chart
          },
        },
        plotOptions: {
          bar: {
            horizontal: true, // Make the bar horizontal
            dataLabels: {
              position: 'top', // Position the percentage on the bar
            },
          },
        },
        dataLabels: {
          enabled: true, // Enable data labels to display the progress value
          formatter: (val: any) => `${Math.round(val)}%`, // Display percentage
        },
        stroke: {
          width: 0, // No border for the bars
        },
        xaxis: {
          categories: ['Progress'], // Label for the x-axis
          labels: {
            show: false, // Hide x-axis labels
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'horizontal',
            shadeIntensity: 0.3,
            gradientToColors: [endColor], // Color of the bar
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 0.5,
            stops: [0, 100],
            colorStops: [
              {
                offset: 0,
                color: startColor, // Dynamic start color
                opacity: 1,
              },
              {
                offset: 100,
                color: endColor, // Dynamic end color
                opacity: 1,
              },
            ],
          },
        },
        tooltip: {
          y: {
            formatter: (val: any) => `${val.toFixed(2)}%`, // Tooltip to show percentage
          },
        },
      };
    } else {
      console.warn('Budget data is not available to load the chart.');
    }
  }

  loadPieChart(): void {
    if (this.currentMonthBudgetObject && this.currentMonthBudgetObject.expenses) {
      // Aggregate spending by category
      const categorySpendMap: { [key: string]: number } = {};
      this.currentMonthBudgetObject.expenses.forEach((expense: any) => {
        if (categorySpendMap[expense.categoryName]) {
          categorySpendMap[expense.categoryName] += expense.amount;
        } else {
          categorySpendMap[expense.categoryName] = expense.amount;
        }
      });
  
      // Prepare data for the pie chart
      const categories = Object.keys(categorySpendMap); // Category names
      const amounts = Object.values(categorySpendMap); // Spending amounts
  
      // Update pie chart options
      this.pieChartOptions = {
        series: amounts, // Spending per category
        chart: {
          type: 'pie',
          height: 350,
        },
        labels: categories, // Category names
        dataLabels: {
          enabled: true,
          formatter: (val: any, opts: any) => {
            const label = opts.w.globals.labels[opts.seriesIndex];
            return `${label}: ${Math.round(val)} USD`;
          },
        },
        tooltip: {
          y: {
            formatter: (val: any) => `${val.toFixed(2)} USD`, // Tooltip to show amount
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
        this.errorMessage = 'Error fetching categories.'; 
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
          this.closeModal();  
        }
      },
      (error) => {
        this.errorMessage = error.message || 'An error occurred while adding the budget';
        this.successMessage = null;  
      }
    );
  }


  addCategory(): void {
    if (!this.newCategory.name) {
      this.errorMessage = 'Category name is required.';
      return;
    }
  
    this.categoryService.addCategory(this.newCategory).subscribe(
      (response) => {
        this.successMessage = 'Category added successfully.';
        this.categories.push(response); 
        this.newCategory.name = ''; 
      },
      (error) => {
        console.error('Error adding category:', error);
        
        if (error?.error?.message) {
          this.errorMessage = error.error.message; 
        } else {
          this.errorMessage = 'Error adding category.'; 
        }
      }
    );
  }




  // Method to open the expense modal for the selected budget
  openExpenseModal(budget: any) {
    this.selectedBudget = budget;
    this.newExpense.budgetId = budget.id;

    // Set the valid date range based on the selected budget's month and year
    const year = budget.year;
    const month = budget.month;

    const startDate = new Date(year, month - 1, 1); // First day of the month
    const endDate = new Date(year, month, 0); // Last day of the month (0th day of the next month)

    // Format the dates to yyyy-mm-dd
    this.minDate = startDate.toISOString().split('T')[0];
    this.maxDate = endDate.toISOString().split('T')[0];

    this.openModal(this.addExpenseModal);
  }
  
   // Add the expense
addExpense(): void {
  if (!this.newExpense.amount || !this.newExpense.date || !this.newExpense.categoryId) {
    this.errorMessage = 'All fields are required!';
    return;
  }

  this.expensesService.addExpense(this.newExpense).subscribe(
    (response) => {
      this.successMessage = 'Expense added successfully!';

      // After successfully adding the expense, refresh the budgets list
      this.budgetService.getBudgets().subscribe(
        (updatedBudgets) => {
          this.budgets = updatedBudgets;  // Update the budgets with the latest data
        },
        (error) => {
          console.error('Error fetching updated budgets:', error);
          this.errorMessage = 'Error updating budgets.';
        }
      );

            // Reload current month budget info for the cards
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
                this.errorMessage = 'Error fetching current month budget.';
              }
            );

      // Clear the newExpense object and close the modal
      this.newExpense = { amount: 0, date: '', categoryId: 0, budgetId: 0 };
      this.closeModal();
    },
    (error) => {
      this.errorMessage = error.error?.message || 'Error adding expense.';
    }
  ); }


}
