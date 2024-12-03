import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MainContentComponent } from './main-content/main-content.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfilComponent } from './profil/profil.component';
import { filter } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
            RouterModule,
            HeaderComponent,
            SidebarComponent,
            MainContentComponent,
            FooterComponent,
            ProfilComponent,
            LoginComponent,
            RegisterComponent
          ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Dashboard';
  showSidebar = false;
  showHeader = false;

  constructor(private router: Router) {
    // Listen to route changes and determine if the header and sidebar should be displayed
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const authenticatedRoutes = ['/main', '/profil']; // Routes with the header and sidebar
      this.showSidebar = authenticatedRoutes.includes(this.router.url);
      this.showHeader = authenticatedRoutes.includes(this.router.url);
    });
  }

  



}
