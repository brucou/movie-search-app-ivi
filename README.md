# Motivation
This repository showcases the use of state machines to modelize user interfaces. The chosen 
technologies are :
 - [hyperscript](https://github.com/localvoid/ivi/tree/master/packages/ivi-html) for describing the screens of the interface in a portable way
 - [ivi](https://github.com/localvoid/ivi) for rendering
 - [state-transducer](https://github.com/brucou/state-transducer) as state machine library
 - web components in order to have a reusable and portable implementation
 
Portability was important as the underlying idea is to port this application into many different
front-end frameworks. So far, implementation exists for :
  - [inferno](https://github.com/brucou/movie-search-app-inferno)
  - [nerv](https://github.com/brucou/movie-search-app-nerv)
  - [react](https://codesandbox.io/s/kwn3lx2qx7)
  - [svelte](https://github.com/brucou/movie-search-app-svelte)

# Installation and execution
The application is built with parcel. To run it :

`npm install`

`npm run start`

Alternatively, you can peruse the [codesandbox](https://codesandbox.io/s/3x9x5v4kq5).

# State machine
The state machine modelizing the search application is as follows :

![](movie%20search%20good%20fsm%20corrected%20flowchart%20no%20emphasis%20switchMap.png)

# Notes
17K minified gzip. Probably can be brought down through better config... and substituting json 
patch (that is 3KB gzipped) for a mere function
