import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  public sidebarOpen = signal(false);

  public closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  public openSidebar(): void {
    this.sidebarOpen.set(true);
  }

  public toggleSidebar(): void {
    this.sidebarOpen.update(state => !state);
  }
}
