import { Customer } from '@dms/app/models/settings/customer';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { compare } from '@dms/app/utilities/compare';
import { SelectionModel } from '@angular/cdk/collections';
import { FacadeService } from '@dms/app/services/facade.service';
import { Body, SnackBar } from '@dms/utilities/snakbar';
import { Country } from '@dms/app/models/settings/Country';
import { ManageCustomerComponent } from './manage-customer/manage-customer.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ImportCustomersComponent } from './import-customers/import-customers.component';
import { saveFile } from '@dms/app/utilities/generate-download-file';

interface Column {
  key: string;
  value: string;
}

@Component({
  selector: 'appcustomers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  name: string;

  pageIndex: number = 1;
  pageSize: number = 10;
  length: number;
  totalCount: number;
  searchMode: boolean = false;
  customers: Customer[] = [];
  countries: Country[] = [];

  dataSource;
  sortedData: Customer[];

  selectedCustomer: Customer;
  keywords: string = '';
  public readonly displayedFilterColumns: Column[] = [
    {
      key: 'select',
      value: this.translateService.instant('Select'),
    },
    {
      key: 'id',
      value: this.translateService.instant('ID'),
    },
    {
      key: 'name',
      value: this.translateService.instant('Name'),
    },
    {
      key: 'email',
      value: this.translateService.instant('Email'),
    },
    {
      key: 'cid',
      value: this.translateService.instant('CID'),
    },
    {
      key: 'phone',
      value: this.translateService.instant('Phone'),
    },
    {
      key: 'address',
      value: this.translateService.instant('Address'),
    }
    ,
    {
      key: 'actions',
      value: this.translateService.instant('Actions'),
    }
  ];

  public readonly displayedColumns: string[] = this.displayedFilterColumns.map(x => x.key);

  public selectedColumns: string[] = this.displayedColumns;

  public readonly dialogContent = {
    title: this.translateService.instant(`Are you sure you want to delete this customer? You won't be able to restore the data.`),
    openBtn: this.translateService.instant("Delete"),
    cancelBtn: this.translateService.instant("Cancel"),
    okayBtn: this.translateService.instant("Confirm"),
  }

  public readonly bulkDeleteContent = {
    title: this.translateService.instant(`Are you sure you want to delete this customer(s)? You won't be able to restore the data.`),
    openBtn: this.translateService.instant(`Bulk delete`),
    cancelBtn: this.translateService.instant("Cancel"),
    okayBtn: this.translateService.instant("Confirm"),
  }

  selection = new SelectionModel<Customer>(true, []);

  /**
   *
   * @param dialog
   * @param facadeService
   * @param snackBar
   */
  constructor(
    public dialog: MatDialog,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    @Inject(LOCALE_ID) locale: string,
  ) {
    
  }

  ngOnInit() {
    // get previous page if exists
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params.page) {
        this.pageIndex = params.page;
      }

      this.getCustomers();
    });
  }

  /**
   * fetch all customers
   *
   *
   */
  getCustomers() {
    const body = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      SearchBy: this.keywords,
    }

    //this.router.navigate([MenuRoutes.customers], { queryParams: { page: this.pageIndex } });
    this.facadeService.customerService.listByPagination(body).subscribe((result: any) => {
      this.sortedData = this.customers = result.result;
      this.length = this.totalCount = result.totalCount;
      this.dataSource = new MatTableDataSource(this.customers);
    });
  }

  /**
  * @todo seach In Customers
  *
  *
  */
  seachInCustomers() {
    this.searchMode = true;
    this.pageIndex = 1;

    this.getCustomers();
  }

  /**
   * manage customer dialog create / edit
   *
   *
   * @param operation
   */
  manageCustomerDialog(operation: string): void {
    const dialogRef = this.dialog.open(ManageCustomerComponent, {
      width: '75%',
      height: '95%',
      maxHeight: '100%',
      autoFocus: false,
      data: {
        type: operation,
        customer: this.selectedCustomer
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCustomers();
      } else {
        dialogRef.close();
      }
    });
  }

  /**
   * confirm customer deletion
   *
   *
   * @param event
   */
  onConfirm(event) {
    if (event) {
      this.facadeService.customerService.delete(this.selectedCustomer.id).subscribe(result => {

        const index = this.sortedData.indexOf(this.selectedCustomer);
        if (index >= 0) {
          this.sortedData.splice(index, 1);

          const message: Body = {
            message: this.translateService.instant(`Success customer has been deleted !`),
            action: this.translateService.instant(`Okay`),
            duration: 2000
          }
          this.snackBar.openSnackBar(message);

          this.getCustomers();
        }
      })
    }
  }

  /**
   * current selected customer
   *
   *
   * @param customer
   */
  setTSelectableCustomer(customer: Customer) {
    this.selectedCustomer = customer;
  }

  /**
   * filter customers
   *
   *
   * @param event
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.sortedData = this.dataSource.data;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   *
   *
   */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /**
   * sort by column
   *
   *
   * @param sort
   */
  sortData(sort: Sort) {
    const data = this.customers.slice();

    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'email': return compare(a.email, b.email, isAsc);
        case 'phone': return compare(a.phone, b.phone, isAsc);
        case 'tags': return compare(a.tags, b.tags, isAsc);
        case 'address': return compare(a.address, b.address, isAsc);
        default: return 0;
      }
    });
  }

  /**
   * check if all row selected rows
   *
   *
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * select all rows
   *
   *
   */
  selectAll() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /**
   * select row
   *
   *
   * @param row
   */
  onSelectRow(row?: Customer): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }

  /**
   * delete bulk customers
   *
   *
   * @param event
   */
  onConfirmBulkDelete(event) {
    if (event) {
      this.facadeService.customerService.bulkDelete(this.selection.selected).subscribe(result => {

        const message: Body = {
          message: this.translateService.instant(`Success customers has been deleted !`),
          action: this.translateService.instant(`Okay`),
          duration: 2000
        }
        this.snackBar.openSnackBar(message);

        this.getCustomers();
      });
    }
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

    this.getCustomers()
  }

  Clear() {
    this.keywords = '';
    this.pageIndex = 1;
    this.getCustomers();
  }

  /**
   * importDriver From Excel
   *
   *
   */
  importCustomers() {
    const dialogRef = this.dialog.open(ImportCustomersComponent, {
      width: '40%',
      panelClass: 'custom-dialog'
    });

    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(x => {
      this.getCustomers();
    });
  }

  /**
   * Export customers
   *
   *
   */
  exportCustomers() {
    const body = {
      pageNumber: this.pageIndex,
      pageSize: this.pageSize,
      SearchBy: this.keywords,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }


    this.facadeService.customerService.exportToExcel(body).subscribe(data => {
      saveFile("Customers.csv", "data:attachment/text", data);
    });
  }
}


