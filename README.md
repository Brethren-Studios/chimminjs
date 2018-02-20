# chimminjs #

ChimminJS was developed at Brethren Studios as a performant client-side library for UI management on their landing pages.

A simple library for DOM manipulation and HTTP requests, ChimminJS is very lightweight and features a familiar, tidy API.

1. Do not use ChimminJS as a framework for a complicated UI.
2. Do use ChimminJS on your simple pages to get a lot for a little.

## Getting It ##

Using a content delivery network (CDN) URL to embed ChimminJS directly on your HTML page:

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/chimmin.js/0.0.0/chim.min.js"></script>
```

The Source

*Download `src/`.*



## Basic Useage Example ##

ChimminJS is perfect for simple pages with a single main element--like a form, simple interface, etc.

### DOM Manipulation ###
```
<body>
  <div>
    <input styles="opacity:0"/>
    <button id="find-song" />
    <button id="cool-song" />
  </div>
</body>
```

```javascript
const input = document.getElementsByTagName('input');

input.applyCss('opacity', '1'); // opacity = 1;

input.onKeyup((el) => {
  console.log('User input detected.');
});
```

### AJAX Requests ###
```javascript
const getBtn = document.getElementsById('find-song');
const postBtn = document.getElementsById('cool-song');

// wait for submit
getBtn.onClick((e) => {
  // add request params as an object or querystring
  ajax.get('/that-one-song', { song: 'Africa by Toto' }, (response) => {
    // do whatever you want
  });
});

postBtn.onClick((e) => {
 ajax.post('/check-it-out', { song: 'Replay by Iyaz' }, (response) => {
  // do whatever you want
 });
});
```

## License ##
This content is released under the (http://opensource.org/licenses/MIT) MIT License.

