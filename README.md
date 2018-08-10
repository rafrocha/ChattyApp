# Chatty App

A responsive, React chat application that communicates with clients via Web sockets. Built with React, Node.js, Express, and HTML/CSS/SASS with Bootstrap.

## Screen shots

!["Screenshot of new user Peter joining chat"](https://github.com/rafrocha/ChattyApp/blob/master/build/UsersLoggedin.png?raw=true)
!["Screenshot of chat through peter's screen"](https://github.com/rafrocha/ChattyApp/blob/master/build/FirstUsers.png?raw=true)
!["Screenshot of Vegas leaving the chat :("](https://github.com/rafrocha/ChattyApp/blob/master/build/LeftChat.png?raw=true)
!["Screenshot of new user list updated. Raf is alone in the chat :/"](https://github.com/rafrocha/ChattyApp/blob/master/build/New-UserList.png?raw=true)

## Installing

Install the dependencies and start the server.

```
npm install
npm start
open http://localhost:3000
```

#### Static Files

You can store static files like images, fonts, etc in the `build` folder.

For example, if you copy a file called my_image.png into the build folder you can access it using `http://localhost:3000/build/my_image.png`.

#### Linting

This boilerplate project includes React ESLint configuration.

```
npm run lint
```

#### Dependencies

* React
* Webpack
* [babel-loader](https://github.com/babel/babel-loader)
* [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
* Babel
* Nodemon


## Built with

- [React - JSX](https://reactjs.org/docs/jsx-in-depth.html) - React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.
Fundamentally, JSX just provides syntactic sugar for the React.createElement(component, props, ...children) function
- [Bootstrap](http://getbootstrap.com/) - Extensive list of components and  Bundled Javascript plugins.
- [Node.js](https://nodejs.org/en/about/) - As an asynchronous event driven JavaScript runtime, Node is designed to build scalable network applications.





