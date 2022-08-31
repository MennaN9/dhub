import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material';

@Component({
  selector: 'app-dynamic-mat-checkbox',
  templateUrl: './dynamic-mat-checkbox.component.html',
  styleUrls: ['./dynamic-mat-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DynamicMatCheckboxComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  @Input() model: FormControl;
  @Input() values: any[];
  @Input() text = 'Select All';

  isChecked(): boolean {
    return this.model.value && this.values.length
      && this.model.value.length === this.values.length;
  }

  isIndeterminate(): boolean {
    return this.model.value && this.values.length && this.model.value.length && this.model.value.length < this.values.length;
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.model.setValue(this.values);
    } else {
      this.model.setValue([]);
    }
  }
}
