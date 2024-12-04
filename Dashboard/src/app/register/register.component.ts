import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../__Services/auth.service';
import { MessageService } from '../__Services/message.service';
import { CommonModule } from '@angular/common'; // Add this import




@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,RouterModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private messageService: MessageService, private router: Router ) {}

  onSubmit(): void {
    this.authService.register(this.username, this.password).subscribe(
      (response) => {
        // Display success message
        this.successMessage = response.message;  // Backend response with success message
        this.messageService.changeMessage(this.successMessage);  // Update message
        
        // Redirect to login page after successful registration
        this.router.navigate(['/login']);
      },
      (error) => {
        // Display error message
        this.errorMessage = 'Registration failed. Please try again.';
        this.messageService.changeMessage(this.errorMessage);  // Update message
      }
    );
  }




}
