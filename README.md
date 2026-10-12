# CineHub film kataloğu API

Spring Boot REST API; CineHub React arayüzünün kendi PostgreSQL film kataloğuna bağlanması için hazırlanmıştır. Popüler film kayıtları TMDB'nin resmi API'sinden içe aktarılabilir. Film kaydı; başlık, özet, poster/backdrop URL'leri, vizyon tarihi, süre, puan, oy sayısı ve türleri içerir. Türler ayrı bir `genres` tablosunda tutulur; film-tür ilişkisi `movie_genres` ile çoktan-çoğa modellenir.

## Çalıştırma

1. PostgreSQL'de `deneme1_db` veritabanı ve `postgres` kullanıcısının erişimi hazır olmalı.
2. `DB_PASSWORD` ortam değişkenini Windows **Ortam Değişkenleri** ayarlarından kullanıcı değişkeni olarak ekleyin. Böylece IntelliJ Run Configuration silinse bile uygulama parolayı Windows'tan alır. IntelliJ'i değişkeni ekledikten sonra yeniden başlatın.
3. İsteğe bağlı olarak `DB_URL` ve `DB_USERNAME` ortam değişkenleriyle yerel veritabanı adresini ve kullanıcısını değiştirebilirsiniz. Varsayılanlar `jdbc:postgresql://localhost:5432/deneme1_db` ve `postgres` şeklindedir.
4. Yalnızca açık olan PowerShell oturumu için parolayı vermek isterseniz:
   ```powershell
   $env:DB_PASSWORD = "veritabani-parolaniz"
   .\mvnw.cmd spring-boot:run
   ```
   Bu yöntemle başlatılan uygulama aynı PowerShell oturumunda çalışır; IntelliJ'den başlatırken Windows kullanıcı ortam değişkenlerini kullanın.

`DB_PASSWORD` ve `TMDB_API_KEY` değerlerini hiçbir zaman `application.properties` dosyasına veya GitHub'a eklemeyin. Canlı ortamda hosting sağlayıcınızın **Environment Variables / Secrets** ayarlarına `DB_URL`, `DB_USERNAME` ve `DB_PASSWORD` değerlerini girin. TMDB'den içe aktarma özelliğini kullanacaksanız `TMDB_API_KEY` değerini de gizli değişken olarak tanımlayın.

Uygulama `http://localhost:8080` üzerinde çalışır. React geliştirme sunucusu `http://localhost:5173` için `/api/**` CORS erişimi açıktır.

## GitHub ve canlıya alma

Depoyu GitHub'a göndermeden önce `.gitignore` dosyasının `front/.env`, `front/node_modules/`, `front/dist/`, `target/` ve `.idea/` dosyalarını dışarıda tuttuğunu doğrulayın. `DB_PASSWORD`, `TMDB_API_KEY` veya başka gizli değerleri repoya eklemeyin. Daha önce paylaşılmış TMDB anahtarını yenileyin.

Canlı backend için hosting ortam değişkenlerinde `DB_URL` (JDBC PostgreSQL URL'si), `DB_USERNAME`, `DB_PASSWORD` ve `TMDB_API_KEY` tanımlayın. Hosting'in verdiği `PORT` otomatik kullanılır. `CORS_ALLOWED_ORIGINS` değerini frontend'in tam origin adresine ayarlayın (ör. `https://cinehub.example.com`, sondaki `/` olmadan). Birden fazla origin virgülle ayrılabilir. Flyway açılışta veritabanı migration'larını uygular.

Frontend'i Vercel gibi statik site hosting'ine `front` klasörünü root directory olarak bağlayarak yayınlayın. Build komutu `npm run build`, çıktı klasörü `dist` olur. `VITE_API_BASE_URL` değişkenini canlı backend adresi ve `/api` ile ayarlayın (ör. `https://cinehub-api.example.com/api`).

Yayınlamadan önce POST/PUT/DELETE endpoint'lerinin kimlik doğrulama olmadan erişilebilir olduğunu göz önünde bulundurun. Herkese açık demoda yalnızca silinmesi sorun olmayacak örnek veriler kullanın; gerçek kullanıcı/verisi koymayın.

## React CineHub

React projesi `front` klasöründedir. Backend IntelliJ'de çalışırken ayrı bir terminalde:

```powershell
Set-Location front
npm install
npm run dev
```

Vite adresini (`http://localhost:5173`) açın. Frontend varsayılan olarak `http://localhost:8080/api` adresini kullanır; farklı bir backend adresi gerekiyorsa `front/.env.example` dosyasını `.env` olarak kopyalayıp `VITE_API_BASE_URL` değerini değiştirin. React arayüzü backend API üzerinden PostgreSQL kataloğundaki filmleri ve türleri listeler, başlığa göre arama ve tür filtresi yapar, film detayını açar ve **Film ekle** formuyla yeni kayıt oluşturur. Favoriler tarayıcının localStorage alanında saklanır.

## Flyway ve mevcut veritabanı

Flyway, veritabanı şemasındaki değişiklikleri sıralı migration dosyalarıyla kaydeder. `V1__create_movie_catalog.sql` film ve tür tablolarını oluşturur. `baseline-on-migrate=true` ve baseline sürümü `0`, Flyway geçmişi olmayan ancak zaten `products` tablosu bulunan veritabanında V1'in uygulanabilmesini sağlar. Migration `products` tablosuna dokunmaz; eski tablo ve verileri korunur. Sonraki şema değişikliklerini yeni `V2__...sql` dosyalarıyla ekleyin. Şema Flyway tarafından yönetildiği için Hibernate `validate` modunda yalnızca eşleşmeyi kontrol eder.

## API

Tüm yanıtlar JSON'dur. Sayfalama 0'dan başlar; `size` 1–100 arasında olmalıdır.

| İşlem | Endpoint | Açıklama |
|---|---|---|
| GET | `/api/movies?search=arrival&genre=Sci-Fi&page=0&size=20` | Başlığa göre arama, isteğe bağlı tür filtresi ve sayfalama |
| GET | `/api/movies/top-rated` | Puana ve eşitlikte oy sayısına göre ilk 10 |
| GET | `/api/movies/{id}` | Film detayı |
| GET | `/api/genres` | Alfabetik tür listesi |
| POST | `/api/movies` | Film oluşturur (`201 Created`) |
| PUT | `/api/movies/{id}` | Filmi tamamen günceller |
| DELETE | `/api/movies/{id}` | Filmi siler (`204 No Content`) |

POST/PUT gövde örneği:

```json
{
  "title": "Arrival",
  "overview": "Bir dilbilimci, dünyaya gelen gizemli ziyaretçilerle iletişim kurmaya çalışır.",
  "tagline": "Dünya'ya gelişleri bir başlangıç.",
  "imdbId": "tt2543164",
  "posterUrl": "https://example.com/arrival-poster.jpg",
  "backdropUrl": "https://example.com/arrival-backdrop.jpg",
  "releaseDate": "2016-11-11",
  "runtimeMinutes": 116,
  "rating": 7.9,
  "voteCount": 8500,
  "genres": ["Sci-Fi", "Drama"]
}
```

Geçersiz istekler `400 Bad Request`, bulunmayan film kimlikleri `404 Not Found` ve alan hataları `validationErrors` içeren ortak JSON hata gövdesi döndürür. Liste yanıtı `content`, `page`, `size`, `totalElements`, `totalPages` ve `last` alanlarına sahiptir.

## TMDB'den film aktarma

TMDB API anahtarını IntelliJ'de `CineHubApplication` → **Edit Configurations** → **Environment variables** alanına `TMDB_API_KEY=...` adıyla ekleyin. Anahtarı GitHub'a veya frontend'e koymayın. Backend'i yeniden başlattıktan sonra Postman'da `POST http://localhost:8080/api/tmdb/import` isteğini gönderin; `X-TMDB-API-Key` header'ına aynı anahtarı ekleyin. TMDB'nin popüler filmler listesindeki ilk beş sayfa PostgreSQL'e kaydedilir. Tekrar çağırınca aynı filmler güncellenir, kopya oluşmaz. Sonra `localhost:5173` sayfasını yenileyin.

TMDB verileri altı aydan eski olduğunda uygulama bunları siler. Uygulamada TMDB atfı gösterilir. TMDB'nin [API kullanım şartlarını](https://www.themoviedb.org/api-terms-of-use) ve [atıf yönergelerini](https://www.themoviedb.org/about/logos-attribution) izleyin; ticari kullanım ayrıca izin gerektirebilir. Otomatik testler servis davranışını PostgreSQL gerektirmeden sınar.
