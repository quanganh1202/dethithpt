import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
// import navigation from '../../_nav';
// routes config
// import routes from '../../routes';
import DefaultAside from './DefaultAside';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';

import User from 'containers/User/Loadable';
import Document from 'containers/Documents/Loadable';
import Category from 'containers/Category/Loadable';
import CategoryCreate from 'containers/CategoryCreate/Loadable';
import Class from 'containers/Class/Loadable';
import ClassCreate from 'containers/ClassCreate/Loadable';
import Subject from 'containers/Subject/Loadable';
import SubjectCreate from 'containers/SubjectCreate/Loadable';
// import School from 'containers/School/Loadable';
// import SchoolCreate from 'containers/SchoolCreate/Loadable';
import Collection from 'containers/Collection/Loadable';
import CollectionCreate from 'containers/CollectionCreate/Loadable';
import { getUser, setToken } from 'services/auth';

class DefaultLayout extends Component {
  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader user={getUser()} setToken={setToken} />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            {/* <AppSidebarNav navConfig={{ item: [] }} {...this.props} /> */}
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            {/* <AppBreadcrumb appRoutes={routes}/> */}
            <Switch>
              {/* {routes.map((route, idx) => {
                  return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                      <route.component {...props} />
                    )} />)
                    : (null);
                },
              )} */}
              {/* <Route path="/" exact name="Home" component={() => <div>abc</div>} /> */}
              <Route path="/dashboard" exact name="Dashboard" component={() => <div>Dashboard</div>} />
              <Route path="/users" exact name="User" component={User} />
              <Route path="/documents" exact name="Document" component={Document} />
              <Route path="/categories" exact name="Category" component={Category} />
              <Route path="/categories/create" exact name="Create category" component={CategoryCreate} />
              <Route path="/classes" exact name="Class" component={Class} />
              <Route path="/classes/create" exact name="Create class" component={ClassCreate} />
              <Route path="/subjects" exact name="Subject" component={Subject} />
              <Route path="/subjects/create" exact name="Create subject" component={SubjectCreate} />
              {/* <Route path="/schools" exact name="School" component={School} />
              <Route path="/schools/create" exact name="Create school" component={SchoolCreate} /> */}
              <Route path="/collections" exact name="Collection" component={Collection} />
              <Route path="/collections/create" exact name="Create collection" component={CollectionCreate} />
              <Redirect from="/" to="/dashboard" />
            </Switch>
          </main>
          <AppAside fixed hidden>
            <DefaultAside />
          </AppAside>
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
