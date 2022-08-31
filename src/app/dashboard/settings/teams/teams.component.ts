import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManageTeamComponent } from './manage-team/manage-team.component';
import { FacadeService } from '@dms/services/facade.service';
import { Body, SnackBar } from '@dms/utilities/snakbar';
import { Location, Team } from '@dms/models/teams';
import { App } from '@dms/app/core/app';
import { Images } from '@dms/app/constants/images';
import { Router, ActivatedRoute } from '@angular/router';
import { Routes } from '@dms/app/constants/routes';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit, OnDestroy {

  readonly baseUrl = App.driverImagesUrl;
  readonly altImage = Images.user;

  name: string;
  dialogContent: Object;

  total: number = 0;
  pageNumber: number = 1;
  pageSize: number = 12;

  teams: Team[] = [];
  locations: Location[];
  selectedTeam: Team;
  loading: boolean = false;
  subscriptions = new Subscription();

  constructor(
    public dialog: MatDialog,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService) {
    this.dialogContent = {
      title: this.translateService.instant(`Are you sure you want to delete this team? You won't be able to restore the data`),
      message: "",
      openBtn: this.translateService.instant(`Delete`),
      cancelBtn: this.translateService.instant(`Cancel`),
      okayBtn: this.translateService.instant(`Confirm`),
    }

    this.subscriptions.add(this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.page) {
        this.pageNumber = params.page;
      }
    }));
  }

  ngOnInit() {
    this.getTeamsPaginated(this.pageNumber);
    this.getLocations();
  }


  /**
   * fetch all teams
   *
   *
   */
  getTeamsPaginated(pageNumber: number) {

    const body = {
      pageNumber: pageNumber,
      pageSize: this.pageSize,
    }

    this.router.navigate([Routes.teams], { queryParams: { page: this.pageNumber } });
    this.subscriptions.add(this.facadeService.teamsService.listByPagination(body).subscribe((teams: any) => {
      this.teams = teams.result;
      this.total = teams.totalCount;
    }));
  }

  /**
   * manage team (create / edit)
   *
   *
   * @param type
   */
  openTeamDialog(type: string): void {
    let data: any = {
      type: type,
      locations: this.locations,
    };

    if (type == 'edit') {
      data.team = this.selectedTeam;
    }

    const dialogRef = this.dialog.open(ManageTeamComponent, {
      width: '500px',
      minHeight: '300px',
      data: data,
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      // if (result && result.type == 'edit') {
      //   this.getTeamsPaginated(this.pageNumber);
      // } else if (result && result.data) {
      //   this.teams.push(result.data);
      // }
      this.getTeamsPaginated(this.pageNumber);
      this.getLocations();
    });
  }

  /**
   *
   * @param event
   */
  onConfirm(event: boolean): void {
    if (event) {

      this.facadeService.teamsService.delete(this.selectedTeam.id).subscribe(res => {
        const index = this.teams.indexOf(this.selectedTeam);
        if (index >= 0) {
          this.teams.splice(index, 1);
          const message: Body = {
            message: this.translateService.instant(`Team has been deleted successfully`),
            action: this.translateService.instant(`Okay`),
            duration: 2000
          }

          this.total--;

          if (this.teams.length == 0) {
            this.pageNumber = 1;
            this.pageSize = 12;

            this.replaceRoutePage(this.pageNumber);
            this.getTeamsPaginated(this.pageNumber);
          }

          this.snackBar.openSnackBar(message);
        }
      });
    }
  }

  /**
   *fetch all locations
   *
   *
   */
  getLocations() {
    this.subscriptions.add(this.facadeService.loactionAccuracyService.list().subscribe(res => {
      this.locations = res;
    }));
  }

  /**
   * when clicking menu icon set current row
   *
   *
   * @param team
   */
  setTSelectableTeam(team: Team) {
    this.selectedTeam = team;
  }

  /**
   * on change page or per page
   *
   *
   * @param event
   */
  onChangePage(event) {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getTeamsPaginated(this.pageNumber);
    this.replaceRoutePage(this.pageNumber);
  }

  private replaceRoutePage(page: number) {
    this.router.navigate([Routes.teams], { queryParams: { page: page } });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
