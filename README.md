node-webkit-desktop-notification
=======
see [this](https://github.com/edjafarov/node-webkit-desktop-notification/issues/2#issuecomment-56260958) first.

This is proper desktop notifications for [node-webkit](https://github.com/rogerwang/node-webkit).

Idea behind is to create drop-in replacement for html5 desktop notifications. Giving though richer and [better](http://screencast.com/t/bUxB6vNvW8BN) experience.

Use the lib in your app you need to take 2 files:

```
src/desktopNotification.js
src/desktopNotification.html
```

You need to place them in same folder of your app. Load `desktopNotification.js` to your index.html to use the `DesktopNotification`

```javascript
var notif = new DesktopNotification('Hello', {body: 'World'});
notif.show();
```
check other ways to use `DesktopNotification` in [example](https://github.com/edjafarov/node-webkit-desktop-notification/blob/master/src/index.html).

#### try live

* Fetch the repo.
* npm install
* npm start
* find an app for your OS in build/node-webkit-desktop-notification
* [play](http://screencast.com/t/bUxB6vNvW8BN)

## API

### Class: DesktopNotification(title, options)

Title is the notification's title. Options: body is required.

#### options:

* width: 288 - width
* height: 96 - height
* body - text body for notification
* icon - icon of notification
* ease - ease [function]()
* htmlBody - notification body as HTML
* styles - additional styles to add for notification

### Instance: DesktopNotification

#### methods
* show - show notification
* close - close notification
* on - set up event listener on notification
* off - remove event listener from notification
* emit - emit event on notification

#### properties (html5 Notification compatibility)
* onclick - assign function for click event
* onshow - assign function for show event
* onclose - assign function for close event
* onerror - assign function for error event

#### events

* body.click - if someone clicks on notification
* show - when notification is shown
* close - when notification is closed
* showStart - when notification start showing animation
* closeStart - when notification start closing animation
* error - on error
* close.click - when user clicks on x to close notification

### Customizing notification

You can put design your own beautiful notifications by using `htmlBody` and `styles` options.

Inside in notification window context you have access to `window` object which is EventEmitter. You can emit events inside notification with `window.emit('eventName')` and catch them on `DesktopNotification` instance in your application.

For more details, check [example](https://github.com/edjafarov/node-webkit-desktop-notification/blob/master/src/index.html).


### Easing functions

You can use following ease functions like `DesktopNotification.ease.easeInQuad`, just put it as `ease` option in options.

```
  easeInQuad
  easeOutQuad
  easeInOutQuad
  easeInCubic
  easeOutCubic
  easeInOutCubic
  easeInQuart
  easeOutQuart
  easeInOutQuart
  easeInQuint
  easeOutQuint
  easeInOutQuint
  easeInSine
  easeOutSine
  easeInOutSine
  easeInExpo
  easeOutExpo
  easeInOutExpo
  easeInCirc
  easeOutCirc
  easeInOutCirc
  easeInElastic
  easeOutElastic
  easeInOutElastic
  easeInBack
  easeOutBack
  easeInOutBack
  easeInBounce
  easeOutBounce
``` 
