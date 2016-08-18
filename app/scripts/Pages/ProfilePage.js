import React from 'react';
import { browserHistory } from 'react-router';

import store from '../store';
import Nav from '../Components/Nav';
import ProfileInfo from '../Components/ProfileInfo';

export default React.createClass({
  getInitialState: function() {
      return {
        session: store.session.toJSON(),
        editProfile: false,
      }
  },
  editProfile: function() {
    store.session.set('isEditing', true);
  },
  gotToSettings: function() {
    browserHistory.push('settings');
  },
  updateState: function() {
    this.setState({session: store.session.toJSON()});
  },
  componentWillMount: function() {
    store.session.on('change', this.updateState);
    // console.log(store.session.apiGeoLocation());
  },
  componentWillUnmount: function() {
    store.session.off('change', this.updateState);
  },
  render: function() {
    // console.log(this.state.session);

    let sessionNav;
    if (this.state.session.username === this.props.params.userId) {
      sessionNav = (
        <ul className="nav-session">
          <li>
            <button className="edit-btn" onClick={this.editProfile}>edit <i className="fa fa-pencil" aria-hidden="true"></i></button>
          </li>
          <li>
            <button className="settings-btn" onClick={this.goToSettings}>settings <i className="fa fa-cog" aria-hidden="true"></i></button>
          </li>
        </ul>
      );
    }

    let profileInfo;
    if (this.state.editProfile) {
      profileInfo = <ProfileInfo user={this.state.session} state="editing" />
    } else {
      profileInfo = <ProfileInfo user={this.state.session} state="viewing" />
    }
    // console.log(this.state.session);
    return (
      <div className="profile-component">
        <Nav />
        <header className="profile-header">
          {sessionNav}
          {profileInfo}

          <div className="like-user">
            <button className="like-btn"><i className="icon-heart fa fa-heart-o" aria-hidden="true"></i></button>
          </div>
        </header>

        <form className="profile-footer">
          <ul className="ul-recent-places">
            <li>Barton Springs, 2 hours ago</li>
            <li>Town Lake, 5 days ago</li>
            <li>Random park, random time ago</li>
          </ul>
        </form>
      </div>
    );
  }
});
