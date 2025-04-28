public class PSA_JiraProjectService {
    private static final String NAMED_CREDENTIAL = 'callout:PSA_Jira';

    /**
     * Retrieves issues for a given Jira project and upserts them into PSA_UserStory__c.
     * @param projectKey The key of the Jira project.
     */
    public static void syncIssuesForProject(String projectKey) {
        try {
            // Construct the endpoint for Jira search API to retrieve issues for the project
            String endpoint = NAMED_CREDENTIAL + '/search?jql=project=' + projectKey;

            // Use CalloutService to make the GET request
            ICalloutService callout = CalloutService.newInstance()
                .setEndPoint(endpoint)
                .setMethod('GET')
                .setContentType('application/json')
                .send();
                //.log(); // Log the request and response

            // Check the response status
            if (callout.getResponse().getStatusCode() == 200) {
                // Deserialize the response into PSA_JiraIssueDTO
                System.debug('Aaron '+ callout.getResponse().getBody());
                PSA_JiraIssueDTO.ResponseWrapper responseWrapper = 
                    (PSA_JiraIssueDTO.ResponseWrapper) JSON.deserialize(
                        callout.getResponse().getBody(), 
                        PSA_JiraIssueDTO.ResponseWrapper.class
                    );

                // Map Jira issues to PSA_UserStory__c records
                List<PSA_UserStory__c> userStories = new List<PSA_UserStory__c>();
                for (PSA_JiraIssueDTO.Issue issue : responseWrapper.issues) {
                    PSA_UserStory__c userStory = new PSA_UserStory__c();
                    userStory.Name = issue.key;
                    //userStory.PSA_BoardId__c = issue.fields.project.id;
                    userStory.PSA_BoardId__c = 'aG1Hr000000sYopKAE'; // Placeholder for Board ID
                    userStory.PSA_UserStoryId__c = issue.id;
                    //userStory.PSA_Description__c = issue.fields.description;
                    userStory.PSA_Summary__c = issue.fields.summary;
                    userStories.add(userStory);
                }

                // Upsert the records into Salesforce
                if (!userStories.isEmpty()) {
                    upsert userStories Name; // Use Name as the external ID for upsert
                }
            } else {
                throw new CalloutException('Failed to fetch issues for project ' + projectKey + 
                    '. Status: ' + callout.getResponse().getStatusCode() + 
                    ', Body: ' + callout.getResponse().getBody());
            }
        } catch (Exception e) {
            System.debug('Error during Jira issues synchronization: ' + e.getMessage());
            throw new CalloutException('Error during Jira issues synchronization: ' + e.getMessage());
        }
    }
}