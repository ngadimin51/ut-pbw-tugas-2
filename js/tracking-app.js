// kita gunakan :
// createApp untuk menjalankan vue
// ref untuk mereferensikan data dari dummy
// watch untuk memantau perubahan
// computed untuk melakukan perubahan data
const { createApp, ref, watch, computed } = Vue;

createApp({
  setup() {

    const daftarTracking = ref([tracking])
    const kodePaket = ref('')
    const isiPaket = ref('')

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

      const isiPaket = paket.find(x => x.kode === kodePaket.value)
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
    }

    watch(kodePaket, (value) => {
      isiPaket.value = paket.find(x => x.kode === value)
    })

    return {
      daftarTracking: daftarTracking,
      paket: paket,
      pengirimanList: pengirimanList,
      upbjjList: upbjjList,

      kodePaket,
      isiPaket,

      simpanDataTracking
    }
  }
}).mount('#app')