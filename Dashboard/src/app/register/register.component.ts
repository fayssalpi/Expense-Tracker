import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../__Services/auth.service';
import { CommonModule } from '@angular/common'; 
import Swal from 'sweetalert2';


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

  constructor(private authService: AuthService, private router: Router ) {}

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

  onSubmit(): void {
    this.authService.register(this.username, this.password).subscribe(
      (response) => {
        this.successMessage = response.message; 
        this.showSuccessAlert('Registration Success.');
        
        this.router.navigate(['/login']);
      },
      (error) => {
        this.showErrorAlert('Registration failed. Please try again.');      }
    );
  }

}
