# Procrastinator
A reusable form component for those who believe _"there's always tomorrow."_

Built with VanillaJS, HTML5, and CSS3.

## Take it on a Test Run:
```
git clone https://github.com/Yoonis/Procrastinator.git
```
Open the [Procrastinator.html](Procrastinator.html) file locally in your browser and have fun!

Check the Network tab on DevTools to confirm a successful POST of form data.

## Features:
- Create n number of reusable forms on a single page, based on n instances of a given CSS selector on the page
- Add form input on: 
  1. click of the **+** button
  2. press of the **Enter** key
- Delete form input on click of the **-** button
- Prevent: 
  1. empty input addition
  2. empty form submission
- Display success/error notices to the user. Customize notices by:
  1. message content
  2. message styling
- Submitted form data is converted to an array before an AJAX POST request

## Configuration Options
In [Procrastinator.html](Procrastinator.html):

1. Add a DOM element anywhere in the body.

2. Give the element a CSS selector.

3. In the createForm script:
  ```html
  <script>
    createForm('.myList', 'http://httpbin.org/post');
  </script>
  ```
  * Replace the 1st argument with your selector
  * Replace the 2nd argument with the URL you would like the form to POST to

## Additional Documentation
- For methods: see comments in [Procrastinator.js](js/Procrastinator.js)
- For styling: see comments in [default.css](stylesheets/default.css)

#### Questions, constructive feedback, and contributions welcomed!
