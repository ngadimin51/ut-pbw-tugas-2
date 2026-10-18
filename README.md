# Video Youtube
    https://www.youtube.com/watch?v=5aqh_74Nqf4
  
# Soal Tugas

Anda diminta untuk membuat sebuah aplikasi website sederhana untuk pemesanan Bahan Ajar di Universitas Terbuka. Pada Tugas Praktik Kedua ini, mahasiswa berfokus untuk membuat aplikasi website berbasis Vue.js sebagai framework yang digunakan sepanjang pengerjaan Tugas Praktik 2. Sehingga, data-data yang dibutuhkan tidak dibaca melalui database, tapi melalui js file sebagai dummy data yang akan dilampirkan bersamaan dengan Tugas Praktik ini.

Buatlah Dua Halaman Website yang perlu dikembangkan sebagai berikut:

## 1. Halaman Stok Bahan Ajar

- Halaman ini menampilkan daftar stok bahan ajar untuk seluruh UT daerah (silakan bebas menggunakan table/list/bentuk lain yang menampilkan list data dalam jumlah banyak dan memiliki data-data field). Teman-teman mahasiswa perlu menampilkan daftar stok bahan ajar yang terdiri dari kolom data field sebagai berikut:
  - Kode Mata Kuliah/Nama Mata Kuliah → kode, judul
  - Kategori Mata Kuliah → Kategori
  - UT-Daerah → upbjj
  - Lokasi Rak → lokasiRak
  - Jumlah Stok Bahan Ajar → qty
  - Jumlah Stok Safety Bahan Ajar → safety
  - Status
  - Catatan → catatanHTML
- Terdapat Fitur untuk mengedit stok data bahan ajar
- Terdapat fitur untuk melakukan filter dan sort data stock (silakan bebas menggunakan elemen select/radio/checkbox)
  - Terdapat filter stok berdasarkan:
    - ‘UT-Daerah’: terdiri pilihan dari seluruh UT-daerah, dan daftar setiap UT-daerah (upbjjList)
    - ‘Kategori Mata Kuliah’ (upbjjList)
  - Terdapat filter yang hanya menampilkan jumlah stock (qty) < dari jumlah safety stock (safety) dan jumlah stock = 0 untuk menjadi daftar yang dapat mengingatkan untuk melakukan re-order bahan ajar.
  - Terdapat fitur sort yang mengurutkan berdasarkan judul, stock, dan harga
  - Fitur filter dapat di-set ulang (reset)
  - Terapkan fitur di vue.js di mana di semua filter tidak perlu recompute kembali.
  - Implementasikan dependent options seperti misalkan ketika memilih filter stok berdasarkan ‘UT-daerah’, baru akan memunculkan filter untuk ‘Kategori Mata Kuliah’
- Menampilkan status dari stok bahan ajar
  - Memberikan status ‘Aman' dengan menggunakan simbol yang memberikan tanda yang memberikan kesan ‘aman’ ataupun teks berwarna hijau apabila stok >= safety stock
  - Memberikan status ‘Menipis’ dengan menggunakan simbol yang memberikan kesan adanya ‘warning’ ataupun teks berwarna orange apabila stok < safety stock.
  - Memberikan status ‘Kosong’ dengan menggunakan simbol yang memberikan kesan adanya ‘bahaya’ ataupun teks berwarna merah apabila stok = 0
- Terdapat Fitur untuk menambahkan data bahan ajar baru melalui formulir kecil dan melakukan validasi sederhana untuk setiap data field.

## 2. Tracking Delivery Order (DO)

- Halaman ini menampilkan halaman untuk tracking status pengiriman DO bahan ajar seperti pada Tugas Praktik 1, tetapi di sini perlu menerapkan penggunaan framework Vue.js.
- Terdapat fitur untuk menambahkan input delivery order yang baru. Berikut adalah data field yang perlu diisi:
  - Nomor DO, di mana tergenerate otomatis. Penomorannya terdiri dari:
    - DO
    - Tahun Berjalan
    - Sequence Number
    Misal:
    DO2025-001 untuk data awal. Selanjutnya jika sudah ada data tracking terbaru, menjadi DO2025-002 dst.
  - NIM, diisi secara manual oleh pengguna
  - Nama, diisi secara manual oleh pengguna
  - Ekspedisi (JNE Regular/JNE Express), dipilih oleh pengguna berdasarkan data pada upbjjList
  - Paket Bahan Ajar, dipilih oleh pengguna berdasarkan data pada paket
    - Gunakan elemen `<select>` dan menampilkan di halaman web informasi kode paket dan nama paket
    - Setelah memilih paket, akan muncul detail isi paket bahan ajar tersebut di bawah elemen `<select>` untuk memberikan informasi
  - Tanggal Kirim, dapat diisi manual ataupun menggunakan fungsi Date untuk mengambil local time.
  - Total Harga, diambil dari data pada Array of Objects paket → harga

## Struktur Proyek

Struktur proyek Vue.js pada Tugas Praktik ini yang disarankan adalah sebagai berikut:

```text
/tugas2-vue-ut/
├─ index.html ← Menampilkan navigasi menu ke 2 halaman web lain: stok.html dan tracking.html
├─ stok.html ← Halaman 1: Stok Bahan Ajar (WAJIB)
├─ tracking.html ← Halaman 2: Tracking DO (WAJIB)
├─ css/
│  └─ style.css ← CSS ringan (opsional)
└─ js/
   ├─ stok-app.js ← logika Vue utk stok.html
   └─ tracking-app.js ← logika Vue utk tracking.html
```

Untuk memudahkan teman-teman mahasiswa dalam pengerjaan Tugas Praktik 2, lampiran file dummy data (file dataBahanAjar.js) yang dilampirkan bersamaan dengan file ini, menjadi template atau acuan yang yang dapat digunakan pada masing-masing file stok-app.js dan tracking-app.js
