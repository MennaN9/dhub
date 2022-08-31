import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Routes } from './constants/routes';
import { FacadeService } from './services/facade.service';
import { NotificationMessage, SignalRNotificationService } from './services/state-management/signal-rnotification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  subscription = new Subscription();
  constructor(private router: Router,
    private signalRNotificationService: SignalRNotificationService,
    private facadeService: FacadeService) {
  }

  ngOnInit() {
    this.subscription.add(this.signalRNotificationService.subscribe(NotificationMessage.LogoutUser, () => {
      const userId: string = this.facadeService.accountService.user.id;

      this.facadeService.accountService.logoutSession(userId).subscribe(res => {
        this.facadeService.accountService.logout();
        this.router.navigate([Routes.Login]);
        window.location.reload();
      });
    }));
  }
}
