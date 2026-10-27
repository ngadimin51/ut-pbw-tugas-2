const templateHTML = await (await fetch('templates/notification.html')).text();

export default {
  template: templateHTML,
  props: [
    'title', 'message', 'footer', 'type', 'close',
    'closeNotification', 'toggleNotification'
  ]
}