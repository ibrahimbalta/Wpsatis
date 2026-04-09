export interface Product {
  id: string;
  sectorId: string;
  category: string;
  name: string;
  price: number;
  description: string;
  imageLabel: string;
}

export const mockProducts: Product[] = [
  // Seramik
  {
    id: 'p1',
    sectorId: '1',
    category: 'Yer Karosu',
    name: 'Antrasit Mat Seramik',
    price: 450,
    description: '60x60 cm, aşınmaya dayanıklı modern mat yüzey.',
    imageLabel: 'CERAMIC'
  },
  {
    id: 'p2',
    sectorId: '1',
    category: 'Duvar Karosu',
    name: 'Beyaz Metro Fayans',
    price: 380,
    description: '10x20 cm, parlak mutfak ve banyo seramiği.',
    imageLabel: 'TILE'
  },

  // Oto Galeri
  {
    id: 'p3',
    sectorId: '2',
    category: 'Sedan',
    name: '2022 Comfort Line',
    price: 1250000,
    description: 'Otomatik vites, düşük km, hatasız boyasız.',
    imageLabel: 'CAR'
  },

  // Mobilya
  {
    id: 'p4',
    sectorId: '3',
    category: 'Koltuk Takımı',
    name: 'Chesterfield Köşe',
    price: 45000,
    description: 'Leke tutmaz kumaş, özel tasarım ahşap ayaklar.',
    imageLabel: 'SOFA'
  },

  // Emlak
  {
    id: 'p5',
    sectorId: '5',
    category: 'Konut',
    name: '3+1 Deniz Manzaralı Daire',
    price: 8500000,
    description: 'Ebeveyn banyolu, geniş balkonlu ve akıllı ev sistemli.',
    imageLabel: 'HOME'
  },
  {
    id: 'p6',
    sectorId: '5',
    category: 'Villa',
    name: 'Müstakil Havuzlu Villa',
    price: 25000000,
    description: '500m2 bahçe içinde, lüks mimari ve 5+2 oda.',
    imageLabel: 'VILLA'
  },

  // Otel
  {
    id: 'p7',
    sectorId: '6',
    category: 'Oda',
    name: 'Deluxe Suite',
    price: 3500,
    description: 'King size yatak, jakuzi ve şehir manzaralı.',
    imageLabel: 'HOTEL'
  },
  {
    id: 'p8',
    sectorId: '6',
    category: 'Oda',
    name: 'Standart Çift Kişilik',
    price: 1800,
    description: 'Modern tasarım, ücretsiz mini bar ve kahvaltı dahil.',
    imageLabel: 'BED'
  },

  // E-Ticaret
  {
    id: 'p9',
    sectorId: '7',
    category: 'Elektronik',
    name: 'Kablosuz Kulaklık',
    price: 1250,
    description: 'Aktif gürültü engelleme ve 30 saat pil ömrü.',
    imageLabel: 'TECH'
  },

  // Sağlık
  {
    id: 'p10',
    sectorId: '8',
    category: 'Hizmet',
    name: 'Diş Beyazlatma',
    price: 2500,
    description: 'Lazer destekli, tek seansta hızlı sonuç.',
    imageLabel: 'HEALTH'
  },

  // Eğitim
  {
    id: 'p11',
    sectorId: '9',
    category: 'Kurs',
    name: 'A1 İngilizce Paketi',
    price: 4500,
    description: '6 ay erişim, 20 canlı ders ve materyal dahil.',
    imageLabel: 'BOOK'
  },

  // Hukuk
  {
    id: 'p12',
    sectorId: '10',
    category: 'Danışmanlık',
    name: 'Hukuki Danışmanlık (1 Saat)',
    price: 1500,
    description: 'Uzman avukatlarımızdan online veya yüz yüze danışmanlık.',
    imageLabel: 'LAW'
  },

  // Restoran
  {
    id: 'p13',
    sectorId: '11',
    category: 'Menü',
    name: 'Şefin Özel Menüsü',
    price: 650,
    description: 'Başlangıç, ana yemek ve tatlıdan oluşan gurme deneyim.',
    imageLabel: 'FOOD'
  },

  // Spor
  {
    id: 'p14',
    sectorId: '12',
    category: 'Üyelik',
    name: 'Yıllık Gold Üyelik',
    price: 8500,
    description: 'Havuz, fitness ve tüm grup derslerine sınırsız erişim.',
    imageLabel: 'GYM'
  },

  // Lojistik
  {
    id: 'p15',
    sectorId: '13',
    category: 'Taşıma',
    name: 'Evden Eve Nakliye',
    price: 12000,
    description: 'Sigortalı, paketlemeli profesyonel taşımacılık hizmeti.',
    imageLabel: 'TRUCK'
  },

  // Pet
  {
    id: 'p16',
    sectorId: '14',
    category: 'Ürün',
    name: 'Premium Kedi Maması 10kg',
    price: 1450,
    description: 'Tahılsız, yüksek proteinli ve vitamin destekli.',
    imageLabel: 'DOG'
  },

  // Yazılım
  {
    id: 'p17',
    sectorId: '15',
    category: 'Yazılım',
    name: 'Cloud E-Ticaret Lisansı',
    price: 15000,
    description: 'Yıllık lisans, hosting ve teknik destek dahil.',
    imageLabel: 'CODE'
  }
];
