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
    const stokList = ref([...stok]);
    const editForm = ref(null);

    // pantau perubahan nilai pada form filter
    watch([upbjj, kategori, limit, sortBy, order], (newValues, oldValues) => {
      // Kita object destruction disini
      const [upbjjNew, kategoriNew, limitNew, sortByNew, orderNew] = newValues;
      const [upbjjOld, kategoriOld, limitOld, sortByOld, orderOld] = oldValues;
      // kita log perubahan agar debugnya enak
      console.log('Terjadi perubahan data!');
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

    const applyFilter = () => {
      // 1. Ambil data segar dari file master data (stok) agar data lama tidak hilang
      let data = [...masterStok.value];
      console.log({
        upbjj: upbjj.value,
        kategori: kategori.value,
        sortBy: sortBy.value,
        order: order.value,
        limit: limit.value,
        dataLength: masterStok.value.length
      })

      // 2. Ambil nilai dari state UPBJJ dan lakukan penyaringan
      if (upbjj.value) {
        data = data.filter(item => item.upbjj === upbjj.value);
        console.log(`Filter berdasar UPBJJ : ${upbjj.value}`)
        console.log({dataLength: data.length})
      }

      // 3. Ambil nilai dari state Kategori dan lakukan penyaringan
      if (kategori.value) {
        data = data.filter(item => item.kategori === kategori.value);
        console.log(`Filter berdasar KATEGORI : ${kategori.value}`)
        console.log({dataLength: data.length})
      }

      // 4. Proses sorting berdasarkan state sortBy dan order saat ini
      data.sort((a, b) => {
        let nilaiA = a[sortBy.value];
        let nilaiB = b[sortBy.value];

        // Antisipasi jika properti tidak ditemukan
        if (nilaiA === undefined || nilaiB === undefined) return 0;

        // Jika tipe data teks/string (seperti judul)
        if (typeof nilaiA === 'string') {
          return order.value === 'asc' 
            ? nilaiA.toLowerCase().localeCompare(nilaiB.toLowerCase()) 
            : nilaiB.toLowerCase().localeCompare(nilaiA.toLowerCase());
        }
        console.log(`Filter berdasar ORDER : ${order.value}`)
        console.log({dataLength: data.length})

        // Jika tipe data angka (seperti qty atau harga)
        return order.value === 'asc' ? nilaiA - nilaiB : nilaiB - nilaiA;
      });

      // 5. Batasi jumlah tampilan berdasarkan state limit
      if (limit.value !== '' && limit.value <= 0) {
        data = data.filter(item => item.qty <= limit.value);
        console.log(`Filter berdasar LIMIT : ${limit.value}`)
        console.log({dataLength: data.length})
      }

      // 6. Masukkan hasil akhir penyeleksian ke state utama yang di-render oleh HTML tabel
      stokList.value = data;
    }

    const resetFilter = () => {
      stokList.value = [...masterStok.value]
    }

    const editItem = (item) => {
      editForm.value = item ? { ...item } : null;
    };

   const saveUpdate = () => {
      if (!editForm.value) return;

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

    return {
      daftarUpbjj,
      daftarKategori,
      upbjj, kategori,
      limit,
      sortBy,
      order,
      stokList,
      editForm,
      applyFilter,
      resetFilter,
      editItem,
      saveUpdate,
    };
  }
}).mount('#app');