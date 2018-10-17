import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent implements OnInit {
  activeRouterUrl: string;
  id: string;
  isVisible: boolean;
  blockingPath: string;
  blockingPath2: string;
  routingBaseId;
  constructor(private router: Router, private route: ActivatedRoute) {
    this.routingBaseId = environment.routingBaseId;    // Catch events from router
   // check router URl and get Id to hide nav
    router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          // GET /URL
          this.activeRouterUrl = router.url;
          // GET /scan/:id of Route
          this.route.firstChild.params.subscribe(params => {
            this.id = params['firebaseId'];
          });
          this.blockingPath = '/scan/' + this.id;
          this.blockingPath2 = '/edit/' + this.id;
          if (this.activeRouterUrl === this.blockingPath || this.activeRouterUrl === this.blockingPath2 ) {
            this.isVisible = false;
          } else {
            this.isVisible = true;
          }
        }
      }
    );

  }

  ngOnInit() {

  }

}

