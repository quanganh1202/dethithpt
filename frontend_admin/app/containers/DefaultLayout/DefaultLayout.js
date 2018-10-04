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
import navigation from './leftNav';
// routes config
// import routes from '../../routes';
import DefaultAside from './DefaultAside';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';

import User from 'containers/User/Loadable';
import UserEdit from 'containers/UserEdit/Loadable';
import Document from 'containers/Documents/Loadable';
import DocumentEdit from 'containers/DocumentEdit/Loadable';
import Category from 'containers/Category/Loadable';
import CategoryCreate from 'containers/CategoryCreate/Loadable';
import CategoryEdit from 'containers/CategoryEdit/Loadable';
import Class from 'containers/Class/Loadable';
import ClassCreate from 'containers/ClassCreate/Loadable';
import ClassEdit from 'containers/ClassEdit/Loadable';
import Subject from 'containers/Subject/Loadable';
import SubjectCreate from 'containers/SubjectCreate/Loadable';
import SubjectEdit from 'containers/SubjectEdit/Loadable';
// import School from 'containers/School/Loadable';
// import SchoolCreate from 'containers/SchoolCreate/Loadable';
import Collection from 'containers/Collection/Loadable';
import CollectionCreate from 'containers/CollectionCreate/Loadable';
import CollectionEdit from 'containers/CollectionEdit/Loadable';
import News from 'containers/News/Loadable';
import NewsCreate from 'containers/NewsCreate/Loadable';
import NewsEdit from 'containers/NewsEdit/Loadable';
import { getUser, setToken } from 'services/auth';

class DefaultLayout extends Component {
  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader user={getUser()} setToken={setToken} />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed>
            <AppSidebarHeader />
            <AppSidebarForm />
            <AppSidebarNav navConfig={navigation} {...this.props} />
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
              <Route path="/users/:id" exact name="Edit user" component={UserEdit} />
              <Route path="/documents" exact name="Document" component={Document} />
              <Route path="/documents/:id" exact name="Edit document" component={DocumentEdit} />
              <Route path="/categories" exact name="Category" component={Category} />
              <Route path="/categories/create" exact name="Create category" component={CategoryCreate} />
              <Route path="/categories/:id" exact name="Edit category" component={CategoryEdit} />
              <Route path="/classes" exact name="Class" component={Class} />
              <Route path="/classes/create" exact name="Create class" component={ClassCreate} />
              <Route path="/classes/:id" exact name="Edit class" component={ClassEdit} />
              <Route path="/subjects" exact name="Subject" component={Subject} />
              <Route path="/subjects/create" exact name="Create subject" component={SubjectCreate} />
              <Route path="/subjects/:id" exact name="Edit subject" component={SubjectEdit} />
              {/* <Route path="/schools" exact name="School" component={School} />
              <Route path="/schools/create" exact name="Create school" component={SchoolCreate} /> */}
              <Route path="/collections" exact name="Collection" component={Collection} />
              <Route path="/collections/create" exact name="Create collection" component={CollectionCreate} />
              <Route path="/collections/:id" exact name="Edit collection" component={CollectionEdit} />
              <Route path="/modules/news" exact name="News" component={News} />
              <Route path="/modules/news/create" exact name="Create news" component={NewsCreate} />
              <Route path="/modules/news/:id" exact name="Edit news" component={NewsEdit} />
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
