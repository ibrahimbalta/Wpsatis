import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Sector {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

interface SectorContextType {
  currentSector: Sector | null;
  setCurrentSector: (sector: Sector) => void;
  availableSectors: Sector[];
  isLoading: boolean;
}

const SectorContext = createContext<SectorContextType | undefined>(undefined);

export const SectorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availableSectors, setAvailableSectors] = useState<Sector[]>([]);
  const [currentSector, setCurrentSector] = useState<Sector | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mocking initial data fetch
    const sectors: Sector[] = [
      {
        id: '1',
        name: 'Seramik & İnşaat',
        slug: 'seramik',
        icon: 'Box',
        description: 'Seramik, fayans ve inşaat malzemeleri satış yönetimi.'
      },
      {
        id: '2',
        name: 'Oto Galeri',
        slug: 'oto-galeri',
        icon: 'Car',
        description: 'Araç satış, takas ve teknik bilgi paylaşımı.'
      },
      {
        id: '3',
        name: 'Mobilya',
        slug: 'mobilya',
        icon: 'Armchair',
        description: 'Mobilya, dekorasyon ve sipariş takibi.'
      },
      {
        id: '4',
        name: 'Kuaför & Güzellik',
        slug: 'kuafor',
        icon: 'Scissors',
        description: 'Randevu onayları ve hizmet bilgilendirmeleri.'
      },
      {
        id: '5',
        name: 'Emlak & Portföy',
        slug: 'emlak',
        icon: 'Home',
        description: 'Gayrimenkul portföyü, randevu ve teklif yönetimi.'
      },
      {
        id: '6',
        name: 'Otel & Konaklama',
        slug: 'otel',
        icon: 'Hotel',
        description: 'Rezervasyon onayları, oda seçenekleri ve konuk bilgilendirme.'
      },
      {
        id: '7',
        name: 'E-Ticaret & Perakende',
        slug: 'e-ticaret',
        icon: 'ShoppingBag',
        description: 'Sipariş takibi, stok bilgisi ve kampanya duyuruları.'
      },
      {
        id: '8',
        name: 'Sağlık & Klinik',
        slug: 'saglik',
        icon: 'Stethoscope',
        description: 'Hasta randevuları, tahlil sonuçları ve hatırlatmalar.'
      },
      {
        id: '9',
        name: 'Eğitim & Kurslar',
        slug: 'egitim',
        icon: 'GraduationCap',
        description: 'Kurs kayıtları, ders programları ve sınav sonuçları.'
      },
      {
        id: '10',
        name: 'Hukuk & Danışmanlık',
        slug: 'hukuk',
        icon: 'Scale',
        description: 'Dava takibi, randevu ve belge bilgilendirmeleri.'
      },
      {
        id: '11',
        name: 'Restoran & Cafe',
        slug: 'restoran',
        icon: 'Utensils',
        description: 'Rezervasyon, paket servis ve menü paylaşımı.'
      },
      {
        id: '12',
        name: 'Spor & Gym',
        slug: 'spor',
        icon: 'Dumbbell',
        description: 'Üyelik takibi, ders programları ve beslenme önerileri.'
      },
      {
        id: '13',
        name: 'Lojistik & Nakliye',
        slug: 'lojistik',
        icon: 'Truck',
        description: 'Sevkiyat takibi, teslimat onayı ve teklif yönetimi.'
      },
      {
        id: '14',
        name: 'Pet Shop & Veteriner',
        slug: 'pet',
        icon: 'Dog',
        description: 'Aşı hatırlatmaları, mama siparişi ve randevu takibi.'
      },
      {
        id: '15',
        name: 'Yazılım & Bilişim',
        slug: 'yazilim',
        icon: 'Code',
        description: 'Teknik destek, proje durum raporları ve lisans takibi.'
      }
    ];

    setAvailableSectors(sectors);
    // Default to Ceramics for now
    setCurrentSector(sectors[0]);
    setIsLoading(false);
  }, []);

  return (
    <SectorContext.Provider value={{ currentSector, setCurrentSector, availableSectors, isLoading }}>
      {children}
    </SectorContext.Provider>
  );
};

export const useSector = () => {
  const context = useContext(SectorContext);
  if (context === undefined) {
    throw new Error('useSector must be used within a SectorProvider');
  }
  return context;
};
