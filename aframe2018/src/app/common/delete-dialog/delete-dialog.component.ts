import {Component, Inject, OnInit} from '@angular/core';
import {DialogData, LoginDialogComponent} from '../../auth/login/login-dialog/login-dialog.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

export interface DeleteDialogData {
  id: string;
  aks: string;
  name: string;
}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData) {}

  ngOnInit() {
  }

  ok(){
    this.dialogRef.close(true);
  }
  abbort(){
    this.dialogRef.close(false);
  }
}
