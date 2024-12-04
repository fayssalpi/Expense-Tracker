import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../__Services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Import CommonModule




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}


  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe(
      (response: any) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          this.router.navigate(['/main']); 
        }
      },
      (error) => {
        this.errorMessage = 'Invalid username or password';
        console.error(error);
      }
    );
  }




}
