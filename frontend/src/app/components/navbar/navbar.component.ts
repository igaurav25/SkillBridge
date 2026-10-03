import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  notificationService = inject(NotificationService);
  private router = inject(Router);

  isMobileMenuOpen = false;
  isNotificationsOpen = false;
  isUserMenuOpen = false;

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.notificationService.getMyNotifications().subscribe();
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  toggleNotifications(event: Event) {
    event.stopPropagation();
    this.isNotificationsOpen = !this.isNotificationsOpen;
    this.isUserMenuOpen = false;
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.isNotificationsOpen = false;
  }

  closeDropdowns() {
    this.isNotificationsOpen = false;
    this.isUserMenuOpen = false;
  }

  markAsRead(id: string, link?: string) {
    this.notificationService.markAsRead(id).subscribe();
    if (link) {
      this.closeDropdowns();
      this.router.navigateByUrl(link);
    }
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe();
  }

  logout() {
    this.closeDropdowns();
    this.authService.logout();
  }

  get userAvatar(): string {
    const user = this.authService.currentUser();
    if (user?.avatar) return user.avatar;
    const name = encodeURIComponent(user?.name || 'User');
    return `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff&bold=true`;
  }
}
