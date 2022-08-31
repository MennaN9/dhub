import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FacadeService } from '../../../../services/facade.service';
import { SnackBar } from '../../../../utilities';

@Component({
  selector: 'app-armada-braches',
  templateUrl: './armada-braches.component.html',
  styleUrls: ['./armada-braches.component.scss']
})
export class ArmadaBrachesComponent implements OnInit {

  selectedBranch: any;
  branchs: any[];
  armadaBranchApiKey: string;
  armadaBranchsApiKeys: any[]=[];
  displayedColumns: string[] = ['branchName', 'armadaBranchAPIKey','actions'];


  constructor(
    private snackBar: SnackBar,
    private facadeService: FacadeService,
    private translateService: TranslateService)  {

  }

  ngOnInit() {
    this.listBranches();

    this.listArmadaBranchesAPIKeys();
  }


  /**
 * all branches
 * 
 * 
 */
  listBranches() {
    this.facadeService.branchService.list().subscribe(branches => {
      this.branchs = branches;
    });
  }


  listArmadaBranchesAPIKeys() {
    this.facadeService.armadaBranchesService.list().subscribe(armadabranches => {
      this.armadaBranchsApiKeys = armadabranches;
    });
  }

  insertOrUpdate() {

    let body = {
      branchId: this.selectedBranch,
      ArmadaBranchAPIKey: this.armadaBranchApiKey
    }


    this.facadeService.armadaBranchesService.insertOrUpdate(body).subscribe(res => {
      if (res) {
        this.listArmadaBranchesAPIKeys();
        this.selectedBranch = 0;
        this.armadaBranchApiKey = '';
      }

    });
  }

  edit(element) {
    this.armadaBranchApiKey = element.armadaBranchAPIKey;
    this.selectedBranch = element.branchId;
  }

}
