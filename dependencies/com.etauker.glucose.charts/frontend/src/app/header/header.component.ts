import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../service/translation/translation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    title = 'glucose.charts.app.title';

    constructor(
        private translation: TranslationService
    ) {
        this.loadTranslations();
    }

    ngOnInit() { }

    async loadTranslations () {
        this.title = await this.translation.getText(this.title);
    }
}
