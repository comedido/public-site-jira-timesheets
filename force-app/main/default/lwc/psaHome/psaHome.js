/* 
    * This file is part of the PSA Timesheet Lightning Web Component.
*/
import { LightningElement, track, api } from 'lwc';
import exchangeCodeForToken from '@salesforce/apex/PSA_JiraPortalAuthController.exchangeCodeForToken';

export default class PsaHome extends LightningElement {

    clientId = 'jkmjNTVhBhdUWSM153Mt86RbhbVORh3B';
    redirectUri = 'https://storm-f7d4d8b8a1951c.my.salesforce-sites.com/PSAHome';
    authUrl = 'https://auth.atlassian.com/authorize';
    scopes = 'read:jira-user read:jira-work';

    code = null;
    token = null;
    error = null;

    // #region Tracked Properties
    @track hasError = false;
    @track errorMessages = '';

    // #region Non-tracked Properties
    isInit = false;
    
    @track userAuthenticated = false;
    userName = '';
    errorMessages = '';

    @api get isUserAuthenticated() {
        return this.userAuthenticated ? true : false;
    }

    connectedCallback() {
        this.isInit = false;
        this.userAuthenticated = false;
        this.userName = 'Guest User'; // Default value

        this.init();
    }

    errorCallback(error, stack) {
        this.hasError = true;
        this.errorMessages = error + ' ' + stack;
    }

    /**
     * Initializes the component, applying the global style.
     */
    init() {

        if (this.isInit) {
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');

        if (authCode) {
            this.code = authCode;
            this.exchangeToken(authCode);
        }

    }

    exchangeToken(code) {
        console.log('Exchanging code for token:', code);
        exchangeCodeForToken({ code })
          .then(result => {
            console.log('Token exchange result:', result);
            //const tokenResponse = JSON.parse(result);
            //this.token = tokenResponse.access_token;
            this.isInit = true;
            this.userAuthenticated = true;
            this.userName = 'Authenticated !! (name will appear soon)';
          })
          .catch(err => {
            this.error = err.body?.message || 'Token exchange failed.';
            console.error('Error exchanging token:', this.error);
          });
    }


    handleSSOLogin(event) {

        const params = new URLSearchParams({
            audience: 'api.atlassian.com',
            client_id: this.clientId,
            scope: this.scopes,
            redirect_uri: this.redirectUri,
            response_type: 'code',
            prompt: 'consent'
          });
        window.location.href = `${this.authUrl}?${params.toString()}`;

        //this.userAuthenticated = true;
        //this.userName = 'John Doe';

    }

    handleInputChange() {
        console.log('login Input changed');
    }
    
    handleLogout() {
        const url = new URL(window.location.href);
        const paramToRemove = 'code';
        if (url.searchParams.has(paramToRemove)) {
            url.searchParams.delete(paramToRemove);
            // Update the URL in the address bar without reloading
            window.history.pushState({}, '', url);
            // Now, reload the page
            window.location.reload();
        }
    }

}