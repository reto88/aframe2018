import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {AuthService} from '../services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../app.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public routingBaseId;
  public superuser: boolean;
  private subscriberUserLevel;

  constructor(private authservice: AuthService) {
    this.routingBaseId = environment.routingBaseId;
    console.log('envir0' + environment.routingBaseId);
  }

  ngOnInit() {
    this.superuser = this.authservice.isUserlevel(environment.superuser);
    this.subscriberUserLevel = this.authservice.getUserLevelObservable().subscribe(value => {
      this.superuser = this.authservice.isUserlevel(environment.superuser);
    });
  }


  ngOnDestroy() {
    this.subscriberUserLevel.unsubscribe();
  }

}
