import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MainContentComponent } from './main-content/main-content.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfilComponent } from './profil/profil.component';
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
  isAuthenticated = false;  // Flag to check authentication

  constructor(private router: Router, private authService: AuthService) {
    // Subscribe to router events
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      // Check if the user is authenticated
      this.isAuthenticated = this.authService.isAuthenticated();
      
      // Show the sidebar and header only if authenticated
      this.showSidebar = this.isAuthenticated;
      this.showHeader = this.isAuthenticated;
    });
  }

  



}
