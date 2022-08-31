import { SnackBar } from './../../utilities/snakbar';
import { filter, tap } from 'rxjs/operators';
import { Inject, Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as signalR from '@microsoft/signalr';
import { App } from '../../core/app';
import { TokenResponse } from '../../models/account/accountResult';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticatedService } from './authenticated.service';
import { MapMarkersService } from './map-markers.service';
import { RefreshNotificationCountService } from './refresh-notification-count.service';

@Injectable({
  providedIn: 'root'
})
export class SignalRNotificationService {
  private explicitDisconnect = false;
  private internalSubscription: Subscription;
  private internalNotifications = new Subject<{ notificationMessage: NotificationMessage, parameters: any[] }>();
  private connection: signalR.HubConnection;
  // TODO: to be removed this is not responsibility of the signalr => notifications service should handle
  private refreshNotificationsCount = new BehaviorSubject<boolean>(false);

  public refreshCount = this.refreshNotificationsCount.asObservable();

  public notifications = this.internalNotifications.asObservable();
  /**
   * 
   * @param toastr 
   * @param loaderService 
   */
  private get toastr(): ToastrService {
    return this.injector.get(ToastrService);
  }

  constructor(
    @Inject(Injector) private injector: Injector,
    private translateService: TranslateService,
    private authenticatedService: AuthenticatedService,
    private snackBar: SnackBar,
    private mapMarkersService: MapMarkersService,
    private refreshNotificationCountService: RefreshNotificationCountService
  ) {
  }

  /**
   * change status (open / close)
   * 
   * 
   * @param value 
   */
  resetNotificationsCount(value: boolean) {
    this.refreshNotificationsCount.next(value)
  }

  subscribe(message: NotificationMessage, method: (...args: any[]) => void): Subscription {
    return this.subscribeMultiple([message], method);
  }

  subscribeMultiple(notificationMessages: NotificationMessage[], method: (...args: any[]) => void): Subscription {
    return this.notifications
      .pipe(
        filter(notification => notificationMessages.includes(notification.notificationMessage)),
        tap(notification => method(...notification.parameters))
      )
      .subscribe();
  }
  /**
   * Initialize connection with SignalR
   * 
   * 
   */
  initialize() {
    const url = `${App.backEndUrl}/notificationHub`;

    this.connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(url, { accessTokenFactory: () => (JSON.parse(localStorage.getItem('dms.token')) as TokenResponse).accessToken })
      .build();
    this.connection.onclose(error => {
      console.log({ message: 'SignalR Disconnect', error });
      if (!this.explicitDisconnect) {
        this.notifyConnectionLost();
        this.connect().then(() => this.notifyConnectionRestablished());
      }
    });
    this.authenticatedService.currentStatus.subscribe(state => {
      if (!state) {
        this.disconnect();
      } else {
        this.connect();
      }
    });
  }

  private notifyConnectionLost() {
    this.snackBar.openSnackBar(
      {
        message: this.translateService.instant('Notification Connection lost, reconnecting ...'),
        action: this.translateService.instant('Okay'),
        duration: 5000
      });
    this.connect().then(() => this.notifyConnectionRestablished());
  }

  private notifyConnectionRestablished() {
    this.snackBar.openSnackBar(
      {
        message: this.translateService.instant('Notification Connection re-established successfully.'),
        action: this.translateService.instant('Okay'),
        duration: 5000
      });
  }

  private async connect() {
    this.explicitDisconnect = false;
    try {
      await this.connection.start();
      this.registerTaskListners();
      console.log('SignalR Connected');
    } catch (exception) {
      console.log(exception);
      setTimeout(this.connect, 5000);
    }
  }

  private disconnect() {
    this.explicitDisconnect = true;
    return this.connection.stop();
  }

  private registerTaskListners() {
    // get all messages
    const allNotificationMessages: NotificationMessage[] = Object.keys(NotificationMessage)
      .map(key => <NotificationMessage>key);

    allNotificationMessages.forEach(notificationMessage => {
      const messageString = NotificationMessage[notificationMessage].toString();
      // remove all handles to that message
      this.connection.off(messageString);
      // add single handle for message that will update our observable
      this.connection.on(messageString, (...parameters: any[]) => this.internalNotifications.next({ notificationMessage, parameters }));
    });

    if (this.internalSubscription) {
      this.internalSubscription.unsubscribe();
    }
    this.internalSubscription = new Subscription();

    this.internalSubscribe(NotificationMessage.TaskSuccessful, (payload) => {
      this.toastr.info(
        this.translateService.instant('Successful Task!'),
        this.translateService.instant('Task  Number ') + payload.taskId + this.translateService.instant('has been sucsessfully'));

      this.refreshNotificationCountService.changeCount(true);
    });

    this.internalSubscribe(NotificationMessage.TaskFailed, (payload) => {
      this.toastr.error(
        this.translateService.instant('Faild Task!'),
        this.translateService.instant('Task  Number ') + payload.taskId + this.translateService.instant('has been faild because') + payload.reason);

      this.refreshNotificationCountService.changeCount(true);
    });

    this.internalSubscribe(NotificationMessage.TaskCancel, (payload) => {
      this.toastr.warning(
        this.translateService.instant('Task Canceled!'),
        this.translateService.instant('Task  Number ') + payload.taskId + this.translateService.instant('has been cancel because') + payload.reason);

      this.refreshNotificationCountService.changeCount(true);
    });

    this.internalSubscribe(NotificationMessage.TaskStart, (payload) => {
      this.toastr.info(
        this.translateService.instant('Started Task!'),
        this.translateService.instant('Task  Number ') + payload.id + this.translateService.instant('has been Started'));

      this.refreshNotificationCountService.changeCount(true);
    });

    this.internalSubscribe(NotificationMessage.TaskDecline, (id) => {
      this.toastr.warning(
        this.translateService.instant('Task Declined'),
        this.translateService.instant('Task  Number ') + id + this.translateService.instant('has been Declined'));

      this.refreshNotificationCountService.changeCount(true);
    });

    this.internalSubscribe(NotificationMessage.TaskAccept, (payload, taskId) => {
      this.toastr.info(
        this.translateService.instant('Task Accepted'),
        this.translateService.instant('Task  Number ') + taskId + this.translateService.instant('has been Accepted'));

      this.refreshNotificationCountService.changeCount(true);
    });

    this.internalSubscribe(NotificationMessage.LoginRequest, (driverName) => {
      this.toastr.info(
        this.translateService.instant('Driver') + driverName + this.translateService.instant('has request for login .'),
        this.translateService.instant('Login Request!'));

      this.refreshNotificationCountService.changeCount(true);
    });

    this.internalSubscribe(NotificationMessage.CancelLoginRequest, (driverName) => {
      this.toastr.info(
        this.translateService.instant('Driver') + driverName + this.translateService.instant('has canceled his  request for login .'),
        this.translateService.instant('Cancel Login Request!'));

      this.refreshNotificationCountService.changeCount(true);
    });


    this.internalSubscribe(NotificationMessage.AutoAllocationStarted, (mainTaskId) => {
      console.log('AutoAllocationStarted');

      this.toastr.info(
        this.translateService.instant('The system  has start auto assignment for new tasks.'),
        this.translateService.instant('Auto Allocation Started'));

      this.refreshNotificationCountService.changeCount(true);
    });

    this.internalSubscribe(NotificationMessage.AutoAllocationSucessfully, (mainTaskId) => {
      console.log('AutoAllocationSucessfully');

      this.toastr.info(
        this.translateService.instant('Auto allocation process has been Assigned.'),
        this.translateService.instant('Auto Allocation Assigned  Sucessfully'));

      this.refreshNotificationCountService.changeCount(true);
    });

    this.internalSubscribe(NotificationMessage.AutoAllocationFailed, (mainTaskId) => {
      console.log('AutoAllocationFailed');

      this.toastr.error(
        this.translateService.instant('Auto allocation process has been failed, please to assign it mananualy.'),
        this.translateService.instant('Auto Allocation Failed!'));

      this.refreshNotificationCountService.changeCount(true);
    });

    this.internalSubscribe(NotificationMessage.LocationChanged, (driverId, lng, lat) => {
      this.mapMarkersService.onDriverLocationChanged(driverId, lng, lat)
    });

    this.internalSubscribe(NotificationMessage.DriverLoggedin, (driver) => {
      this.toastr.info(
        driver.fullName + this.translateService.instant('has logged in sucsessfully to the system now .'),
        this.translateService.instant('Driver Logged In !'));

      this.refreshNotificationCountService.changeCount(true);
    });

    this.internalSubscribe(NotificationMessage.DriverLoggedOut, (driver) => {
      this.toastr.warning(
        driver.fullName + this.translateService.instant('has logged out  from the system now .',
          this.translateService.instant('Driver Logged Out !')
        ));

      this.refreshNotificationCountService.changeCount(true);
    });
  }

  private internalSubscribe(notificationMessage: NotificationMessage, method: (...args: any[]) => void) {
    const subscription = this.subscribe(notificationMessage, method);
    this.internalSubscription.add(subscription);
  }
}

export enum NotificationMessage {
  TaskSuccessful = 'TaskSuccessful',
  TaskFailed = 'TaskFailed',
  TaskCancel = 'TaskCancel',
  TaskStart = 'TaskStart',
  TaskDecline = 'TaskDecline',
  TaskAccept = 'TaskAccept',
  LoginRequest = 'LoginRequest',
  CancelLoginRequest = 'CancelLoginRequest',
  AutoAllocationStarted = 'AutoAllocationStarted',
  AutoAllocationSucessfully = 'AutoAllocationSucessfully',
  AutoAllocationFailed = 'AutoAllocationFailed',
  LocationChanged = 'LocationChanged',
  DriverLoggedin = 'DriverLoggedin',
  DriverLoggedOut = 'DriverLoggedOut',
  SetDuty = 'SetDuty',
  LogoutUser = 'LogoutUser',
}

