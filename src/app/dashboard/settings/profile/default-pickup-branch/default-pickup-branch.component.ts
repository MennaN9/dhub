import { Component, OnInit, Input } from '@angular/core';
import { FacadeService } from '../../../../services/facade.service';
import { SnackBar } from '../../../../utilities';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-default-pickup-branch',
  templateUrl: './default-pickup-branch.component.html',
  styleUrls: ['./default-pickup-branch.component.scss']
})
export class DefaultPickupBranchComponent implements OnInit {
  selectedBranch: any;

  @Input() myBranch: number;
  @Input() isManager: boolean = false;

  branchs: any[];
  constructor(
    private snackBar: SnackBar,
    private facadeService: FacadeService,
    private translateService: TranslateService) {


  }


  ngOnInit() {
    this.listBranches();
  }


  onSubmit() {



    this.facadeService.adminService.changeDefaultBranch({ defaultBranchId: this.selectedBranch }).subscribe(res => {
      if (res.succeeded === true) {
        this.snackBar.openSnackBar({ message: this.translateService.instant('Successfully changed'), action: this.translateService.instant('okay'), duration: 2500 });
      }
    });
  }



  /**
   * all branches
   * 
   * 
   */
  listBranches() {
    this.facadeService.branchService.list().subscribe(branches => {

      this.branchs = branches;

      this.selectedBranch = this.branchs.find(x => x.id == this.myBranch).id;

    });
  }

}
