const templateHTML = await (await fetch('templates/stok.html')).text();

export default {
  template: templateHTML,

  props: [
    'daftarUpbjj', 'daftarKategori', 'upbjj', 'kategori', 'limit', 
    'sortBy', 'order', 'stokList', 'editForm', 'editItem', 
    'toggleForm', 'formTambah', 'submitTambah', 'saveUpdate', 'resetFilter'
  ],
  
  emits: [
    'update:upbjj', 'update:kategori', 'update:limit', 'update:sortBy', 'update:order'
  ]
}