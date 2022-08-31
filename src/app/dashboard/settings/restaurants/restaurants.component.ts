import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator, PageEvent } from '@angular/material';
import { ManageRestaurantComponent } from './manage-restaurant/manage-restaurant.component';
import { Router } from '@angular/router';
import { Routes } from '@dms/app/constants/routes';
import { FacadeService } from '@dms/services/facade.service';
import { Restaurant } from '@dms/models/settings/restaurant';
import { Body, SnackBar } from '@dms/utilities/snakbar';
import { TranslateService } from '@ngx-translate/core';
import { BlockRestaurantComponent } from './block-restaurant/block-restaurant.component';

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss']
})

export class RestaurantsComponent implements OnInit {
  readonly dialogContent = {
    title: this.translateService.instant(`Are you sure you want to delete this restaurant ? You won't be able to restore the data.`),
    openBtn: this.translateService.instant(`Delete`),
    cancelBtn: this.translateService.instant(`Cancel`),
    okayBtn: this.translateService.instant(`Confirm`),
  }

  readonly dialogUnblockContent = {
    title: this.translateService.instant(`Are you sure you want to Unblock this restaurant?`),
    openBtn: this.translateService.instant(`Unblock`),
    cancelBtn: this.translateService.instant(`Cancel`),
    okayBtn: this.translateService.instant(`Yes`),
  }

  readonly displayedColumns: string[] = ['id', 'name', 'status', 'actions'];

  dataSource = new MatTableDataSource([]);
  selectedRestaurant: Restaurant;
  restaurants: Restaurant[];

  pageIndex: number = 1;
  pageSize: number = 10;
  length: number;
  totalCount: number;
  loading: boolean;
  pageSizeOptions: number[] = [5, 10, 25, 100];


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dialog: MatDialog,
    private facadeService: FacadeService,
    private translateService: TranslateService,
    private router: Router,
    private snackBar: SnackBar) { }

  ngOnInit() {
    this.getRestaurants();
  }

  /**
   * manage restaurant (create / edit)
   *
   *
   * @param type
   */
  openManageRestaurantDialog(type: string): void {

    const dialogRef = this.dialog.open(ManageRestaurantComponent, {
      width: '500px',
      minHeight: '200px',
      data: {
        restaurant: this.selectedRestaurant,
        type: type,
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getRestaurants()
      }
    });
  }

  /**
   * delete restaurant
   *
   *
   * @param event
   */
  onConfirm(event) {
    if (event) {
      this.facadeService.restaurantService.delete(this.selectedRestaurant.id).subscribe(deleteResult => {
        this.getRestaurants();
      })
    }
  }

  /**
   * block restuarant
   *
   *
   */
  blockRestuarant(): void {
    const dialogRef = this.dialog.open(BlockRestaurantComponent, {
      width: 'auto',
      height: 'auto',
      data: {
        restaurantId: this.selectedRestaurant.id
      },
      panelClass: "custom-dialog"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getRestaurants();
    });
  }

  /**
  * unblock restaurant
  *
  *
  * @param event
  */
  onUnBlock(event) {
    if (event) {
      let body = {
        id: this.selectedRestaurant.id,
        isActive: true

      }
      this.facadeService.restaurantService.block(body).subscribe(blockResult => {
        this.getRestaurants();
        const message: Body = {
          message: this.translateService.instant(`Success restaurant has been UnBlocked !`),
          action: this.translateService.instant(`Okay`),
          duration: 2000
        }
        this.snackBar.openSnackBar(message);
      })
    }
  }

  /**
   * select restaurant
   *
   *
   * @param restaurant
   */
  setTSelectablRestaurant(restaurant: Restaurant) {
    this.selectedRestaurant = restaurant;
  }

  /**
   * branches list related to restaurant
   *
   *
   * @param restaurant
   */
  navigateToBranches(restaurant: Restaurant) {
    this.router.navigate([Routes.restaurants, restaurant.id, 'branches']);
  }

  /**
   * get all restaurants
   * 
   * 
   */
  getRestaurants() {
    const body = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize
    }

    this.facadeService.restaurantService.listByPagination(body).subscribe((result: any) => {
      this.restaurants = result.result;

      this.restaurants.forEach(res => {
        res['status'] = res.isActive ? this.translateService.instant('active') : this.translateService.instant('blocked');
      });

      this.dataSource = new MatTableDataSource(result.result);
      this.dataSource.paginator = this.paginator;
      this.length = this.totalCount = result.totalCount;
    })
  }

  /**
  * get next page of restaurants
  *
  *
  * @param event
  */
  public getServerData(event?: PageEvent) {

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.length = event.length;

    const body = {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize
    }
    this.facadeService.restaurantService.listByPagination(body)
      .subscribe((result: any) => {
        this.restaurants = result.result;
        this.dataSource = new MatTableDataSource(result.result);
        this.dataSource.paginator = this.paginator;
        this.length = this.totalCount = result.totalCount;
      });

    return event;
  }

}
