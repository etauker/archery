import { Component } from '@angular/core';
import { SecurityService } from './service/security/security.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
    authenticated = false;

    constructor() {
        const security = new SecurityService();
        this.authenticated = security.authenticated();
    }

    ngOnInit() { }
}
