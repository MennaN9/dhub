import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signuutypes',
  templateUrl: './signuutypes.component.html',
  styleUrls: ['./signuutypes.component.scss']
})
export class SignuutypesComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }
  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
