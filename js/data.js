/**
 * Data Titik Penukaran Minyak Jelantah, Katalog Produk,
 * dan Indeks Artikel Edukasi EcoClean Buleleng, Bali
 */

const EXCHANGE_LOCATIONS = [
  {
    id: "loc-1",
    name: "Bank Sampah Induk (BSI) Buleleng - Singaraja",
    city: "Buleleng",
    district: "Buleleng Kota",
    address: "Jl. Mayor Metra No. 12, Singaraja",
    lat: -8.1158,
    lng: 115.0934,
    openHours: "Senin - Sabtu: 08:00 - 15:00 WITA",
    phone: "+62 812-3844-5566",
    rewardType: "Uang Tunai",
    rewardRate: "Rp 7.500 / Liter",
    minVolume: "1.0 Liter",
    acceptedOil: "Minyak goreng bekas sawit/kelapa (sudah disaring)",
    packagingRequirement: "Botol plastik bekas air mineral atau jeriken tertutup rapat",
    badge: "Pusat Resmi DLH"
  },
  {
    id: "loc-2",
    name: "Eco-Drop Lovina Coastal Community",
    city: "Buleleng",
    district: "Lovina / Kalibukbuk",
    address: "Jl. Raya Lovina No. 45, Desa Kalibukbuk",
    lat: -8.1610,
    lng: 115.0270,
    openHours: "Setiap Hari: 09:00 - 18:00 WITA",
    phone: "+62 819-3601-2233",
    rewardType: "Poin / Sembako",
    rewardRate: "100 Poin / Liter (Tukar Beras / Minyak Baru)",
    minVolume: "0.5 Liter",
    acceptedOil: "Semua minyak jelantah sisa dapur rumah tangga/resto",
    packagingRequirement: "Wadah plastik bersih dan tertutup",
    badge: "Populer di Lovina"
  },
  {
    id: "loc-3",
    name: "Depo Daur Ulang Mandiri Seririt",
    city: "Buleleng",
    district: "Seririt",
    address: "Jl. Sudirman No. 88, Seririt",
    lat: -8.1930,
    lng: 114.9360,
    openHours: "Senin - Jumat: 08:00 - 16:00 WITA",
    phone: "+62 878-6311-7788",
    rewardType: "Uang Tunai",
    rewardRate: "Rp 8.000 / Liter (Khusus >5 Liter)",
    minVolume: "2.0 Liter",
    acceptedOil: "Minyak jelantah warung makan / katering",
    packagingRequirement: "Jeriken 5L / 10L / 20L",
    badge: "Harga Grosir Terbaik"
  },
  {
    id: "loc-4",
    name: "Posko Konservasi Laut Pantai Penimbangan",
    city: "Buleleng",
    district: "Baktiseraga",
    address: "Kawasan Wisata Pantai Penimbangan, Desa Baktiseraga",
    lat: -8.1285,
    lng: 115.0682,
    openHours: "Jumat - Minggu: 07:00 - 17:00 WITA",
    phone: "+62 852-3900-1122",
    rewardType: "Donasi Lingkungan",
    rewardRate: "Sertifikat Pelestari Penyu & Bar Sabun Jelantah",
    minVolume: "1.0 Liter",
    acceptedOil: "Minyak goreng bekas rumah tangga",
    packagingRequirement: "Botol air mineral bekas",
    badge: "Jaga Laut Buleleng"
  },
  {
    id: "loc-5",
    name: "Bank Sampah Hijau Lestari Sukasada",
    city: "Buleleng",
    district: "Sukasada",
    address: "Jl. Jelantik Gingsir No. 27, Sukasada",
    lat: -8.1500,
    lng: 115.1050,
    openHours: "Senin - Sabtu: 08:30 - 14:00 WITA",
    phone: "+62 813-5322-9900",
    rewardType: "Poin / Sembako",
    rewardRate: "Tukar Sabun Pembersih Lantai Alami / Poin BSI",
    minVolume: "1.0 Liter",
    acceptedOil: "Jelantah bersih tanpa ampas",
    packagingRequirement: "Jeriken kecil atau botol plastik",
    badge: "Tukar Sabun Alami"
  },
  {
    id: "loc-6",
    name: "Sentra Pengumpulan Kubutambahan",
    city: "Buleleng",
    district: "Kubutambahan",
    address: "Jl. Raya Singaraja - Amlapura Km 14, Kubutambahan",
    lat: -8.0820,
    lng: 115.1780,
    openHours: "Senin - Sabtu: 08:00 - 16:30 WITA",
    phone: "+62 821-4755-6677",
    rewardType: "Uang Tunai",
    rewardRate: "Rp 7.000 / Liter",
    minVolume: "1.0 Liter",
    acceptedOil: "Minyak sisa penggorengan dapur",
    packagingRequirement: "Botol plastik bekas tertutup",
    badge: "Melayani Wilayah Timur"
  },
  {
    id: "loc-7",
    name: "Eco-Hub Gerokgak Barat",
    city: "Buleleng",
    district: "Gerokgak",
    address: "Jl. Raya Seririt - Gilimanuk, Gerokgak",
    lat: -8.1880,
    lng: 114.7860,
    openHours: "Senin - Jumat: 09:00 - 16:00 WITA",
    phone: "+62 857-3800-4411",
    rewardType: "Uang Tunai",
    rewardRate: "Rp 7.200 / Liter",
    minVolume: "2.0 Liter",
    acceptedOil: "Minyak goreng nabati sisa dapur",
    packagingRequirement: "Jariken atau botol plastik aman bocor",
    badge: "Wilayah Buleleng Barat"
  }
];

const IMPACT_MULTIPLIERS = {
  waterSavedPerLitre: 1000000,
  co2AvoidedPerLitre: 2.85,
  fatbergMassAvertedPerLitre: 1.25
};

const PRODUCTS = [
  {
    id: "prod-1",
    name: "Sabun Eco (Batang Pembersih Alami)",
    category: "Produk Olahan",
    price: 15000,
    unit: "batang (100g)",
    rating: 4.9,
    badge: "Terlaris",
    image: "assets/images/hero-soap.jpg",
    description: "Sabun pembersih serbaguna hasil daur ulang minyak jelantah dengan aroma serai & jeruk nipis. Sangat efektif membasmi minyak membandel pada piring, panci, lap makan, dan lantai."
  },
  {
    id: "prod-2",
    name: "Soda Api Murni (NaOH Saponifikasi 99%)",
    category: "Bahan Baku",
    price: 25000,
    unit: "toples (500g)",
    rating: 5.0,
    badge: "Grade Laboratorium",
    image: "assets/images/product-naoh.jpg",
    description: "Kristal NaOH murni kualitas saponifikasi khusus pembuatan sabun. Bebas kotoran, reaksi cepat, dilengkapi petunjuk penanganan keselamatan kimia."
  },
  {
    id: "prod-3",
    name: "Aquades Murni (Demineralized Water)",
    category: "Bahan Baku",
    price: 12000,
    unit: "botol (1 Liter)",
    rating: 4.8,
    badge: "Tingkat Kemurnian Tinggi",
    image: "assets/images/product-aquades.jpg",
    description: "Air murni terdemineralisasi bebas logam dan zat kapur (<0.1 µS/cm). Mencegah endapan kapur sehingga larutan lye jernih dan sabun berbusa optimal."
  },
  {
    id: "prod-4",
    name: "Jasa Pengolahan Jelantah ke Sabun",
    category: "Jasa Pembuatan",
    price: 45000,
    unit: "per 5 Liter Jelantah",
    rating: 5.0,
    badge: "Terima Beres",
    image: "assets/images/product-service.jpg",
    description: "Kirim minyak jelantah sisa dapur Anda ke tim EcoClean Buleleng! Kami olah profesional menjadi ~45 batang sabun siap pakai lengkap dengan pemotongan & masa pengeringan curing."
  },
  {
    id: "prod-5",
    name: "Paket Bundling Pemula (Starter Kit Complete)",
    category: "Bundling Hemat",
    price: 95000,
    unit: "paket komplit",
    rating: 5.0,
    badge: "Hemat 25%",
    image: "assets/images/product-starter-kit.jpg",
    description: "Paket bundling praktis berisi: Soda Api 500g + Aquades 1L + Cetakan Silikon Bunga + Kacamata APD + Sarung Tangan Karet + Gratis 1 Sabun Eco & Panduan Cetak Resep."
  }
];

/**
 * Indeks Artikel Edukasi: Dampak Buruk Minyak Jelantah
 * Artikel: static HTML pada halaman tentang-minyak-jelantah.html
 * (id ini wajib sama dengan atribut id pada elemen <article>)
 */
const ARTICLES = [
  {
    id: "art-1",
    category: "Lingkungan",
    icon: "💧",
    readMinutes: 4,
    title: "1 Liter Jelantah Melumpuhkan 1 Juta Liter Air Bersih",
    excerpt: "Minyak tidak larut di air. Sekali menetes ke selokan, ia membentuk lapisan mengapung yang memblokir cahaya matahari, menguras oksigen terlarut, dan perlahan mematikan biota laut pesisir Buleleng."
  },
  {
    id: "art-2",
    category: "Lingkungan",
    icon: "🧱",
    readMinutes: 4,
    title: "Fatberg: Batu Lemak yang Memencingkan Saluran Air",
    excerpt: "Minyak yang tertinggal di gorong-gorong bercampur dengan sisa makanan dan rambut, lalu memadat seperti beton. Saluran tersumbat, air menggenang, dan biaya pembersihan membengkak."
  },
  {
    id: "art-3",
    category: "Lingkungan",
    icon: "🌱",
    readMinutes: 3,
    title: "Tanah dan Sumur Warga yang Tercemar",
    excerpt: "Minyak yang meresap ke tanah menutup pori-pori tanah, mematikan mikroorganisme pengurai, dan meningkatkan risiko kontaminasi sumur air minum di pekarangan rumah."
  },
  {
    id: "art-4",
    category: "Kesehatan",
    icon: "⚠️",
    readMinutes: 5,
    title: "PAH dan Akrolein: Racun Karsinogen dari Oilspan",
    excerpt: "Memanaskan minyak goreng berulang kali merusak rantai kimia lemak dan menghasilkan senyawa berbahaya, mulai dari radikal bebas hingga hidrokarbon aromatik polisiklik."
  },
  {
    id: "art-5",
    category: "Kesehatan",
    icon: "🫀",
    readMinutes: 4,
    title: "Jelantah yang Menguras Hati, Ginjal, dan Jantung",
    excerpt: "Asam lemak teroksidasi memicu plak arterosklerosis, menaikkan tekanan darah, dan membebani organ penyaring racun tubuh jika terus dikonsumsi."
  },
  {
    id: "art-6",
    category: "Mitos",
    icon: "🔍",
    readMinutes: 4,
    title: "Mitos vs Fakta: Bolehkah Minyak Goreng Dipakai Berulang?",
    excerpt: "Banyak mitos beredar tentang minyak goreng bekas. Ini penjelasan sederhana mana yang benar, mana yang keliru, dan apa yang sebaiknya Anda lakukan."
  }
];
