import Backbone from 'backbone';
import $ from 'jQuery';
import OAuth from '../OAuth';

import PlaceModel from '../Models/PlaceModel';

const PlacesCollection = Backbone.Collection.extend({
  model: PlaceModel,
  url: `https://api.yelp.com/v2/search`,
  getDistance: function() {

  },
  getResults: function(city, query, range, coordinates){
    return new Promise((resolve, reject) => {
      let cll;
      if (city) {
        city = city;
      } else if (coordinates.length) {
        cll = `${coordinates[0]},${coordinates[1]}`;
      }

      if (range) {
        range = range * 1600;
      } else {
        range = 8 * 1600;
      }

      this.reset();
      let auth = {
        consumerKey : "HfA_mwIcjg6t1Lb2PlHySA",
        consumerSecret : "8MyGFZlP7O3P8p1vJyHq01PhN-I",
        accessToken : "zkaRpuCSk881suZ9K2sAqUfUuMt9lFjC",
        accessTokenSecret : "8UZDaDsfuOnJHAHgct1nKj21UMg",
        serviceProvider : {
            signatureMethod : "HMAC-SHA1",
        },
      };
      let terms = 'dogs allowed, ' + query;
      let near = city;
      let sort = 2;
      let radiusFilter = range;
      let accessor = {
          consumerSecret : auth.consumerSecret,
          tokenSecret : auth.accessTokenSecret,
      };

      let parameters = [];

      if (city) {
        parameters.push(['location', near]);
      } else {
        parameters.push(['ll', cll]);
      }
      parameters.push(['term', terms]);
      parameters.push(['sort', sort]);
      parameters.push(['radius_filter', radiusFilter]);
      parameters.push(['callback', 'cb']);
      parameters.push(['oauth_consumer_key', auth.consumerKey]);
      parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
      parameters.push(['oauth_token', auth.accessToken]);
      parameters.push(['oauth_signature_method', 'HMAC-SHA1']);


      let message = {
          'action' : 'https://api.yelp.com/v2/search',
          'method' : 'GET',
          'parameters' : parameters,
      };

      OAuth.setTimestampAndNonce(message);
      OAuth.SignatureMethod.sign(message, accessor);
      let parameterMap = OAuth.getParameterMap(message.parameters);
      $.ajax({
          'url' : message.action,
          'data' : parameterMap,
          'dataType' : 'jsonp',
          // 'jsonpCallback' : 'cb',
          'cache': true,
      }).then((places) => {
        // console.log('YELP DATA: ', places);
        let placeList =  places.businesses.map((place) => {
          let imageUrl = place.image_url.replace('ms', 'l');
          return {
            name: place.name,
            yelpRating: place.rating,
            yelpRatingStars: place.rating_img_url,
            yelpMobileUrl: place.mobile_url,
            yelpID: place.id,
            categories: place.categories,
            imageUrl: imageUrl,
            snippetImageUrl: place.snippet_image_url,
            snippetText: place.snippet_text,
            ll: place.location.coordinate,
            address: place.location.display_address,
            neighborhoods: place.location.neighborhoods,
            isClosed: place.is_closed,
            reviewCount: place.review_count,
          }
        });
        this.add(placeList)
        resolve();

      })
      .fail(function(e) {
        console.error('FAILED TO GET YELP DATA: ', e)
        reject();
      });
    })
  },
  getYelpResult: function(yelpID, city) {
    this.reset();
    let auth = {
      consumerKey : "HfA_mwIcjg6t1Lb2PlHySA",
      consumerSecret : "8MyGFZlP7O3P8p1vJyHq01PhN-I",
      accessToken : "zkaRpuCSk881suZ9K2sAqUfUuMt9lFjC",
      accessTokenSecret : "8UZDaDsfuOnJHAHgct1nKj21UMg",
      serviceProvider : {
          signatureMethod : "HMAC-SHA1",
      },
    };

    let near = city;
    let accessor = {
        consumerSecret : auth.consumerSecret,
        tokenSecret : auth.accessTokenSecret,
    };

    let parameters = [];
    parameters.push(['location', near]);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

    let message = {
        'action' : `https://api.yelp.com/v2/business/${yelpID}`,
        'method' : 'GET',
        'parameters' : parameters,
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    let parameterMap = OAuth.getParameterMap(message.parameters);

    $.ajax({
        'url' : message.action,
        'data' : parameterMap,
        'dataType' : 'jsonp',
        // 'jsonp': 'cb',
        // 'jsonpCallback' : 'cb',
        'cache': true,
    }).then((place) => {
      let imageUrl = place.image_url.replace('ms', 'l');
      // console.log('YELP DATA: ', place);
        this.add({
          name: place.name,
          yelpRating: place.rating,
          yelpRatingStars: place.rating_img_url,
          yelpMobileUrl: place.mobile_url,
          yelpID: place.id,
          categories: place.categories,
          imageUrl: imageUrl,
          snippetImageUrl: place.snippet_image_url,
          snippetText: place.snippet_text,
          ll: place.location.coordinate,
          address: place.location.display_address,
          neighborhoods: place.location.neighborhoods,
          isClosed: place.is_closed,
          reviewCount: place.review_count,
        });

    })
    .fail(function(e) {
      console.error('FAILED TO GET YELP DATA: ', arguments)
    });
  },

});

export default PlacesCollection;
