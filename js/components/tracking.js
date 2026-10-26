const templateHTML = await (await fetch('templates/tracking.html')).text();

export default {
  template: templateHTML,

  props: [
    'simpanDataTracking',
    'daftarTracking', 'kodePaket', 'paket', 'isiPaket', 'daftarUpbjj'
  ],
  
  emits: [
    'update:kodePaket'
  ]
}