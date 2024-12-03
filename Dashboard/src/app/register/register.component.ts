import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = '';  // Define username property
  password: string = '';  // Define password property

  // Define onSubmit method to handle form submission
  onSubmit(): void {
    console.log('Registering:', this.username, this.password);
    // Here you can add the logic to call the registration API
  }


}
