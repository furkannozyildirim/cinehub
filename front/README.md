# CineHub Frontend

React ve TypeScript ile hazırlanmış CineHub film kataloğu arayüzü. Film verilerini TMDB'den doğrudan değil, CineHub Spring Boot API'sinden alır.

## Teknolojiler

React, TypeScript, Redux Toolkit, Material UI, Axios ve Vite.

## Özellikler

- Film listesi, Top 10, tür filtresi ve sayfalama
- Film adına göre arama ve detay penceresi
- Favorileri tarayıcının `localStorage` alanında saklama
- Yükleniyor ve hata durumlarını gösterme

## Çalıştırma

Önce backend ve PostgreSQL'i çalıştırın. Sonra bu klasörde:

```powershell
npm install
npm run dev
```

Geliştirme sunucusu genellikle `http://localhost:5173` adresinde açılır. Frontend varsayılan olarak `http://localhost:8080/api` backend adresini kullanır. Farklı bir adres için `.env.example` dosyasını `.env` olarak kopyalayıp `VITE_API_BASE_URL` değerini ayarlayın. TMDB anahtarı frontend'de kullanılmaz; anahtar yalnızca backend ortam değişkeninde tutulur.

## Komutlar

```bash
npm run dev
npm run build
npm run lint
npm run preview
```
