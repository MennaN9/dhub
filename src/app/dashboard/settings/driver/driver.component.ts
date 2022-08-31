import { Component, AfterViewInit, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ManageDriverComponent } from "./manage-driver/manage-driver.component";
import { MatTableDataSource } from "@angular/material/table";
import { Sort, MatSort } from "@angular/material/sort";
import { FacadeService } from "@dms/app/services/facade.service";
import { Body, SnackBar } from "@dms/utilities/snakbar";
import { Driver } from "@dms/app/models/settings/Driver";
import { App } from "@dms/app/core/app";
import { AgentType } from "@dms/app/models/settings/AgentType";
import {
  MatSelectionList,
  MatSelectionListChange,
  MatPaginator,
} from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { compare } from "@dms/utilities/compare";
import { ChangeDriverTypeComponent } from "./change-driver-type/change-driver-type.component";
import { ImportDriverComponent } from "./import-driver/import-driver.component";
import { saveFile } from "@dms/app/utilities/generate-download-file";
import { TranslateService } from "@ngx-translate/core";

interface Column {
  key: string;
  value: string;
}

@Component({
  selector: "app-Driver",
  templateUrl: "./driver.component.html",
  styleUrls: ["./driver.component.scss"],
})
export class DriverComponent implements OnInit, AfterViewInit {
  readonly agentStatus: any[] = [
    { name: "Offline", value: "Offline" },
    { name: "Available", value: "Available" },
    { name: "Unavailable", value: "Unavailable" },
    { name: "Busy", value: "Busy" },
    { name: "Blocked", value: "Blocked" },
  ];

  searchMode: boolean = false;

  readonly dialogContentBulkBlock = {
    title: this.translateService.instant(`Are you sure to Block driver(s)?`),
    openBtn: this.translateService.instant(`Block`),
    cancelBtn: this.translateService.instant(`Cancel`),
    okayBtn: this.translateService.instant(`Confirm`)
  }

  readonly dialogContentBulkUnBlock = {
    title: this.translateService.instant(`Are you sure to Unblock driver(s)?`),
    openBtn: this.translateService.instant(`Unblock`),
    cancelBtn: this.translateService.instant(`Cancel`),
    okayBtn: this.translateService.instant(`Confirm`)
  }

  readonly dialogContent = {
    title: this.translateService.instant(`Are you sure you want to delete this driver ? You won't be able to restore the data`),
    openBtn: this.translateService.instant(`Delete`),
    cancelBtn: this.translateService.instant(`Cancel`),
    okayBtn: this.translateService.instant(`Confirm`)
  }

  readonly unblockContent = {
    title: this.translateService.instant(`Are you sure to Unblock this driver(s)?`),
    openBtn: this.translateService.instant(`Unblock`),
    cancelBtn: this.translateService.instant(`Cancel`),
    okayBtn: this.translateService.instant(`Confirm`)
  }

  readonly blockContent = {
    title: this.translateService.instant(`Are you sure to Block driver(s)?`),
    openBtn: this.translateService.instant(`Block`),
    cancelBtn: this.translateService.instant(`Cancel`),
    okayBtn: this.translateService.instant(`Confirm`)
  }

  readonly dialogContentBulkDelete = {
    title: this.translateService.instant(`Are you sure you want to delete this driver(s) ? You won't be able to restore the data.`),
    openBtn: this.translateService.instant(`Delete`),
    cancelBtn: this.translateService.instant(`Cancel`),
    okayBtn: this.translateService.instant(`Confirm`)
  }

  name: string;
  drivers: Driver[] = [];
  agentTypes: AgentType[] = [];
  statusList: any[] = [];

  selectedDriver: Driver;
  ImageURL = App.driverImagesUrl;
  keywords: string = "";
  selecteddriverType: string = "0";
  selectedstatusType: number = 0;

  displayedFilterColumns: Column[] = [
    {
      key: 'select',
      value: this.translateService.instant('Select')
    },
    {
      key: 'imageUrl',
      value: this.translateService.instant('Image')
    },
    {
      key: 'username',
      value: this.translateService.instant('USERNAME')
    },
    {
      key: 'fullName',
      value: this.translateService.instant('Full Name')
    },
    {
      key: 'email',
      value: this.translateService.instant('EMAIL')
    },
    {
      key: 'phoneNumber',
      value: this.translateService.instant('PHONE')
    },
    {
      key: 'deviceType',
      value: this.translateService.instant('DEVICE TYPE')
    },
    {
      key: 'deviceVersion',
      value: this.translateService.instant('DEVICE VERSION')
    },
    {
      key: 'teamName',
      value: this.translateService.instant('TEAM')
    },
    {
      key: 'tags',
      value: this.translateService.instant('TAGS')
    },
    {
      key: 'rating',
      value: this.translateService.instant('RATING')
    },
    {
      key: 'status',
      value: this.translateService.instant('STATUS')
    },
    {
      key: 'actions',
      value: this.translateService.instant('ACTIONS')
    },
  ];

  displayedColumns: string[] = this.displayedFilterColumns.map(x => x.key);


  dataSource: MatTableDataSource<Driver> = new MatTableDataSource([]);
  sortedData: Driver[];

  @ViewChild("filterColumns", { static: true }) filterColumns: MatSelectionList;
  columsToDisply: string[] = this.displayedColumns;
  selection = new SelectionModel<Driver>(true, []);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  pageIndex: number = 1;
  pageSize: number = 10;
  length: number;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  selectedRows: Driver[];
  isBlockedBefore: boolean = false;

  /**
   *
   * @param dialog
   * @param facadeService
   * @param snackBar
   */
  constructor(
    public dialog: MatDialog,
    private facadeService: FacadeService,
    private translateService: TranslateService,
    private snackBar: SnackBar,
  ) {

  }

  ngOnInit() {
    this.selection.changed.subscribe((t) => {
      this.selectedRows = this.selection.selected;
    });

    this.getDrivers();
    this.getAgentType();
    this.getStatus();

    this.filterColumns.writeValue(this.displayedColumns);
    this.filterColumns.selectionChange.subscribe(
      (v: MatSelectionListChange) => {
        this.columsToDisply = this.filterColumns._value;
      }
    );
  }

  ngAfterViewInit() {

  }

  /**
   * Block Driver
   *
   *
   * @param event
   */
  onBlock(event) {
    if (event) {
      let drivers: number[] = [];
      drivers.push(this.selectedDriver.id);
      const body = { driverIds: drivers, reason: "" };
      this.facadeService.driverService.bullkBlock(body).subscribe((t) => {
        this.getDrivers();
        const message: Body = {
          message: this.translateService.instant(`Success driver has been Blocked !`),
          action: this.translateService.instant(`Okay`),
          duration: 2000
        }
        this.snackBar.openSnackBar(message);
      });
    }
  }

  /**
   * Un Block Driver
   *
   *
   * @param event
   */
  onUnBlock(event) {
    if (event) {
      let drivers: number[] = [];
      drivers.push(this.selectedDriver.id);
      this.facadeService.driverService
        .UnbullkBlock({ driverIds: drivers, reason: "" })
        .subscribe((t) => {
          this.getDrivers();
          const message: Body = {
            message: this.translateService.instant("Success driver has been UnBlock !"),
            action: this.translateService.instant("Okay"),
            duration: 2000,
          };
          this.snackBar.openSnackBar(message);
        });
    }
  }

  /**
   * refersh data soruce
   *
   *
   * @param data
   */
  refreshDataSource(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * fetch all Drivers
   *
   *
   */
  getDrivers() {
    const body = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
    };

    this.facadeService.driverService
      .listByPagination(body)
      .subscribe((result: any) => {
        this.drivers = this.sortedData = result.result;
        this.refreshDataSource(result.result);
        this.length = result.totalCount;
      });
  }
  /**
   * on change page or per page
   *
   *
   * @param event
   */
  onChangePage(event) {
    this.pageIndex = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.seachInDrivers();
  }

  /**
   * manage driver (create / edit)
   *
   *
   *@param operation
   */
  manageDriverDialog(operation: string): void {
    const dialogRef = this.dialog.open(ManageDriverComponent, {
      width: "1200px",
      autoFocus: false,
      maxHeight: "95vh",
      data: {
        operation: operation,
        driver: this.selectedDriver,
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //refresh driver list
        this.getDrivers();
      } else {
        dialogRef.close();
      }
    });
  }

  /**
   * confirm driver deletion
   *
   *
   * @param event
   */
  onConfirm(event) {
    if (event) {
      this.facadeService.driverService
        .delete(this.selectedDriver.id)
        .subscribe((res) => {
          const index = this.sortedData.indexOf(this.selectedDriver);
          if (index >= 0) {
            this.sortedData.splice(index, 1);

            const message: Body = {
              message: this.translateService.instant(`Driver has been deleted successfully`),
              action: this.translateService.instant("Okay"),
              duration: 2000,
            };
            this.snackBar.openSnackBar(message);
          }

          this.getDrivers();
        });
    }
  }

  /**
   * confirm driver/s deletion
   *
   *
   * @param event
   */
  onConfirmBulkDelete(event) {
    if (event) {
      this.facadeService.driverService
        .bullkDelete(this.selection.selected)
        .subscribe((res) => {
          const index = this.sortedData.indexOf(this.selectedDriver);
          if (index >= 0) {
            this.sortedData.splice(index, 1);

            const message: Body = {
              message: this.translateService.instant("Driver(s) has been blocked successfully"),
              action: this.translateService.instant("Okay"),
              duration: 2000,
            };
            this.snackBar.openSnackBar(message);
          }
          this.getDrivers();
          this.selection.clear();
        });
    }
  }

  /**
   * confirm driver/s block
   *
   *
   * @param event
   */
  onConfirmBulkBlock(event) {
    if (event) {
      const selections = this.selection.selected.map((t) => t.id);
      const body = {
        driverIds: selections,
        isBlock: true,
      };

      this.facadeService.driverService.bullkBlock(body).subscribe((res) => {
        const index = this.sortedData.indexOf(this.selectedDriver);
        if (index >= 0) {
          this.sortedData.splice(index, 1);

          const message: Body = {
            message: this.translateService.instant("Driver(s) has been blocked successfully"),
            action: this.translateService.instant("Okay"),
            duration: 2000,
          };
          this.snackBar.openSnackBar(message);
        }
        this.getDrivers();
        this.selection.clear();
      });
    }
  }

  /**
   * bulk un block
   *
   *
   * @param event
   */
  onConfirmBulkUnBlock(event) {
    if (event) {
      const selections = this.selection.selected.map((t) => t.id);
      const body = {
        driverIds: selections,
        isBlock: false,
      };

      this.facadeService.driverService.UnbullkBlock(body).subscribe((res) => {
        const index = this.sortedData.indexOf(this.selectedDriver);
        if (index >= 0) {
          this.sortedData.splice(index, 1);

          const message: Body = {
            message: this.translateService.instant("Driver(s) has been unblocked successfully"),
            action: this.translateService.instant("Okay"),
            duration: 2000,
          };
          this.snackBar.openSnackBar(message);
        }

        this.getDrivers();
        this.selection.clear();
      });
    }
  }

  /**
   * current selected driver
   *
   *
   * @param driver
   */
  setTSelectableDriver(driver: Driver) {
    this.selectedDriver = driver;

    if (this.selectedDriver.agentStatusName === "Blocked") {
      this.isBlockedBefore = true;
    } else if (this.selectedDriver.agentStatusName === "Offline") {
      this.isBlockedBefore = false;
    }
  }

  /**
   * sort by column
   *
   *
   * @param sort
   */
  sortData(sort: Sort) {
    const data = this.drivers.slice();
    if (!sort.active || sort.direction === "") {
      this.sortedData = data;
      this.refreshDataSource(data);
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "id":
          return compare(a.id, b.id, isAsc);
        case "username":
          return compare(a.username, b.username, isAsc);
        case "firstName":
          return compare(a.firstName, b.firstName, isAsc);
        case "email":
          return compare(a.email, b.email, isAsc);
        case "phoneNumber":
          return compare(a.phoneNumber, b.phoneNumber, isAsc);
        case "teamName":
          return compare(a.teamName, b.teamName, isAsc);
        case "tags":
          return compare(a.tags, b.tags, isAsc);
        default:
          return 0;
      }
    });

    this.refreshDataSource(this.sortedData);
  }

  /**
   * all agentType
   *
   */
  getAgentType() {
    this.facadeService.agentTypeService.list().subscribe((result: AgentType[]) => {
      this.agentTypes = result;
    });
  }

  /**
   * all status
   *
   */
  getStatus() {
    this.facadeService.taskStatusService
      .list()
      .subscribe((result: AgentType[]) => {
        this.statusList = result;
      });
  }

  /**
   * combine phone number
   *
   *
   * @param element
   */
  processPhone(element: Driver) {
    if (element.phoneNumber.startsWith("0")) {
      let phone = element.phoneNumber.substr(1);
      return `+${element.countryCode}${phone}`;
    } else if (element.phoneNumber.startsWith("+")) {
      return element.phoneNumber;
    } else {
      return `+${element.countryCode}${element.phoneNumber}`;
    }
  }

  /**
   * Whether the number of selected elements matches the total number of rows.
   *
   *
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   *
   *
   */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /**
   * The label for the checkbox on the passed row
   *
   *
   * @param row
   */
  checkboxLabel(row?: Driver): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.id + 1
      }`;
  }

  /**
   * change driver type dialog
   *
   *
   */
  openBulkDriversTypeDialog(): void {
    const dialogRef = this.dialog.open(ChangeDriverTypeComponent, {
      data: { driverIds: this.selection.selected.map((t) => t.id) },
      panelClass: 'custom-dialog'
    });

    //dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDrivers();
        this.masterToggle();

        this.snackBar.openSnackBar({
          message: this.translateService.instant("Success status has been changed"),
          action: this.translateService.instant("OKay"),
          duration: 2500,
        });
      } else {
        dialogRef.close();
      }
    });
  }

  /**
   * Search in drivers
   *
   *
   * @param flag
   * @param value
   */
  seachInDrivers() {
    this.searchMode = true;
    this.pageIndex = 1;

    if (!this.keywords && this.selecteddriverType == "0" && this.selectedstatusType == 0) {
      this.getDrivers();
      return;
    }

    let driverTypeValue = 0;
    if (this.selecteddriverType != "" && this.selecteddriverType != "0")
      driverTypeValue = this.agentTypes.find(
        (p) => p.name == this.selecteddriverType
      ).id;

    const body = {
      PageNumber: this.pageIndex,
      PageSize: this.pageSize,
      SearchBy: this.keywords,
      driverType: driverTypeValue,
      statusType: this.selectedstatusType,
    };

    // if (flag == 1) {
    //   body.SearchBy = value;
    // }

    this.facadeService.driverService.listByPagination(body).subscribe((resultDriver: any) => {
      this.drivers = this.sortedData = resultDriver.result;
      this.refreshDataSource(resultDriver.result);
      this.length = resultDriver.totalCount;
    });
  }

  /**
   * importDriver From Excel
   *
   *
   */
  importDriver() {
    const dialogRef = this.dialog.open(ImportDriverComponent, {
      width: "50%",
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(x => {
      this.getDrivers();
    });
  }

  /**
   * exportDriver to excel
   *
   *
   */
  exportDriver() {
    this.searchMode = true;
    this.pageIndex = 1;

    let driverTypeValue = 0;
    if (this.selecteddriverType != "" && this.selecteddriverType != "0")
      driverTypeValue = this.agentTypes.find(
        (p) => p.name == this.selecteddriverType
      ).id;

    const body = {
      PageNumber: this.pageIndex,
      PageSize: this.pageSize,
      SearchBy: this.keywords,
      driverType: driverTypeValue,
      statusType: this.selectedstatusType,
    };

    this.facadeService.driverService.exportToExcel(body).subscribe((data) => {
      saveFile("Drivers.csv", "data:attachment/text", data);
    });
  }
}
