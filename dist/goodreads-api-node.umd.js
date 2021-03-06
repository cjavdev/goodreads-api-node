(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('xml2js'), require('request'), require('query-string'), require('oauth')) :
	typeof define === 'function' && define.amd ? define(['xml2js', 'request', 'query-string', 'oauth'], factory) :
	(global['goodreads-api-node'] = factory(global.xml2js,global.request,global.queryString,global.oauth));
}(this, (function (xml2js,request,queryString,oauth) { 'use strict';

	xml2js = xml2js && xml2js.hasOwnProperty('default') ? xml2js['default'] : xml2js;
	request = request && request.hasOwnProperty('default') ? request['default'] : request;
	queryString = queryString && queryString.hasOwnProperty('default') ? queryString['default'] : queryString;
	oauth = oauth && oauth.hasOwnProperty('default') ? oauth['default'] : oauth;

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var Builder = function Builder() {
	};

	Builder.prototype.withResponseKey = function (responseKey) {
	  this.responseKey = responseKey;
	  return this;
	};

	Builder.prototype.withQueryParams = function (queryParams) {
	  this.queryParams = queryParams;
	  return this;
	};

	Builder.prototype.withPort = function (port) {
	  this.port = port;
	  return this;
	};

	Builder.prototype.withPath = function (path) {
	  this.path = path;
	  return this;
	};

	Builder.prototype.withOAuth = function (authOptions) {
	  this.oauth = authOptions.OAUTH;
	  this.access_token = authOptions.ACCESS_TOKEN;
	  this.access_token_secret = authOptions.ACCESS_TOKEN_SECRET;
	  return this;
	};

	Builder.prototype.build = function () {
	  return new Request(this);
	};

	var Request = function Request(builder) {
	  if (!builder) throw new Error('No Builder');

	  this.path = builder.path;
	  this.port = builder.port || 80;
	  this.queryParams = builder.queryParams || {};
	  this.access_token = builder.access_token;
	  this.access_token_secret = builder.access_token_secret;
	  this.oauth = builder.oauth;
	};

	Request.prototype.getQueryParams = function () {
	  return this.queryParams;
	};

	Request.prototype.getPort = function () {
	  return this.port;
	};

	Request.prototype.getPath = function () {
	  return this.path;
	};

	Request.prototype.getAccessToken = function () {
	  var access_token = this.access_token,
	      access_token_secret = this.access_token_secret;

	  return { access_token: access_token, access_token_secret: access_token_secret };
	};

	Request.prototype.getOAuth = function () {
	  return this.oauth;
	};

	var builder = function builder() {
	  return new Builder();
	};

	var baseRequest = {
	  builder: builder
	};

	function GoodreadsApiError(message, functionName) {
	  this.name = 'GoodreadsApiError';
	  this.message = functionName + ': ' + message;
	}
	GoodreadsApiError.prototype = Error.prototype;

	var wrongParamsError = function wrongParamsError(functionName, param) {
	  return new GoodreadsApiError('You have not passed ' + param + '.', functionName);
	};
	var noOAuthError = function noOAuthError(functionName) {
	  return new GoodreadsApiError('You need an oAuth connection for this request', functionName);
	};
	var APIError = function APIError(message, functionName) {
	  return new GoodreadsApiError('API returned following Error: ' + message, functionName);
	};
	var XMLError = function XMLError(message, functionName) {
	  return new GoodreadsApiError('Error parsing XML response: ' + message, functionName);
	};
	var logWarning = function logWarning(message, functionName) {
	  return console.warn(functionName + ': ' + message);
	};

	var goodreadsError = {
	  GoodreadsApiError: GoodreadsApiError,
	  noOAuthError: noOAuthError,
	  APIError: APIError,
	  XMLError: XMLError,
	  logWarning: logWarning,
	  wrongParamsError: wrongParamsError
	};

	var XMLError$1 = goodreadsError.XMLError;


	var xmlParser = new xml2js.Parser({
	  explicitArray: false,
	  mergeAttrs: true
	});

	var xmlParser_1 = function parseXML(xml) {
	  return new Promise(function (resolve, reject) {
	    xmlParser.parseString(xml, function (err, result) {
	      if (err) reject(XMLError$1(err.error, 'RequestManager.get()'));
	      // else if (result.error) reject(APIError(result.error, 'RequestManager.get()'));
	      else resolve(result);
	    });
	  });
	};

	var buildURL = function buildURL(path, queryString$$1) {
	  return path + '?' + queryString$$1;
	};

	var goodreadsRequest = {
	  get: function get(req) {
	    var queryParams = req.getQueryParams();
	    var path = buildURL(req.getPath(), queryString.stringify(queryParams));

	    return new Promise(function (resolve, reject) {
	      request(path, function (error, response, body) {
	        if (error) reject(error);else resolve(body);
	      });
	    });
	  },

	  oAuthGet: function oAuthGet(req) {
	    var _req$getAccessToken = req.getAccessToken(),
	        access_token = _req$getAccessToken.access_token,
	        access_token_secret = _req$getAccessToken.access_token_secret;

	    var queryParams = req.getQueryParams();
	    var path = buildURL(req.getPath(), queryString.stringify(queryParams));
	    var oauth$$1 = req.getOAuth();

	    return new Promise(function (resolve, reject) {
	      oauth$$1.get(path, access_token, access_token_secret, function (error, response) {
	        if (error) reject(error);else resolve(response);
	      });
	    });
	  },

	  oAuthPost: function oAuthPost(req) {
	    var _req$getAccessToken2 = req.getAccessToken(),
	        access_token = _req$getAccessToken2.access_token,
	        access_token_secret = _req$getAccessToken2.access_token_secret;

	    var oauth$$1 = req.getOAuth();
	    var queryParams = req.getQueryParams();
	    var path = buildURL(req.getPath(), queryString.stringify(queryParams));

	    return new Promise(function (resolve, reject) {
	      oauth$$1.post(path, access_token, access_token_secret, null, null, function (error, response) {
	        if (error) reject(error);else resolve(response);
	      });
	    });
	  },

	  oAuthDelete: function oAuthDelete(req) {
	    var _req$getAccessToken3 = req.getAccessToken(),
	        access_token = _req$getAccessToken3.access_token,
	        access_token_secret = _req$getAccessToken3.access_token_secret;

	    var oauth$$1 = req.getOAuth();
	    var queryParams = req.getQueryParams();
	    var path = buildURL(req.getPath(), queryString.stringify(queryParams));

	    return new Promise(function (resolve, reject) {
	      oauth$$1.delete(path, access_token, access_token_secret, function (error, response) {
	        if (error) reject(error);else resolve(response);
	      });
	    });
	  }
	};

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

	var goodreadsApi = createCommonjsModule(function (module, exports) {
	  var OAuth = oauth.OAuth;

	  var GoodreadsApiError = goodreadsError.GoodreadsApiError,
	      noOAuthError = goodreadsError.noOAuthError,
	      wrongParamsError = goodreadsError.wrongParamsError,
	      logWarning = goodreadsError.logWarning;
	  var get$$1 = goodreadsRequest.get,
	      oAuthGet = goodreadsRequest.oAuthGet,
	      oAuthPost = goodreadsRequest.oAuthPost,
	      oAuthDelete = goodreadsRequest.oAuthDelete;

	  /**
	   * Goodreads
	   *
	   * @access public
	   * @param {object} credentials Object with API key and secret
	   * @param {string} callbackURL callbackURL to get user access
	   * @returns {object} Goodreads API object
	   */

	  var Goodreads = function Goodreads(credentials, callbackURL) {
	    if (!credentials || !credentials.key || !credentials.secret) throw new GoodreadsApiError('Please pass your API key and secret.', 'Goodreads()');
	    if (callbackURL) initOAuth(callbackURL);

	    var URL = 'https://goodreads.com';
	    var KEY = credentials.key;
	    var SECRET = credentials.secret;

	    var OAUTH = void 0;
	    var ACCESS_TOKEN = void 0;
	    var ACCESS_TOKEN_SECRET = void 0;
	    var OAUTH_TOKEN = void 0;
	    var OAUTH_TOKEN_SECRET = void 0;
	    var OAUTHENTICATED = false;

	    /**
	     * _setAccessToken
	     *
	     * @access private
	     * @param {object} token ACCESS_TOKEN and ACCESS_TOKEN_SECRET
	     */
	    function _setAccessToken(token) {
	      ACCESS_TOKEN = token.ACCESS_TOKEN;
	      ACCESS_TOKEN_SECRET = token.ACCESS_TOKEN_SECRET;
	    }
	    /**
	     * _getAccessToken
	     *
	     * @access private
	     */
	    function _getAccessToken() {
	      return { ACCESS_TOKEN: ACCESS_TOKEN, ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET };
	    }
	    /**
	     * _setOAuthToken
	     *
	     * @access private
	     * @param {object} token Object with OAUTH_TOKEN and OAUTH_TOKEN_SECRET
	     */
	    function _setOAuthToken(token) {
	      OAUTH_TOKEN = token.OAUTH_TOKEN;
	      OAUTH_TOKEN_SECRET = token.OAUTH_TOKEN_SECRET;
	    }
	    /**
	     * _getOAuthToken
	     *
	     * @access private
	     */
	    function _getOAuthToken() {
	      return { OAUTH_TOKEN: OAUTH_TOKEN, OAUTH_TOKEN_SECRET: OAUTH_TOKEN_SECRET };
	    }
	    /**
	     * _getAuthOptions
	     *
	     * @access private
	     */
	    function _getAuthOptions() {
	      return _extends({}, _getAccessToken(), { OAUTH: OAUTH });
	    }
	    function _execute(fn, req, responseKey) {
	      return fn(req).then(xmlParser_1).then(function (res) {
	        return responseKey ? res.GoodreadsResponse[responseKey] : res.GoodreadsResponse;
	      });
	    }
	    function _setOAuth(oauth$$1) {
	      OAUTH = oauth$$1;
	      OAUTHENTICATED = true;
	    }

	    /**
	     * initOAuth
	     *
	     * @access public
	     * @param {string} callbackURL, callbackURL after user has granted/declined access
	     * @returns {undefined}
	     */
	    function initOAuth(callbackURL) {
	      if (!callbackURL) logWarning('Warning: You have passed no callbackURL.', 'initOAuth()');

	      var requestURL = URL + '/oauth/request_token';
	      var accessURL = URL + '/oauth/access_token';
	      var version = '1.0';
	      var encryption = 'HMAC-SHA1';

	      OAUTH = new OAuth(requestURL, accessURL, KEY, SECRET, version, callbackURL, encryption);
	      return OAUTH;
	    }
	    /**
	     * getRequestToken
	     *
	     * @access public
	     */
	    function getRequestToken() {
	      return new Promise(function (resolve, reject) {

	        if (!OAUTH) initOAuth();

	        OAUTH.getOAuthRequestToken(function (error, oAuthToken, oAuthTokenSecret, results) {
	          if (error) reject(new GoodreadsApiError(error.message, 'getRequestToken()'));

	          var url = URL + '/oauth/authorize?oauth_token=' + oAuthToken + '&oauth_callback=' + OAUTH._authorize_callback;
	          _setOAuthToken({ OAUTH_TOKEN: oAuthToken, OAUTH_TOKEN_SECRET: oAuthTokenSecret });

	          resolve(url);
	        });
	      });
	    }
	    /**
	     * getAccessToken
	     *
	     * @access public
	     * @returns {promise}
	     */
	    function getAccessToken() {
	      return new Promise(function (resolve, reject) {
	        var _getOAuthToken2 = _getOAuthToken(),
	            OAUTH_TOKEN = _getOAuthToken2.OAUTH_TOKEN,
	            OAUTH_TOKEN_SECRET = _getOAuthToken2.OAUTH_TOKEN_SECRET;

	        if (OAUTH_TOKEN && OAUTH_TOKEN_SECRET && OAUTH) {

	          OAUTH.getOAuthAccessToken(OAUTH_TOKEN, OAUTH_TOKEN_SECRET, 1, function (error, accessToken, accessTokenSecret, results) {
	            if (error) reject(new GoodreadsApiError(error.data.split("\n")[0], 'getAccessToken()'));

	            _setAccessToken({ ACCESS_TOKEN: accessToken, ACCESS_TOKEN_SECRET: accessTokenSecret });
	            OAUTHENTICATED = true;

	            resolve();
	          });
	        } else reject(new GoodreadsApiError("No Request Token found. call getRequestToken()"));
	      });
	    }
	    /**
	     * followAuthor
	     *
	     * @access public
	     * @param {string} authorID
	     * @returns {promise}
	     */
	    function followAuthor(id) {
	      var fn_name = 'followAuthor()';

	      if (!id) return Promise.reject(wrongParamsError(fn_name, 'authorID'));
	      if (!OAUTHENTICATED) return Promise.reject(noOAuthError(fn_name));

	      var path = URL + '/author_followings';
	      var options = { id: id, format: 'xml' };
	      var authOptions = _getAuthOptions();

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).withOAuth(authOptions).build();

	      return _execute(oAuthPost, req);
	    }
	    /**
	     * unfollowAuthor
	     *
	     * @access public
	     * @param {string} authorID
	     * @returns {promise}
	     */
	    function unfollowAuthor(id) {
	      var fn_name = 'unfollowAuthor()';

	      if (!id) return Promise.reject(wrongParamsError(fn_name, 'authorID'));
	      if (!OAUTHENTICATED) return Promise.reject(noOAuthError(fn_name));

	      var path = URL + '/author_followings/' + id;
	      var options = { format: 'xml' };
	      var authOptions = _getAuthOptions();

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).withOAuth(authOptions).build();

	      return _execute(oAuthDelete, req);
	    }
	    /**
	     * showFollowing
	     *
	     * @access public
	     * @param {string} author followingID
	     * @returns {promise}
	     */
	    function showFollowing(id) {
	      var fn_name = 'showFollowing()';

	      if (!id) return Promise.reject(wrongParamsError(fn_name, 'authorFollowingID'));
	      if (!OAUTHENTICATED) return Promise.reject(noOAuthError(fn_name));

	      var path = URL + '/author_followings/' + id;
	      var options = { format: 'xml' };
	      var authOptions = _getAuthOptions();

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).withOAuth(authOptions).build();

	      return _execute(oAuthGet, req);
	    }
	    /**
	     * getUserFollowings
	     *
	     * @access public
	     * @param {string} id userID
	     * @returns {promise} returns infos about the following
	     */
	    function getUserFollowings(id) {
	      var fn_name = 'getUserFollowings()';

	      if (!id) return Promise.reject(wrongParamsError(fn_name, 'userID'));
	      if (!OAUTHENTICATED) return Promise.reject(noOAuthError(fn_name));

	      var path = URL + '/user/' + id + '/following.xml';
	      var options = { key: KEY };
	      var authOptions = _getAuthOptions();

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).withOAuth(authOptions).build();

	      return _execute(oAuthGet, req);
	    }
	    /**
	     * getBooksByAuthor
	     *
	     * @access public
	     * @param {string} authorID {number} page (optional)
	     * @returns {promise}
	     */
	    function getBooksByAuthor(id, page) {
	      var fn_name = 'getBooksByAuthor()';

	      if (!id) return Promise.reject(wrongParamsError(fn_name, 'authorID'));

	      var path = URL + '/author/list/' + id;
	      var options = { format: 'xml', key: KEY };
	      if (page) options.page = page;

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req, 'author');
	    }
	    /**
	     * getInfo
	     *
	     * @access public
	     * @param {string} id author ID
	     * @returns {promise} returns author info if successful
	     */
	    function getAuthorInfo(id) {
	      var fn_name = 'getAuthorInfo()';

	      if (!id) return Promise.reject(wrongParamsError(fn_name, 'authorID'));

	      var path = URL + '/author/show/' + id;
	      var options = { key: KEY, format: 'xml' };

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req, 'author');
	    }
	    /**
	     * getAllSeries
	     *
	     * @access public
	     * @param {string} id author ID
	     * @returns {promise} returns all series by author if successful
	     */
	    function getAllSeriesByAuthor(id) {
	      var fn_name = 'getAllSeriesByAuthor()';

	      if (!id) return Promise.reject(wrongParamsError(fn_name, 'authorID'));

	      var path = URL + '/series/list';
	      var options = { id: id, key: KEY, format: 'xml' };

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req, 'series_works');
	    }
	    /**
	     * getInfo
	     *
	     * @access public
	     * @param {string} id user ID
	     * @returns {promise} returns user info if successful
	     */
	    function getUserInfo(id) {
	      var fn_name = 'getUserInfo()';

	      if (!id) return Promise.reject(wrongParamsError(fn_name, 'userID'));

	      var path = URL + '/user/show/' + id + '.xml';
	      var options = { key: KEY };

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req, 'user');
	    }
	    /**
	     * addBookToShelf
	     *
	     * @access public
	     * @param {string} book_id bookID
	     * @param {string} shelf name of users shelf
	     * @returns {promise}
	     */
	    function addBookToShelf(book_id, shelf) {
	      var fn_name = 'addBookToShelf()';

	      if (!book_id) return Promise.reject(wrongParamsError(fn_name, 'bookID'));
	      if (!shelf) return Promise.reject(wrongParamsError(fn_name, 'shelfName'));
	      if (!OAUTHENTICATED) return Promise.reject(noOAuthError(fn_name));

	      var path = URL + '/shelf/add_to_shelf.xml';
	      var authOptions = _getAuthOptions();
	      var options = { book_id: book_id, name: shelf };

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).withOAuth(authOptions).build();

	      _execute(oAuthPost, req);
	    }

	    /**
	     * getShelves
	     *
	     * @access public
	     * @param {string} id user ID
	     * @returns {promise} returns users shelves if successful
	     */
	    function getUsersShelves(id) {
	      var fn_name = 'getUsersShelves()';

	      if (!id) return Promise.reject(wrongParamsError(fn_name, 'userID'));

	      var path = URL + '/shelf/list.xml';
	      var options = { user_id: id, key: KEY };

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req, 'shelves');
	    }
	    /**
	     * getUsersGroups
	     * TODO
	     *
	     * @access public
	     * @param {string} id userID
	     * @param {string} sort sort groups by
	     * @returns {promise} returns groups if successful
	     */
	    function getUsersGroups(id, sort) {
	      if (!id) return Promise.reject(wrongParamsError('getUsersGroups()', 'groupID'));

	      var path = URL + '/group/list/' + id + '.xml';
	      var options = { key: KEY };
	      if (sort) options.sort = sort;
	      var authOptions = _getAuthOptions();

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req, 'groups');
	    }
	    /**
	     * getGroupMembers
	     *
	     * @access public
	     * @param {string} id group ID
	     * @param {string} sort sort members by
	     * @param {number} page optional page
	     * @param {string} query search members by
	     * @returns {promise} returns group members if successful
	     */
	    function getGroupMembers(id, params) {
	      if (!id) return Promise.reject(wrongParamsError('getGroupMembers()', 'groupID'));

	      var path = URL + '/group/members/' + id + '.xml';
	      var options = _extends({ key: KEY }, params);

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req, 'group_users');
	    }
	    /**
	     * getGroupInfo
	     *
	     * @access public
	     * @param {string} id group ID
	     * @param {object} params {string} sort, {order} 'a' or 'd'
	     * @returns {promise} returns group info if successful
	     */
	    function getGroupInfo(id, params) {
	      if (!id) return Promise.reject(wrongParamsError('getGroupInfo()', 'groupID'));

	      var path = URL + '/group/show/' + id + '.xml';
	      var options = _extends({ key: KEY }, params);

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req);
	    }
	    /**
	     * getOwnedBooks
	     *
	     * @access public
	     * @param {string} id user ID
	     * @param {number} page optional page of results
	     * @returns {promise} returns list of books owned by the given user
	     */
	    function getOwnedBooks(id, page) {
	      var fn_name = 'getOwnedBooks()';

	      if (!id) return Promise.reject(wrongParamsError(fn_name, 'userID'));
	      if (!OAUTHENTICATED) return Promise.reject(noOAuthError(fn_name));

	      var path = URL + '/owned_books/user';
	      var options = { format: 'xml', id: id };
	      if (page) options.page = page;
	      var authOptions = _getAuthOptions();

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).withOAuth(authOptions).build();

	      return _execute(oAuthGet, req);
	    }
	    /**
	     * getBooksOnUserShelf
	     *
	     * @access public
	     * @param {string} id user ID
	     * @param {string} shelf name of users shelf
	     * @param {object} queryOptions object with properties: sort {string}, query {string}, oder {'a' or 'd'}, page {number}, per_page {number, 1-200}
	     * @returns {promise} returns books on the given shelf
	     */
	    function getBooksOnUserShelf(id, shelf, queryOptions) {
	      var fn_name = 'getBooksOnUserShelf()';

	      if (!OAUTHENTICATED) return Promise.reject(noOAuthError(fn_name));
	      if (!id) return Promise.reject(wrongParamsError(fn_name, 'userID'));
	      if (!shelf) return Promise.reject(wrongParamsError(fn_name, 'shelf'));

	      var path = URL + '/review/list';
	      var options = _extends({
	        id: id,
	        shelf: shelf,
	        key: KEY,
	        format: 'xml'
	      }, queryOptions);
	      var authOptions = _getAuthOptions();

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).withOAuth(authOptions).build();

	      return _execute(oAuthGet, req);
	    }
	    /**
	     * getRecentReviews
	     *
	     * @access public
	     * @returns {promise} return recent reviews if successful
	     */
	    function getRecentReviews() {
	      var path = URL + '/review/recent_reviews.xml';
	      var options = { key: KEY };

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req);
	    }
	    /**
	     * getReview
	     *
	     * @access public
	     * @param {string} id review ID
	     * @param {number} page optional page of results
	     * @returns {promise} returns review if successful
	     */
	    function getReview(id, page) {
	      if (!id) return Promise.reject(wrongParamsError('getReview()', 'reviewID'));

	      var path = URL + '/review/show.xml';
	      var options = { id: id, page: page, key: KEY };

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req);
	    }
	    /**
	     * getUsersReviewForBook
	     *
	     * @access public
	     * @param {string} user_id user ID
	     * @param {string} book_id book ID
	     * @returns {promise} returns given users review for the given book
	     */
	    function getUsersReviewForBook(user_id, book_id) {
	      var fn_name = 'getUsersReviewForBooks()';

	      if (!user_id) return Promise.reject(wrongParamsError(fn_name, 'userID'));
	      if (!book_id) return Promise.reject(wrongParamsError(fn_name, 'bookID'));

	      var path = URL + '/review/show_by_user_and_book.xml';
	      var options = { user_id: user_id, book_id: book_id, key: KEY };

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req);
	    }
	    /**
	     * getById
	     *
	     * @access public
	     * @param {string} id user status ID
	     * @returns {promise} returns status if successful
	     */
	    function getUserStatus(id) {
	      if (!id) return Promise.reject(wrongParamsError('getUserStatus()', 'userID'));

	      var path = URL + '/user_status/show/' + id;
	      var options = { key: KEY, format: 'xml' };

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req);
	    }
	    /**
	     * getRecentStatuses
	     *
	     * @access public
	     * @returns {promise} returns recents statuses if successful
	     */
	    function getRecentStatuses() {
	      var path = URL + '/user_status/index.xml';

	      var req = baseRequest.builder().withPath(path).build();

	      return _execute(get$$1, req, 'updates');
	    }
	    /**
	     * search
	     *
	     * @access public
	     * @param {object} params q: query, page: page of results, field: one of 'title', 'author' or 'all' (default)
	     * @returns {promise} returns search results if successful
	     */
	    function searchBooks(params) {
	      var path = URL + '/search/index.xml';
	      var options = _extends({ key: KEY }, params);

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req);
	    }
	    /**
	     * searchAuthors
	     *
	     * @access public
	     * @param {string} authorName author name to search for
	     * @returns {promise} returns author object if successful
	     */
	    function searchAuthors(authorName) {
	      if (!authorName) return Promise.reject(wrongParamsError('searchAuthors()', 'userID'));

	      var path = URL + '/api/author_url/' + authorName;
	      var options = { key: KEY };

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req);
	    }
	    /**
	     * showBook
	     *
	     * @access public
	     * @param {string} bookID the bookID to search for
	     * @returns {promise} returns book
	     */
	    function showBook(bookId) {
	      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      var fn_name = 'showBook()';

	      if (!bookId) return Promise.reject(wrongParamsError(fn_name, 'bookID'));

	      var path = URL + '/book/show.xml';
	      var options = _extends({
	        format: 'xml',
	        id: bookId,
	        key: KEY
	      }, params);
	      var authOptions = _getAuthOptions();

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req);
	    }
	    /**
	     * bookIDToWorkID
	     *
	     * @access public
	     * @param {string} bookID to get work ids for
	     * @returns {promise} returns work IDs without any markup
	     */
	    function bookIDToWorkID(bookID) {
	      if (!bookID) return Promise.reject(wrongParamsError('bookIDToWorkID()', 'bookID'));

	      var path = URL + '/book/id_to_work_id/' + bookID;
	      var options = { key: KEY };

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req);
	    }
	    /**
	     * getSeries
	     *
	     * @access public
	     * @param {string} seriesID series ID
	     * @returns {promise} returns Info on a series
	     *
	     */
	    function getSeries(seriesID) {
	      if (!seriesID) return Promise.reject(wrongParamsError('getSeries()', 'seriesID'));

	      var path = URL + '/series/show/' + seriesID;
	      var options = {
	        format: 'xml',
	        key: KEY
	      };

	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req);
	    }
	    /**
	     * getSeriesByWork
	     *
	     * @access public
	     * @param {string} workID work ID
	     * @returns {promise} returns list of all series a work is in
	     */
	    function getSeriesByWork(workID) {
	      if (!workID) return Promise.reject(wrongParamsError('getSeriesByWork()', 'workID'));

	      var path = URL + '/work/' + workID + '/series';
	      var options = {
	        format: 'xml',
	        key: KEY
	      };
	      var req = baseRequest.builder().withPath(path).withQueryParams(options).build();

	      return _execute(get$$1, req);
	    }
	    /**
	     * getCurrentUserInfo
	     *
	     * @access public
	     * @returns {promise}
	     */
	    function getCurrentUserInfo() {
	      var fn_name = 'getCurrentUserInfo()';
	      if (!OAUTHENTICATED) return Promise.reject(noOAuthError(fn_name));

	      var path = URL + '/api/auth_user';
	      var authOptions = _getAuthOptions();
	      var req = baseRequest.builder().withPath(path).withOAuth(authOptions).build();

	      return _execute(oAuthGet, req);
	    }
	    return {
	      initOAuth: initOAuth,
	      getRequestToken: getRequestToken,
	      getAccessToken: getAccessToken,
	      _setOAuthToken: _setOAuthToken,
	      _setAccessToken: _setAccessToken,
	      _execute: _execute,
	      _setOAuth: _setOAuth,
	      getBooksByAuthor: getBooksByAuthor,
	      getAuthorInfo: getAuthorInfo,
	      getAllSeriesByAuthor: getAllSeriesByAuthor,
	      getCurrentUserInfo: getCurrentUserInfo,
	      getRecentStatuses: getRecentStatuses,
	      getBooksOnUserShelf: getBooksOnUserShelf,
	      getUsersReviewForBook: getUsersReviewForBook,
	      getUserStatus: getUserStatus,
	      getUserInfo: getUserInfo,
	      getUsersShelves: getUsersShelves,
	      getRecentReviews: getRecentReviews,
	      getUsersGroups: getUsersGroups,
	      getGroupInfo: getGroupInfo,
	      getGroupMembers: getGroupMembers,
	      getReview: getReview,
	      addBookToShelf: addBookToShelf,
	      getOwnedBooks: getOwnedBooks,
	      searchBooks: searchBooks,
	      searchAuthors: searchAuthors,
	      followAuthor: followAuthor,
	      unfollowAuthor: unfollowAuthor,
	      showFollowing: showFollowing,
	      showBook: showBook,
	      getUserFollowings: getUserFollowings,
	      bookIDToWorkID: bookIDToWorkID,
	      getSeriesByWork: getSeriesByWork,
	      getSeries: getSeries
	    };
	  };

	  module.exports = exports = Goodreads;
	});

	var src = createCommonjsModule(function (module, exports) {
	  module.exports = exports = goodreadsApi;
	});

	return src;

})));
