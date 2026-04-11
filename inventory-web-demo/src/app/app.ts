import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Toast } from "./shared/components/toast/toast";
import { Sidebar } from './shared/components/sidebar/sidebar';
import { Navbar } from './shared/components/navbar/navbar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
    Toast,
    Navbar,
    Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  closeAll(sidebar: any, navbar: any) {
    sidebar.sidebarClose = true;
    navbar.navbarClose = true;
  }

  protected readonly title = signal('inventory-web');

}

