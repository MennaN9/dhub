import { Component, OnInit } from '@angular/core';
import { Images } from '@dms/constants/images';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FacadeService } from '@dms/services/facade.service';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rate-customer',
  templateUrl: './rate-customer.component.html',
  styleUrls: ['./rate-customer.component.scss']
})
export class RateCustomerComponent implements OnInit {

  rating: number = 1;
  starCount: number = 5;
  user = Images.user;
  form: FormGroup;
  done: boolean = false;

  params: any;
  message: string;

  constructor(
    fb: FormBuilder,
    private facadeService: FacadeService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService) {
    this.form = fb.group({
      note: ['']
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.params = params;
    });

    this.message = this.translateService.instant(`DriverRatedMessage`);  }

  onSubmit() {
    const body = { ... { note: this.form.get('note').value, Rate: this.rating }, ... this.params }
    this.facadeService.driverService.rate(body).subscribe(res => {
      this.done = true;
    });
  }

  /**
   * get rating
   * 
   * 
   * @param rating 
   */
  onRatingChanged(rating: number) {
    this.rating = rating;
  }

  /**
   * check if form input has an error
   *
   *
   * @param input
   */
  getError(input: string) {
    switch (input) {
      case 'comment':
        if (this.form.get('comment').hasError('required')) {
          return 'comment required';
        }
        break;
    }
  }
}
