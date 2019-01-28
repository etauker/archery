import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class TranslationService {

    // Constants
    private DEFAULT = 'default';

    // This must match the bundled i18n files
    private SUPPORTED_LOCALES = [
        'en',
        'en_GB',
        this.DEFAULT
    ];

    // Variables
    private translations = {};
    private loading = null;


    // Constructor
    constructor(private http: HttpClient) {
        this.loading = this.loadTranslationFiles();
    };



    //===========================================
    //                  PUBLIC
    //===========================================
    public getText = (key: string, locale: string = navigator.language) => {
        return this.getClosestLoadedTranslations()
            .then(translationObject => translationObject[key] || key);
    };



    //===========================================
    //                  PRIVATE
    //===========================================
    private isEmpty = (object: any) => {
        if (object === null || object === undefined) {
            return true;
        }
        return Object.entries(object).length === 0 && object.constructor === Object;
    };

    private isTranslationLoaded = (tag: string) => {
        let translationObject = this.translations[tag];
        if (translationObject && !this.isEmpty(translationObject)) {
            return tag;
        }
    };

    private getSubtag = (locale: string) => {
        if (!locale || locale.indexOf('-') === -1) {
            return this.DEFAULT;
        }
        else if (locale.indexOf('-') !== -1) {
            return locale.substring(0, locale.indexOf('-'));
        }
        else {
            return locale;
        }
    };

    private getClosestLoadedTranslations = (locale: string = navigator.language) => {
        return this.loading
            .then(() => this.translations[this.getClosestSupportedLocale(locale)]);
    };

    private getClosestSupportedLocale = (tag: string): string => {
        if (this.SUPPORTED_LOCALES.includes(tag)) {
            return tag;
        }
        if (this.SUPPORTED_LOCALES.includes(this.getSubtag(tag))) {
            return this.getSubtag(tag);
        }
        return this.DEFAULT;
    };

    private getClosestLoadedLocale = (tag: string): string => {
        if (this.isTranslationLoaded(tag)) {
            return tag;
        }
        if (this.isTranslationLoaded(this.getSubtag(tag))) {
            return this.getSubtag(tag);
        }
        return this.DEFAULT;
    };

    private loadTranslationFile = (path: string) => {
        return this.http.get(path, { responseType: 'text' as 'json' }).toPromise();
    };

    private loadTranslationFiles = (locale: string = navigator.language) => {
        locale = this.getClosestSupportedLocale(locale);
        if (locale === this.DEFAULT) {
            return this.loadTranslationFile(`assets/i18n/i18n.properties`)
                .then(content => this.addToTranslationObject(locale, content as string))
                .catch(error => console.error('No translation files found.'));
        } else {
            return this.loadTranslationFile(`assets/i18n/i18n.${locale}.properties`)
                .then(content => this.addToTranslationObject(locale, content as string))
                .catch(error => this.loadTranslationFiles(this.getSubtag(locale)));
        }
    };

    private addToTranslationObject = (locale: string, content: string) => {
        if (!locale || !content) return;

        if (this.isEmpty(this.translations[locale])) {
            this.translations[locale] = {};
        }

        let lines = content.split('\n');

        lines.forEach(line => {
            line = line.substring(line.indexOf('#'));
            if (!line) return;
            let parts = line.split('=');
            let key = parts[0];
            let value = parts[1];
            this.translations[locale][key] = value;
        });
    };

}
