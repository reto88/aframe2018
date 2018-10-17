import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {AuthService} from '../../../services/auth/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

export interface DialogData {
  username: string;
}

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {
  loginForm: FormGroup;
  userStored: string;
  isLoading: boolean;
  message: string;
  hide: boolean;

  constructor(public thisDialogRef: MatDialogRef<LoginDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
              fb: FormBuilder, private authservice: AuthService, public dialog: MatDialog) {
    this.hide = true;
    this.userStored = localStorage.getItem('user') || '';
    this.loginForm = fb.group({
      'email': [this.userStored, Validators.email],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6)])]
    });

  }

// checks if a user is in the local Storage
  ngOnInit() {
    this.loginForm.value.password = '';
    // Store User to localStorage
    let user = localStorage.getItem('user');
    if (user = undefined) {
      user = '';
      this.loginForm.value.email = user;
    } else {
      this.loginForm.value.email = localStorage.getItem('user');
    }
  }

// Return an Error Message if validation is not ok for E-Mail
  getErrorMessageEmail() {
    return this.loginForm.controls['email'].hasError('required') ? 'You must enter a Email' :
      this.loginForm.controls['email'].hasError('email') ? 'Not a valid email' : '';
  }

// Return an Error Message if validation is not ok for E-Mail
  getErrorMessagePassword() {
    return this.loginForm.controls['email'].hasError('required') ? 'You must enter min 6 letters' :
      this.loginForm.controls['email'].hasError('email') ? 'Not a valid email' : '';
  }

// Creates a new user in the firebase db
  createNewUser() {
    this.isLoading = true;
    this.authservice.createNewUser(this.loginForm.value.email, this.loginForm.value.password).then(data => {
      this.message = 'new user created ' + data.user.email;
      this.isLoading = false;
      this.onCloseConfirm();
    }).catch(error => {
      this.loginForm.value.password = '';
      this.message = error.message;
      this.isLoading = false;
    });
  }

// If user exist it will logged in

  login() {
    this.isLoading = true;
    this.authservice.signInRegular(this.loginForm.value.email,
      this.loginForm.value.password).then(data => {
      this.isLoading = false;
      this.onCloseConfirm();
      localStorage.setItem('user', this.loginForm.value.email);
    }).catch(error => {
      this.message = error.message;
      this.isLoading = false;
    });
  }

// LoginDialog return value on close Confirm

  onCloseConfirm() {
    this.thisDialogRef.close(this.loginForm.value.email);
  }

// LoginDialog return value on close cancel

  onCloseCancel() {
    this.thisDialogRef.close('Cancel');
  }
}
