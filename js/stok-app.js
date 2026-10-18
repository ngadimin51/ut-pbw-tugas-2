// kita gunakan :
// createApp untuk menjalankan vue
// ref untuk mereferensikan data dari dummy
// watch untuk memantau perubahan
// computed untuk melakukan perubahan data
const { createApp, ref, watch, computed } = Vue;

createApp({
  setup() {
    // load upbjjList
    const daftarUpbjj = ref([...upbjjList])
    const upbjj = ref('');
    // load upbjjList
    const daftarKategori = ref([...kategoriList])
    const kategori = ref('');
    // limit
    const limit = ref('')
    // sort
    const sortBy = ref('judul')
    // order
    const order = ref('asc')
    // Membaca stok langsung dari file dataBahanAjar.js secara global
    const masterStok = ref([...stok]);  // yang ini untuk diubah-ubah karena tidak pakai database
    // const stokList = ref([...stok]);
    // untuk menyimpan nilai form sementara
    const editForm = ref(null);
    const formTambah = ref(false)

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

    // Gantilah variabel stokList manual dan fungsi applyFilter Anda dengan ini:
    const stokList = computed(() => {
      // 1. Ambil data segar dari masterStok
      let data = [...masterStok.value];

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


    // mengembalikan hasil filter
    const resetFilter = () => {
      console.log(`\n\n⚡ Reset filter`)
      upbjj.value = ''
      kategori.value = ''
      limit.value = ''
      sortBy.value = 'judul'
      order.value = 'asc'
    }

    // mencegah perubahan form agar tidak langsung masuk ke state
    const editItem = (item) => {
      console.log(item)
      editForm.value = item ? { ...item } : null;
    };

    // memasukkkan nilai form ke data masterStok
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
      const indexMaster = masterStok.value.findIndex(x => x.kode === editForm.value.kode);
      
      if (indexMaster !== -1) {
        // 2. Ubah data berdasar index yang ditemukan
        masterStok.value[indexMaster] = { ...editForm.value };
        
        // 3. Update stockList agar browser merender ulang perubahan
        stokList.value = [...masterStok.value]
        
        // 4. Hapus nilai editForm
        editForm.value = null;
        console.log('Data berhasil diperbarui!');
      } else {
        console.error('Data tidak ditemukan di master stok!');
      }
    };

    const toggleForm = () => {
      formTambah.value = !formTambah.value
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
      const duplikat = masterStok.value.findIndex(x => x.kode == kode)
      if (duplikat >= 0) {
        return alert("Kode sudah digunakan")
      }
      masterStok.value = [...masterStok.value, {
        kode, judul, kategori, upbjj, qty, safety, harga, lokasiRak, catatanHTML
      }]
      console.log(`INI FUNGSI SUBMIT TAMBAH`)
      console.log({
        kode, judul, kategori, upbjj, qty, safety, harga, lokasiRak, catatanHTML
      })
      formTambah.value = false
    }

    // kirim ke frontend (client)
    return {
      daftarUpbjj,
      daftarKategori,
      upbjj, kategori,
      limit,
      sortBy,
      order,
      stokList,
      editForm,
      formTambah,
      resetFilter,
      editItem,
      saveUpdate,
      toggleForm,
      submitTambah
    };
  }
}).mount('#app');