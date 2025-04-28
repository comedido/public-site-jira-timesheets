public with sharing class PSA_JiraPortalAuthController {
    private static final String clientId = 'jkmjNTVhBhdUWSM153Mt86RbhbVORh3B';
    private static final String clientSecret = 'your_client_secret'; // Replace with your actual client secret
    private static final String redirectUri = 'https://storm-f7d4d8b8a1951c.my.salesforce-sites.com/PSAHome';
    private static final String tokenEndpoint = 'https://auth.atlassian.com/oauth/token';
    private static final String userInfoEndpoint = 'https://api.atlassian.com/me';

    @AuraEnabled
    public static String exchangeCodeForToken(String code) {
        try {
            // Step 1: Exchange code for token
            Map<String, Object> tokenBody = new Map<String, Object>{
                'grant_type' => 'authorization_code',
                'client_id' => clientId,
                'client_secret' => clientSecret,
                'code' => code,
                'redirect_uri' => redirectUri
            };
            System.debug('User in Context: ' + System.userInfo.getUserId());
            System.debug('Token Body: ' + tokenBody);
            ICalloutService callout = CalloutService.newInstance()
                .setEndPoint(tokenEndpoint)
                .setMethod('POST')
                .setContentType('application/json')
                .setBody(JSON.serialize(tokenBody))
                .send();
            System.debug('Response Body: ' + callout.getResponse().getBody());
            System.debug('Response Status: ' + callout.getResponse().getStatusCode());
            if (callout.getResponse().getStatusCode() != 200) {
                throw new AuraHandledException('Token exchange failed: ' + callout.getResponse().getBody());
            }

            Map<String, Object> tokenData = (Map<String, Object>) JSON.deserializeUntyped(callout.getResponse().getBody());
            String accessToken = (String) tokenData.get('access_token');
            //String refreshToken = (String) tokenData.get('refresh_token');
            Integer expiresIn = (Integer) tokenData.get('expires_in');
            System.debug('Access Token: ' + accessToken);
            System.debug('Expires In: ' + expiresIn);
    
            // Step 2: Get Jira user info
            /*
            callout = CalloutService.newInstance()
                .setEndPoint(userInfoEndpoint)
                .setMethod('GET')
                .setAuthorization('Bearer ' + accessToken)
                .send();

            if (callout.getResponse().getStatusCode() != 200) {
                throw new AuraHandledException('Failed to fetch Jira user: ' + callout.getResponse().getBody());
            }

            Map<String, Object> userData = (Map<String, Object>) JSON.deserializeUntyped(callout.getResponse().getBody());

            // Extract user info
            String accountId = (String) userData.get('account_id');
            String email = (String) userData.get('email');
            String name = (String) userData.get('name');
            */
            // Step 3: Provision or retrieve PSA_Resource__c
            /*
            PSA_Resource__c resource;
            List<PSA_Resource__c> existing = [SELECT Id FROM PSA_Resource__c WHERE External_Id__c = :accountId LIMIT 1];
            if (!existing.isEmpty()) {
                resource = existing[0];
            } else {
                resource = new PSA_Resource__c(
                    Name = name,
                    Email__c = email,
                    External_Id__c = accountId
                );
                insert resource;
            }
            */
            // Step 4: Store session
            /*
            PSA_ResourceSession__c session = new PSA_ResourceSession__c(
                PSA_Resource__c = resource.Id,
                Access_Token__c = accessToken,
                Refresh_Token__c = refreshToken,
                Expires_In__c = expiresIn,
                Jira_Account_Id__c = accountId
            );
            insert session;
            */
            

            return 'SUCCESS ';

        } catch (Exception e) {
            throw new AuraHandledException('An error occurred: ' + e.getMessage());
        }
    }
}