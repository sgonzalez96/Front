(function(window) {
    window.__env = window.__env || {};

    // API url testing
    //window.__env.apiUrl = 'http://testapisintep-env.eba-xzpmdr9i.us-east-1.elasticbeanstalk.com/sintep/api/';
    //window.__env.apiAuth = 'http://testapisintep-env.eba-xzpmdr9i.us-east-1.elasticbeanstalk.com/oauth/token';
	
	// API url produccion
    window.__env.apiUrl = 'http://Backsintep-env.eba-edr5vmzh.us-east-1.elasticbeanstalk.com/sintep/api/';
    window.__env.apiAuth = 'http://Backsintep-env.eba-edr5vmzh.us-east-1.elasticbeanstalk.com/oauth/token';
    

	
}(this));