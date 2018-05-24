# chimminJS #

ChimminJS was developed at Brethren Studios as a performant client-side library for UI management on their landing pages.

A simple library for DOM manipulation and HTTP requests, chimminJS is very lightweight and features a familiar, tidy API.

1. Do not use chimminJS as a framework for a complicated UI.
2. Do use chimminJS on your simple pages to get a lot for a little.

## Getting It ##

Use a content delivery network (CDN) URL to embed chimminJS directly on your HTML page:
```
/* production-ready, minified version */
<script src="https://d27ilbh7v6ssec.cloudfront.net/0.0.6/chim.min.js"></script>
```
```
/* developer-friendly, debug version */
<script src="https://d27ilbh7v6ssec.cloudfront.net/0.0.6/chimmin.js"></script>
```

Download the source:

*Download `src/`.*

## Basic Useage Example ##

ChimminJS is perfect for simple pages with a single main element--like a form, simple interface, etc.

### DOM Manipulation ###
```
<body>
  <div>
    <input style="opacity:0">
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
  chim.go.get('/that-one-song', (response) => {
    console.log(response); // { title: 'Africa', artist: 'Toto' }
  });
});

postBtn.onClick((e) => {
  // add data to request as object, array, or query string
  chim.go.post('/add-to-playlist', { song: 'Replay by Iyaz' }, (response) => {
    console.log(response); // 'Song added to playlist!'
  });
});
```

## Compatibility ##

The source is compiled into ES5 with [Babel](https://babeljs.io/), making it (mostly) compatible with all major browsers. Browser compatibility is an ongoing battle, so please report any issues you experience!

## Issues ##

If there are any issues with this library, please open a ticket. If there are any changes you'd like to contribute to this library, open a pull request. We here at Brethren Studios pride ourselves on responding to the needs of the open source community.

## License ##
This content is released under the (http://opensource.org/licenses/MIT) MIT License.

