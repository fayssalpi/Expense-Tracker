import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MainContentComponent } from './main-content/main-content.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { filter } from 'rxjs';
import { AuthService } from './__Services/auth.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Dashboard';
  showSidebar = false;
  showHeader = false;
  isAuthenticated = false;  

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.isAuthenticated = this.authService.isAuthenticated();
      this.showSidebar = this.isAuthenticated;
      this.showHeader = this.isAuthenticated;
    });
  }

  



}
