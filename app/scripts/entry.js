import React from 'react';
import ReactDOM from 'react-dom';
import GoogleMap from 'google-map-react';
import { browserHistory } from 'react-router';
import $ from 'jquery';

import router from './router';
import store from './store';

$(document).ajaxSend(function(e, xhrAjax, jqueryAjax) {
  if (jqueryAjax.url.indexOf('kinvey') !== -1) {
    if (localStorage.authtoken) {
      xhrAjax.setRequestHeader('Authorization', `Kinvey ${localStorage.authtoken}`);
    } else {
      browserHistory.push('/');
      xhrAjax.setRequestHeader('Authorization', `Basic ${store.settings.basicAuth}`);
    }
  }
});

if (localStorage.authtoken) {
  store.session.retrieve();
}
store.session.apiGeoLocation();


ReactDOM.render(router, document.getElementById('container'));
