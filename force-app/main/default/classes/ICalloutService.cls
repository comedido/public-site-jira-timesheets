public interface ICalloutService {
	ICalloutService setEndPoint(String endpoint);
	ICalloutService setHeader(String attribute, String value);
	ICalloutService setContentType(String value);
	ICalloutService setAuthorization(String value);
	ICalloutService setBody(String body);
	ICalloutService setMethod(String body);

	ICalloutService send();
	ICalloutService doPost();
	ICalloutService doGet();

    ICalloutService log();

	HttpRequest getRequest();
	HttpResponse getResponse();

	String getJSONRespStringByKey(String key);
	String getJSONRespFirstStringByKey(String key);
}