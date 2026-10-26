const { createApp, ref, watch, computed } = Vue;

const app = createApp({
  
  setup() {

    // state view
    const view = ref('')
    const editForm = ref(null);
    const formTambah = ref(false)

    // filter
    const daftarUpbjj = ref('')
    const upbjj = ref('')
    const daftarKategori = ref('')
    const kategori = ref('');
    // limit
    const limit = ref('')
    // sort
    const sortBy = ref('judul')
    // order
    const order = ref('asc')

    // stok
    const stok = ref('')

    // tracking
    const pengirimanList = ref('')
    const tracking = ref('')
    const daftarTracking = ref('')
    const paket = ref('')
    const kodePaket = ref('')
    const isiPaket = ref('')

    watch(kodePaket, (value) => {
      isiPaket.value = paket.value.find(x => x.kode === value)
    })
    
    const getData = async () => {
      const response = await fetch('data/dataBahanAjar.json');
      const json = await response.json()
      stok.value = json.stok
      daftarUpbjj.value = json.upbjjList
      daftarKategori.value = json.kategoriList
      tracking.value = json.tracking
      daftarTracking.value = json.tracking
      pengirimanList.value = json.pengirimanList
      paket.value = json.paket
      console.log(json)
    }
    getData()

    // FILTER
    // pantau perubahan nilai pada form filter
    watch([upbjj, kategori, limit, sortBy, order], (newValues, oldValues) => {
      // Kita object destruction disini
      const [upbjjNew, kategoriNew, limitNew, sortByNew, orderNew] = newValues;
      const [upbjjOld, kategoriOld, limitOld, sortByOld, orderOld] = oldValues;
      // kita log perubahan agar debugnya enak
      console.log('\n\n⚡ Terjadi perubahan data!');
      console.log(`
====== PERUBAHAN FILTER ======
UPBJJ    : ${upbjjOld} → ${upbjjNew}
Kategori : ${kategoriOld} → ${kategoriNew}
Limit    : ${limitOld} → ${limitNew}
Sort By  : ${sortByOld} → ${sortByNew}
Order    : ${orderOld} → ${orderNew}
==============================
      `);
    });

    const stokList = computed(() => {
      // 1. Ambil data segar dari masterStok
      let data = [...stok.value];

      // 2. Filter berdasarkan UPBJJ jika ada pilihannya
      if (upbjj.value) {
        data = data.filter(item => item.upbjj === upbjj.value);
      }

      // 3. Filter berdasarkan Kategori
      if (kategori.value) {
        data = data.filter(item => item.kategori === kategori.value);
      }

      // 4. Batasi jumlah tampilan jika ada limit
      if (limit.value !== '' && !isNaN(limit.value)) {
        data = data.filter(item => item.qty <= limit.value);
      }

      // 5. Proses filter dan sorting
      data.sort((a, b) => {
        let nilaiA = a[sortBy.value];
        let nilaiB = b[sortBy.value];

        if (nilaiA === undefined || nilaiB === undefined) return 0;

        if (typeof nilaiA === 'string') {
          return order.value === 'asc' 
            ? nilaiA.toLowerCase().localeCompare(nilaiB.toLowerCase()) 
            : nilaiB.toLowerCase().localeCompare(nilaiA.toLowerCase());
        }
        return order.value === 'asc' ? nilaiA - nilaiB : nilaiB - nilaiA;
      });

      // 6. Langsung kembalikan datanya (return)
      return data;
    });

    /**
     * 
     * STOK
     * 
     */
    const handleView = (value) => {
      if (!value)
        return view.value = ''
      if (['stok','tracking'].includes(value)) {
        view.value = value
      }
    }

    // mencegah perubahan form agar tidak langsung masuk ke state
    const editItem = (item) => {
      console.log(item)
      editForm.value = item ? { ...item } : null;
    };

    const toggleForm = () => {
      formTambah.value = !formTambah.value
      console.log('toggleForm()')
    }

    const submitTambah = (event) => {
      const f = new FormData(event.target)
      const kode = f.get('kode')
      const judul = f.get('judul')
      const kategori = f.get('kategori')
      const upbjj = f.get('upbjj')
      const qty = f.get('qty')
      const safety = f.get('safety')
      const harga = f.get('harga')
      const lokasiRak = f.get('lokasiRak')
      const catatanHTML = f.get('catatanHTML')

      // validasi kode jangan sama
      const duplikat = stok.value.findIndex(x => x.kode == kode)
      if (duplikat >= 0) {
        return alert("Kode sudah digunakan")
      }
      stok.value = [...stok.value, {
        kode, judul, kategori, upbjj, qty, safety, harga, lokasiRak, catatanHTML
      }]
      console.log(`INI FUNGSI SUBMIT TAMBAH`)
      console.log({
        kode, judul, kategori, upbjj, qty, safety, harga, lokasiRak, catatanHTML
      })
      formTambah.value = false
    }

    // memasukkkan nilai form ke data stok
    const saveUpdate = () => {
      if (!editForm.value) return;

      // validasi data
      const {
        kode, judul, qty, safety, harga, lokasiRak
      } = editForm.value
      if (!judul || judul.length < 3) {
        return alert("Tentukan judul minimal 3 karakter")
      }
      if (Number(qty) < 0) {
        return alert("Minimal input jumlah adalah 0")
      }
      if (Number(safety) < 0) {
        return alert("Minimal input safety adalah 0")
      }
      if (Number(harga) < 0) {
        return alert("Minimal input harga adalah 0")
      }
      if (!lokasiRak || lokasiRak.length < 3) {
        return alert("Tentukan lokasi Rak minimal 3 karakter")
      }

      // 1. Cari index di dalam masterStok.value berdasar [kode]
      const indexMaster = stok.value.findIndex(x => x.kode === editForm.value.kode);
      
      if (indexMaster !== -1) {
        // 2. Ubah data berdasar index yang ditemukan
        stok.value[indexMaster] = { ...editForm.value };
        
        // 3. Update stockList agar browser merender ulang perubahan
        stokList.value = [...stok.value]
        
        // 4. Hapus nilai editForm
        editForm.value = null;
        console.log('Data berhasil diperbarui!');
      } else {
        console.error('Data tidak ditemukan di master stok!');
      }
    };

    // mengembalikan hasil filter
    const resetFilter = () => {
      console.log(`\n\n⚡ Reset filter`)
      upbjj.value = ''
      kategori.value = ''
      limit.value = ''
      sortBy.value = 'judul'
      order.value = 'asc'
    }

    watch(kodePaket, (value) => {
      isiPaket.value = paket.value.find(x => x.kode === value)
      console.log(value)
    })

    /**
     * 
     * TRACKING
     * 
     */
    const simpanDataTracking = (event) => {
      const formElement = event.target
      const formData = new FormData(formElement)
      // 1
      const nomorDo = `DO${new Date().getFullYear()}-${String(daftarTracking.value.length + 1).padStart(4, '0')}`
      // 2
      const tanggal = formData.get('tanggal')
      // 3
      const nim = formData.get('nim')
      // 4
      const nama = formData.get('nama')
      // 5
      const ekspedisi = formData.get('ekspedisi')

      const isiPaket = paket.value.find(x => x.kode === kodePaket.value)
      if (!isiPaket) {
        return alert("paket tidak ditemukan")
      }
      const harga = isiPaket.harga

      const dataBaru = {
        [nomorDo]: { // Menggunakan [nomorDo] agar variabel string menjadi nama KEY objek
          nim: nim,
          nama: nama,
          status: "Dalam Perjalanan", // Status awal default
          ekspedisi: ekspedisi,
          tanggalKirim: tanggal,
          paket: isiPaket.kode,
          total: harga,
          perjalanan: [
            {
              waktu: new Date().toISOString().replace('T', ' ').substring(0, 19), // Waktu saat ini (YYYY-MM-DD HH:mm:ss)
              keterangan: `Penerimaan di Loket: ${ekspedisi.split(' - ')[1] || 'Pusat'}`
            }
          ]
        }
      }
      daftarTracking.value = [...daftarTracking.value, dataBaru]
      alert("Data berhasil ditambahkan")
    }

    return {
      view, // ubah view stok atau tracking
      
      // filter
      daftarUpbjj,
      upbjj,
      daftarKategori,
      kategori,
      limit,
      sortBy,
      order,
      resetFilter,

      // STOK
      stok,
      stokList,
      handleView,
      editForm,
      editItem,
      toggleForm,
      formTambah,
      submitTambah,
      saveUpdate,

      // TRACKING,
      daftarTracking,
      kodePaket,
      paket,
      isiPaket,
      simpanDataTracking
    }
    
  }

})

import FileStok from './components/stock.js';
app.component('komponen-stok', FileStok);

import FileTracking from './components/tracking.js';
app.component('komponen-tracking', FileTracking);

app.mount('#app');