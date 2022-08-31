
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SidebarService } from '@dms/app/services/state-management/sidebar.service';

interface NavItem {
  name: string;
  disabled?: boolean;
  icon: string;
  route?: string;
  permissions?: [];
  children?: NavItem[];
}

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuListItemComponent implements OnInit {

  expanded: boolean = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;

  activeRoute: string = '';

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
  ) {
  }

  ngOnInit() {
    this.activeRoute = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url == event.url) {
          this.activeRoute = event.url;
        }
      }
    });
  }

  /**
   * select item
   * 
   * 
   * @param item 
   */
  onItemSelected(item: NavItem) {
    if (item.children && item.children.length > 0) {
      this.expanded = !this.expanded;
    } else {
      this.router.navigate([item.route]);
      this.sidebarService.changeStatus(false);
    }
  }
}
