import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    /* font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; */
  }

  body.fontLoaded {
    /* font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; */
  }

  #app {
    background-color: #efefef;
    min-height: 100%;
    min-width: 100%;
  }

  // p,
  // label {
  //   font-family: Georgia, Times, 'Times New Roman', serif;
  //   line-height: 1.5em;
  // }
  span.red {
    color: red;
  }
  span.bold {
    font-weight: bold;
  }
  span.green {
    color: green;
  }

  // Override default core-ui styles
  .sidebar {
    .nav > .nav-item > a {
      font-weight: bold;
    }
    .nav-item {
      &.nav-dropdown > .nav-dropdown-items {
        > li > a {
          padding-left: 1rem;
        }
      }
    }
  }
  .sidebar-nav.scrollbar-container {
    .nav-item {
      &.nav-dropdown > .nav-dropdown-items {
        > li > a {
          padding-left: 2.5rem;
        }
      }
    }
  }
`;
