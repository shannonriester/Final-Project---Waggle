import React from 'react';

import store from '../store';
import Nav from '../Components/Nav';

export default React.createClass({
  getInitialState: function() {
      return {
        session: store.session.get('username'),
      }
  },
  updateState: function() {
    this.setState({session: store.session.get('username')});
  },
  componentWillMount: function() {
    store.session.get('username');
    console.log(this.state.session);
    store.session.on('change update', this.updateState)
    console.log(store.session.apiGeoLocation());
  },
  render: function() {
    let sessionNav;
    if (store.session.get('username') === this.props.params.userId) {
      sessionNav = (
        <ul className="nav-session">
          <li>
            <button className="edit-btn">edit <i className="fa fa-pencil" aria-hidden="true"></i></button>
          </li>
          <li>
            <button className="settings-btn">settings <i className="fa fa-cog" aria-hidden="true"></i></button>
          </li>
        </ul>
      );
    }
    return (
      <div className="profile-component">
        <Nav />

        <header className="profile-header">
          <figure className="profile-pic"></figure>
          {sessionNav}
        </header>

        <main className="profile-main">
          <div className="profile-about-data">
            <ul className="ul-about-data">
              <li>Shannon, 28</li>
              <li>Auggie, 4</li>
              <li>Austin, 3 miles away</li>
            </ul>
            <div className="like-user">
              <button className="like-btn"><i className="icon-heart fa fa-heart-o" aria-hidden="true"></i></button>
            </div>
          </div>
          <p className="about-bio">
            Hi I'm shannon and I like puppies and my dog is SO cute! His name is Auggie and he's a German-shepherd!
          </p>
        </main>

        <footer className="profile-footer">
          <ul className="ul-recent-places">
            <li>Barton Springs, 2 hours ago</li>
            <li>Town Lake, 5 days ago</li>
            <li>Random park, random time ago</li>
          </ul>
        </footer>
      </div>
    );
  }
});