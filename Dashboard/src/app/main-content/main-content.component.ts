import { Component, ViewChild } from '@angular/core';
import { BudgetService } from '../__Services/budget.service';
import { CommonModule } from '@angular/common'; // Import CommonModule to use built-in pipes
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // If you're using ng-bootstrap modal
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MessageService } from '../__Services/message.service'; // Inject the message service
import { CategoryService } from '../__Services/category.service';





@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {

  budgets: any[] = [];  
  newBudget = { monthlyLimit: 0, spent: 0, month: 1, year: 2024 }; 

  categories: any[] = []; 
  newCategory = { name: '' }; 



  successMessage: string | null = null;  
  errorMessage: string | null = null;  


  @ViewChild('addBudgetModal') addBudgetModal: any; 

  constructor(private budgetService: BudgetService,
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private messageService: MessageService 


  ) { }

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





}
