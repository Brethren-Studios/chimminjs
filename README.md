# chimminJS #

ChimminJS was developed at Brethren Studios as a performant client-side library for UI management on their landing pages.

A simple library for DOM manipulation and HTTP requests, chimminJS is very lightweight and features a familiar, tidy API.

1. Do not use chimminJS as a framework for a complicated UI.
2. Do use chimminJS on your simple pages to get a lot for a little.

## Getting It ##

Use a content delivery network (CDN) URL to embed chimminJS directly on your HTML page:
// production-ready, minified version
```
<script src="https://d27ilbh7v6ssec.cloudfront.net/0.0.3/chim.min.js"></script>
```
// developer-friendly, debug version
```
<script src="https://d27ilbh7v6ssec.cloudfront.net/0.0.3/chimmin.js"></script>
```

Download the source:

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
const input = chim('input'); // init chim element with selector

input.applyCss('opacity', '1'); // apply CSS to element

input.onKeyup((el) => { // handle events
  console.log('User input detected.');
});
```

### AJAX Requests ###
```javascript
const getBtn = chim('#find-song');
const postBtn = chim('#cool-song');

getBtn.onClick((e) => {
  // add request params as an object or querystring
  chim.go.get('/that-one-song', { song: 'Africa by Toto' }, (response) => {
    // do whatever you want
  });
});

postBtn.onClick((e) => {
 chim.go.post('/check-it-out', { song: 'Replay by Iyaz' }, (response) => {
  // do whatever you want
 });
});
```

## License ##
This content is released under the (http://opensource.org/licenses/MIT) MIT License.

