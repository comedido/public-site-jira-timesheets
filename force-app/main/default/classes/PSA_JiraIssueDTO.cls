public class PSA_JiraIssueDTO {
    public class ResponseWrapper {
        public List<Issue> issues;
    }

    public class Issue {
        public String id;
        public String key;
        public Fields fields;
    }

    public class Fields {
        public String summary;
        //public String description;
        //public Project project;
    }

    public class Project {
        public String id;
    }

    /**
     * Serializes the DTO into a JSON string.
     * @return JSON string representation of the DTO.
     */
    public String serialize() {
        return JSON.serialize(this);
    }

    /**
     * Deserializes a JSON string into a PSA_JiraIssueDTO.ResponseWrapper object.
     * @param jsonString The JSON string to deserialize.
     * @return The deserialized ResponseWrapper object.
     */
    public static ResponseWrapper deserialize(String jsonString) {
        return (ResponseWrapper) JSON.deserialize(jsonString, ResponseWrapper.class);
    }
}