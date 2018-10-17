import {Component, AfterViewInit} from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {LoginDialogComponent} from '../../auth/login/login-dialog/login-dialog.component';
import {MatDialog} from '@angular/material';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', '../../app.component.scss']
})
export class HeaderComponent implements AfterViewInit {
  activeRouterUrl: string;
  id: string;
  isVisible: boolean;
  blockingPath: string;
  isloggedIn: boolean;
  username: string;
  dialogResult;
  loginButtonText: string;
  urlwithout;
  routingBaseId;

  constructor(private router: Router, private route: ActivatedRoute, private authservice: AuthService, public dialog: MatDialog) {
    this.routingBaseId = environment.routingBaseId;
    // check router URl and get Id to hide nav
    // Catch events from router
    router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {

          // GET /URL
          this.activeRouterUrl = router.url;
          // Without id
          this.urlwithout = this.activeRouterUrl.split('/', 2);
          this.urlwithout = this.urlwithout.slice(1, 2);

          // GET /scan/:id of Route
          this.route.firstChild.params.subscribe(params => {
            this.id = params['firebaseId'];
          });
          this.blockingPath = '/scan/' + this.id;
          // if scan/:id then doen't show header
          if (this.activeRouterUrl !== this.blockingPath) {
            this.isVisible = true;
          } else {
            this.isVisible = false;
          }
        }
      }
    );

  }

// checks if someone is logged in and change text
  ngAfterViewInit() {
    this.authservice.user.subscribe((user) => {
        if (user) {
          this.isloggedIn = true;
          this.loginButtonText = 'Logout';
          this.username = user.email;
        } else {
          this.username = '';
          this.loginButtonText = 'Login';
     //     this.isloggedIn = false;
          this.isloggedIn = true;
      this.openLoginDialog();
        }
      }
    );

  }

// Open LoginDialog
  openLoginDialog() {
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      data: 'LOGIN OR Create a user'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialogResult = result;
    });
  }

// Open Logout service
  logout() {
    this.authservice.logout();
  }

}
