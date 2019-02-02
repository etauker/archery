import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../service/translation/translation.service';
import { SecurityService } from '../service/security/security.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    title = 'glucose.charts.app.title';

    constructor(
        private translation: TranslationService,
        private security: SecurityService
    ) {
        this.loadTranslations();
    }

    ngOnInit() { }

    async loadTranslations () {
        this.title = await this.translation.getText(this.title);
    }
    public onLogout(event) {
        this.handleLogout();
    }
    private handleLogout() {
        this.security.navigateToLogout();
    }
}
