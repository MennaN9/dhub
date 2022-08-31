import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacadeService } from '../../../../services/facade.service';
import { Country } from '../../../../models/settings/Country';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { TranslateService } from '@ngx-translate/core';
import { SnackBar, Body } from '@dms/app/utilities';

export interface Code {
  name: string;
  code: string;
}

@Component({
  selector: 'app-manage-manager',
  templateUrl: './manage-manager.component.html',
  styleUrls: ['./manage-manager.component.scss'],
})
export class ManageManagerComponent implements OnInit {
  private static phoneNumberUtil = PhoneNumberUtil.getInstance();
  isSubmitted: boolean = false;
  form: FormGroup;
  manager: any;

  roles: string[] = [];
  teams: any[] = [];

  type: string = 'password';
  panelOpenState = false;
  phone: string;
  codes: Code[] = [];

  actionLabel: string = this.translateService.instant('Create');
  titleLabel: string = this.translateService.instant('Add');

  isEditMode: boolean = false;
  previousCountryId: number;
  numberMessage: string = '';
  selectedCountry: Country;

  selectedTeams: any;
  selectedRole: any;

  /**
   *
   * @param dialogRef
   * @param data
   * @param fb
   * @param facadeService
   */
  constructor(public dialogRef: MatDialogRef<ManageManagerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    fb: FormBuilder,
    private translateService: TranslateService,
    private facadeService: FacadeService,
    private snackBar: SnackBar,
  ) {

    this.form = fb.group({
      firstName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.compose([Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&_*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&_*]/)])],
      teamManagers: ['', Validators.required],
      roleNames: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.listRoles();
    this.listTeams();

    const operation = this.data.type;
    if (operation.toLowerCase() == 'edit') {

      this.actionLabel = this.translateService.instant(`Save`);
      this.titleLabel = this.translateService.instant(`Edit`);
      this.isEditMode = true;

      this.form.patchValue(this.data.manager);
      this.manager = this.data.manager;
      this.selectedTeams = this.data.manager.teamManagers;
      this.previousCountryId = this.data.manager.countryId;
      this.selectedCountry = this.data.manager.country;
    } else {
      this.form.controls['password'].setValidators([Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&_*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&_*]/)]);
    }
  }

  /**
   * roles
   *
   *
   */
  listRoles() {
    this.roles = [];

    this.facadeService.managerAccessControlService.list().subscribe((roles: any[]) => {
      if (roles.length > 0) {
        roles.forEach(role => {
          this.roles.push(role.roleName);
        });
      }

      if (this.isEditMode && this.data.manager.roleNames[0]) {
        this.form.get('roleNames').setValue(this.data.manager.roleNames[0]);
      }
    });
  }


  /**
   * teams
   *
   *
   */
  listTeams() {
    this.teams = [];

    this.facadeService.teamsService.list().subscribe((teams: any[]) => {
      this.teams = teams.map(team => {
        return {
          teamId: team['id'],
          teamName: team['name'],
        }
      });

      if (this.isEditMode) {
        this.selectedTeams = [];
        this.data.manager.teamManagers.forEach(t => {
          const team = this.teams.find(team => team.teamId == t.teamId);
          if (team) {
            this.selectedTeams.push(team);
          }
        });
        this.form.get('teamManagers').setValue(this.selectedTeams);
      }
    });

  }

  /**
   * close dialog
   *
   *
   */
  cancel(): void {
    this.dialogRef.close();
  }


  /**
   * password to text and inverse
   *
   *
   */
  togglePassword() {
    if (this.type == 'password') {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  validatePhone() {
    // validate number using google-libphonenumber
    let number: string = this.form.value['phoneNumber'];
    const phoneNumber = ManageManagerComponent.phoneNumberUtil.parseAndKeepRawInput(number.toString(), this.selectedCountry.topLevel);
    const validNumber = ManageManagerComponent.phoneNumberUtil.isValidNumber(phoneNumber);

    if (!validNumber) {
      this.numberMessage = this.translateService.instant(`Not valid number`);
      return;
    } else {
      this.numberMessage = '';
      this.isSubmitted = false;
    }
  }

  /**
   * create maneger
   *
   *
   * @param body
   */
  onSubmit() {
    this.isSubmitted = true;

    if (!this.form.valid) {
      this.isSubmitted = false;
      return;
    }

    // validate number using google-libphonenumber
    let number: string = this.form.value['phoneNumber'];
    const phoneNumber = ManageManagerComponent.phoneNumberUtil.parseAndKeepRawInput(number.toString(), this.selectedCountry.topLevel);
    const validNumber = ManageManagerComponent.phoneNumberUtil.isValidNumber(phoneNumber);

    if (!validNumber) {
      this.numberMessage = this.translateService.instant(`Not valid number`);
      return;
    } else {
      this.numberMessage = '';
    }

    const body = this.form.value;
    body['countryId'] = this.selectedCountry.id;

    let roles: string[] = [];

    roles.push(body['roleNames']);
    body['roleNames'] = roles;

    switch (this.isEditMode) {
      case true:
        body['Id'] = this.data.manager.id;
        body['userId'] = this.data.manager.userId;
        body['Username'] = body['email'];

        this.facadeService.managerService.update(body).subscribe(manager => {
          const message: Body = {
            message: this.translateService.instant('Manager has been updated successfully'),
            action: this.translateService.instant('Okay'),
            duration: 2000
          }
          this.snackBar.openSnackBar(message);
          this.dialogRef.close();
          this.isSubmitted = false;
        }, errors => {
          this.isSubmitted = false;
        });
        break;

      default:
        body['Username'] = body['email'];
        this.facadeService.managerService.create(body).subscribe(manager => {
          const message: Body = {
            message: this.translateService.instant('Manager has been added successfully'),
            action: this.translateService.instant('Okay'),
            duration: 2000
          }
          this.snackBar.openSnackBar(message);
          this.dialogRef.close();
          this.isSubmitted = false;
        }, error => {
          this.isSubmitted = false;
        });
        break;
    }
  }

  /**
   * select country
   *
   *
   * @param country
   */
  onChangeCountry(country: Country) {
    this.selectedCountry = country;
  }

  /**
 * check if form input has an error
 *
 *
 * @param input
 */
  getError(input: string) {
    switch (input) {
      case 'firstName':
        if (this.form.get('firstName').hasError('required')) {
          return this.translateService.instant(`First Name required`);
        }
        break;

      case 'password':
        if (this.form.get('password').hasError('required')) {
          return this.translateService.instant(`Password required`);
        }
        if (this.form.get('password').hasError('minLength')) {
          return this.translateService.instant(`Password mustt be 6 Character with num`);

        }
        if (this.form.get('password').hasError('pattern')) {
          return this.translateService.instant(`At least 1 special character(! , @ , $, % , ^ , & , _, * ) , 1 Capital letter, 1 small letter and 1 number`);

        }
        break;

      case 'email':
        if (this.form.get('email').hasError('required')) {
          return this.translateService.instant(`Email required`);
        }
        if (this.form.get('email').hasError('email')) {
          return this.translateService.instant(`Email is not correct`);
        }
        break;

      case 'phoneNumber':
        if (this.form.get('phoneNumber').hasError('required')) {
          return this.translateService.instant(`Phone required`);
        }
        break;


      case 'teamManagers':
        if (this.form.get('teamManagers').hasError('required')) {
          return this.translateService.instant(`Team(s) required`);
        }
        break;

      case 'roleNames':
        if (this.form.get('roleNames').hasError('required')) {
          return this.translateService.instant(`Roles required`);
        }
        break;

      default:
        return '';
    }
  }
}
