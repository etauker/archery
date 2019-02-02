import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

    constructor() { }

    ngOnInit() { }

    public authenticated() {
        const helper = new JwtHelperService();

        try {
            const token = localStorage.getItem('com.etauker.security.token');
            const decodedToken = helper.decodeToken(token);

            if (!token) {
                this.navigateToLogin();
                return false;
            }
            if (helper.isTokenExpired(token)) {
                this.navigateToLogin();
                return false;
            }
            if (!this.hasAppRole(decodedToken)) {
                this.navigateToLogin();
                return false;
            }
            return true;
         }
        catch (error) {
            this.navigateToLogin();
            return false;
         }
    }
    public navigateToLogin() {
        let protocol = window.location.protocol;
		let host = window.location.host;
		let path = 'login';
		let search = '?return=glucose-charts';
		let href = `${protocol}//${host}/${path}${search}`;
		window.location.href = href;
    }
    public navigateToLogout() {
        let protocol = window.location.protocol;
        let host = window.location.host;
        let path = 'logout';
        let search = '?return=glucose-charts';
        let href = `${protocol}//${host}/${path}${search}`;
        window.location.href = href;
    }
    private hasAppRole(object) {
        return object.roles.some(role => role.name.startsWith('com.etauker.glucose'));
    }
}
