export interface Template {
  id: string;
  sectorId: string;
  category: string;
  title: string;
  body: string;
}

export const mockTemplates: Template[] = [
  // Seramik & İnşaat
  {
    id: 's1',
    sectorId: '1',
    category: 'Selamlama',
    title: 'Yeni Müşteri Karşılama',
    body: 'Merhaba! Ben [İsim], [Mağaza İsmi] seramik bölümünden. Projeniz için size nasıl yardımcı olabilirim? İsterseniz güncel kataloğumuzu gönderebilirim.'
  },
  {
    id: 's2',
    sectorId: '1',
    category: 'Fiyatlandırma',
    title: 'm2 Fiyat Bilgisi',
    body: 'Sorduğunuz ürünün m2 fiyatı {{price}} TL\'dir. Stoklarımızda mevcuttur. Kaç m2 ihtiyacınız olduğunu belirtirseniz toplam tutarı hesaplayabilirim.'
  },
  {
    id: 's3',
    sectorId: '1',
    category: 'Takip',
    title: 'Teklif Sonrası Takip',
    body: 'Merhaba [Müşteri İsmi], ilettiğimiz seramik teklifi ile ilgili bir karar verebildiniz mi? Yardımcı olabileceğim bir konu var mı?'
  },

  // Oto Galeri
  {
    id: 'o1',
    sectorId: '2',
    category: 'Bilgilendirme',
    title: 'Araç Teknik Bilgi',
    body: 'İlgilendiğiniz {{vehicle}} model aracımız {{kilometers}} km\'dedir. Boya/değişen bilgisi: [Bilgi]. Test sürüşü için ne zaman müsait olursunuz?'
  },
  {
    id: 'o2',
    sectorId: '2',
    category: 'Takas',
    title: 'Takas Değerlendirme',
    body: 'Aracınızın detaylarını, km bilgisini ve fotoğraflarını paylaşırsanız ön bir takas fiyatı belirleyebiliriz. Bekliyoruz.'
  },

  // Mobilya
  {
    id: 'm1',
    sectorId: '3',
    category: 'Sipariş',
    title: 'Teslimat Süresi',
    body: 'Siparişini verdiğiniz {{product}} için tahmini teslimat süremiz {{days}} iş günüdür. Hazırlık aşamalarını buradan takip edebilirsiniz.'
  },
  {
    id: 'm2',
    sectorId: '3',
    category: 'Bakım',
    title: 'Mobilya Bakım Önerisi',
    body: 'Yeni mobilyalarınızı iyi günlerde kullanın! Ahşap yüzeylerin uzun ömürlü olması için yalnızca hafif nemli bez kullanmanızı öneririz.'
  },

  // Emlak
  {
    id: 'e1',
    sectorId: '5',
    category: 'Portföy',
    title: 'Gayrimenkul Sunumu',
    body: 'İlgilendiğiniz {{property}} ilanımızın detayları, fotoğrafları ve teknik bilgileri ekte yer almaktadır. Randevu oluşturmak ister misiniz?'
  },
  {
    id: 'e2',
    sectorId: '5',
    category: 'Randevu',
    title: 'Portföy Gezisi Onayı',
    body: 'Merhaba, {{date}} saat {{time}} için planladığımız portföy gezimiz onaylanmıştır. Buluşma noktamız: [Konum Linki]'
  },

  // Otel
  {
    id: 'h1',
    sectorId: '6',
    category: 'Rezervasyon',
    title: 'Konaklama Onayı',
    body: 'Sayın {{name}}, {{checkin}} - {{checkout}} tarihlerindeki rezervasyonunuz başarıyla alınmıştır. Transfer talebiniz var mı?'
  },
  {
    id: 'h2',
    sectorId: '6',
    category: 'Karşılama',
    title: 'Otel Giriş Bilgisi',
    body: 'Otelimize hoş geldiniz! Oda numaranız: {{room}}. Wi-Fi şifresi: [Sifre]. Spa ve restoran saatleri için buradayım.'
  },

  // E-Ticaret
  {
    id: 'et1',
    sectorId: '7',
    category: 'Sipariş',
    title: 'Sipariş Onayı',
    body: 'Merhaba {{name}}, {{order_id}} numaralı siparişiniz başarıyla alındı! Ürünleriniz hazırlanıyor, kargoya verildiğinde sizi bilgilendireceğiz.'
  },
  {
    id: 'et2',
    sectorId: '7',
    category: 'Kargo',
    title: 'Kargo Takip',
    body: 'Müjde! {{order_id}} numaralı siparişiniz kargoya verildi. Takip numaranız: {{tracking_id}}. Buradan takip edebilirsiniz: [Link]'
  },

  // Sağlık
  {
    id: 's1',
    sectorId: '8',
    category: 'Randevu',
    title: 'Randevu Hatırlatma',
    body: 'Sayın {{name}}, {{date}} tarihindeki randevunuzu hatırlatmak amacıyla mesaj atıyoruz. Gelmeme durumunda lütfen bilgi veriniz.'
  },
  {
    id: 's2',
    sectorId: '8',
    category: 'Sonuç',
    title: 'Tahlil Sonucu Bilgisi',
    body: 'Merhaba, tahlil sonuçlarınız çıktı. Doktorumuz ile görüşmek için bugün saat 16:00\'ya kadar müsaitseniz randevu oluşturabiliriz.'
  },

  // Eğitim
  {
    id: 'ed1',
    sectorId: '9',
    category: 'Kayıt',
    title: 'Kurs Kayıt Onayı',
    body: 'Tebrikler {{name}}! {{course}} kursuna kaydınız tamamlandı. İlk dersimiz {{start_date}} tarihinde başlayacaktır. Başarılar dileriz!'
  },
  {
    id: 'ed2',
    sectorId: '9',
    category: 'Sınav',
    title: 'Sınav Sonucu İlani',
    body: '{{exam}} sınav sonuçları açıklandı! Notunuzu öğrenmek ve rehberlik görüşmesi planlamak için panelimizi ziyaret edebilirsiniz.'
  },

  // Hukuk
  {
    id: 'l1',
    sectorId: '10',
    category: 'Bilgi',
    title: 'Dava Durum Güncellemesi',
    body: 'Sayın {{client}}, {{case_no}} numaralı dosyanız ile ilgili yeni bir gelişme bulunmaktadır. Müsait olduğunuzda görüşebilir miyiz?'
  },

  // Restoran
  {
    id: 'r1',
    sectorId: '11',
    category: 'Rezervasyon',
    title: 'Masa Onayı',
    body: 'Merhaba, {{date}} saat {{time}} için {{people}} kişilik rezervasyonunuz onaylanmıştır. Sizi ağırlamak için sabırsızlanıyoruz!'
  },

  // Spor
  {
    id: 'sp1',
    sectorId: '12',
    category: 'Üyelik',
    title: 'Üyelik Yenileme',
    body: 'Merhaba {{name}}, spor salonu üyeliğinizin sona ermesine {{days}} gün kaldı. Erken yenileme fırsatlarından yararlanmak ister misiniz?'
  },

  // Lojistik
  {
    id: 'log1',
    sectorId: '13',
    category: 'Teslimat',
    title: 'Teslimat Onayı',
    body: '{{shipment_id}} numaralı gönderiniz başarıyla teslim edilmiştir. Bizi tercih ettiğiniz için teşekkür ederiz!'
  },

  // Pet
  {
    id: 'pet1',
    sectorId: '14',
    category: 'Sağlık',
    title: 'Aşı Hatırlatma',
    body: 'Merhaba, sevimli dostumuz {{pet_name}}\'in aşı zamanı geldi. Randevu oluşturmak için bize yazabilirsiniz.'
  },

  // Yazılım
  {
    id: 'it1',
    sectorId: '15',
    category: 'Destek',
    title: 'Destek Talebi Çözüldü',
    body: 'Bildirdiğiniz teknik sorun uzman ekibimizce çözülmüştür. {{ticket_id}} numaralı talebinizi kapatıyoruz. Başka bir sorunuz var mı?'
  }
];
