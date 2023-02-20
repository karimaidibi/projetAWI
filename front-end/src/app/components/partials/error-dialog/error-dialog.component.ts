import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';

@Component({
  selector: 'festivalJeux-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent {
  errorMessage: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) {
    this.errorMessage = data;
  }

  ngOnInit(): void {
  }

}
