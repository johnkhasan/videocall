# Videocall — Ultra-Past Kechikishli Video Qoʻngʻiroq Ilovasi

Apple FaceTime uslubidagi zamonaviy, ixcham, kristalldek tiniq va ultra-past kechikishli (ultra-low latency <100ms) video qoʻngʻiroq platformasi. 2 kishilik 1-on-1 qoʻngʻiroqlar va havola orqali istalgancha odam qoʻshiladigan guruh suhbatlarini qoʻllab-quvvatlaydi.

Jonli ishlab chiqarish manzili: **[video.javohir.ru](https://video.javohir.ru)**

---

## 🔒 Xavfsizlik va Shifrlash (Security & Encryption)

Ilovada barcha audio va video maʼlumotlar xalqaro WebRTC xavfsizlik standartlari (IETF / RFC) asosida bir necha bosqichli qatʼiy shifrlash bilan himoyalangan:

### 1. 🛡️ Media Oqimining Shifrlanishi (Audio & Video)
- **DTLS (Datagram Transport Layer Security — RFC 6347):**
  - Foydalanuvchi xonaga ulanishi bilan brauzer va server oʻrtasida bir martalik dinamik kriptografik kalitlar (ECDHE) almashiladi.
  - Bu orqali begona uchinchi shaxslarning ulanish oʻrtasiga suqilib kirishi (Man-in-the-Middle) butunlay bartaraf etiladi.
- **SRTP (Secure Real-Time Transport Protocol — RFC 3711):**
  - Internet orqali uzatiladigan **har bitta audio (Opus) va video (H.264) paketi** zamonaviy **`AES-128-GCM`** (yoki `AES-256`) algoritmi bilan toʻliq shifrlanadi.
  - Hatto ochiq Wi-Fi tarmogʻida yoki internet provayderi darajasida tarmoq paketlari ushlab olinganda ham (Wireshark kabi snifferlar orqali), ularni ochib boʻlmaydi — faqat shifrlangan media koʻrinadi.

### 2. 🔐 Signalizatsiya va Autentifikatsiya (Signaling & Auth)
- **TLS 1.3 / WSS (WebSocket Secure):**
  - Xonaga ulanish, ishtirokchilar roʻyxati, xona holati va boshqaruv signallari faqatgina **TLS 1.3** shifrlangan xavfsiz WebSocket (`wss://`) protokoli orqali amalga oshiriladi.
- **JWT Tokenlar (HMAC-SHA256):**
  - Har bir foydalanuvchiga faqat oʻz xonasiga kirish huquqini beruvchi, serverdagi `LIVEKIT_API_SECRET` bilan imzolangan raqamli token beriladi. Begona shaxs xona kodini bilsa ham, toʻgʻri token ololmasa, oqimlarni tinglay olmaydi.

### 3. ⚡ Ultra-Past Kechikish Texnologiyalari (Zero-Latency Architecture)
- **`jitterBufferTarget = 0`:** Brauzerlarning sunʼiy 50–150ms buferlash kechikishi maxsus WebRTC qabul qiluvchi drayveri orqali nolga tushirilgan.
- **H.264 Hardware Acceleration:** Mac (Apple Silicon), iPhone, iPad va Android qurilmalarida apparat darajasida kodlash ishlaydi (kodlash kechikishi <5ms).
- **RED (RFC 2198 Redundant Audio):** Wi-Fi yoki mobil internetda paket yoʻqolganda qayta soʻrovsiz, 0 ms kechikish bilan ovozni tiklaydi.
- **`dtx: false`:** Uzluksiz 48kHz Opus oqimi orqali gap boshidagi birinchi soʻz yoki boʻgʻinning kesilib qolishi (voice clipping) bartaraf etilgan.
- **E2EE (End-to-End Encryption) Qoʻllab-quvvatlovi:** WebRTC Encoded Transform (Insertable Streams) arxitekturasi orqali toʻliq serverdan ham mustaqil E2EE ga tayyor.

---

## 🌟 Asosiy Imkoniyatlar (Features)

- **Bir Ekranga Sigʻdirilgan Bosh Sahifa**: Hech qanday scroll boʻlmaydigan, toza va minimalist 1 ekranli interfeys (`100dvh`).
- **4 Xonali Oson Kodlar**: Xonaga kirish va ulashish uchun uzun chalkash harflar oʻrniga 4 xonali qulay raqamlar (masalan: `4829`).
- **3 Tilda Ishlash**: Oʻzbek, Rus va Ingliz tillarini toʻliq qoʻllab-quvvatlaydi (tizim tilini avtomatik aniqlash bilan).
- **PWA (Progressive Web App)**: Telefonga ilova sifatida oʻrnatish (Add to Home Screen) va toʻliq ekran rejimida ishlatish.
- **1-on-1 Rejimi (Picture-in-Picture)**: 2 kishi gaplashganda suhbatdosh toʻliq ekranda, sizning kamerangiz esa burchakda suzuvchi oynada (PiP) joylashadi. Darchalarni bir marta bosish bilan almashtirish (Swap) mumkin.
- **Guruhda Spotlight / Focus Rejimi**: 3 va undan koʻp kishi boʻlganda istalgan odamning videosiga bosib, uni markazga katta hajmda chiqarish va qolganlarni yon panelga olish.
- **Kamera Almashtirish (Front/Back)**: Telefonda oldi va orqa kameralar oʻrtasida bir zumda almashish (orqa kamerada teskari akslanish avtomatik oʻchiriladi).
- **Noutbukda Tezkor Klavishlar**: `M` mikrofonni yoqish/oʻchirish, `V` kamerani yoqish/oʻchirish.
- **Jonli Ovoz Effektlari**: Kimdir qoʻshilganda, chiqqanda va qoʻngʻiroq tugatilganda FaceTime signallari (0 ms kechikish bilan Web Audio API orqali).
- **Ekran Ulashish (Screen Sharing)**: Kompyuter, telefon va planshetlarda (iPad / Android Tablet) prezentatsiya va ekranni toʻliq namoyish qilish.
- **Jonli Reaksiyalar (FaceTime Reactions)**: Suhbat paytida ekranda pastdan tepaga suzib chiquvchi emojilar (❤️, 👍, 👏, 🎉, 🔥, 😂).
- **Ixcham Xavfsizlik Menyusi**: Yuqori chap burchakdagi qalqon (`🛡️`) tugmasi orqali xona maʼlumotlari, davomiylik va nusxalash oynasi.

---

## 🛠 Ishlatilgan Texnologiyalar (Tech Stack)

- **Frontend**: [Next.js 14 (App Router)](https://nextjs.org), React 18, TypeScript
- **WebRTC SFU Engine**: [LiveKit](https://livekit.io) (`livekit-client`, `@livekit/components-react`, `livekit-server-sdk`)
- **Shifrlash**: DTLS-SRTP (AES-128-GCM / AES-256), TLS 1.3, JWT (HMAC-SHA256)
- **Audio/Video Kodeklar**: H.264 (Hardware-accelerated), Opus 48kHz (64 kbps Fullband)
- **Styling & Animatsiyalar**: Tailwind CSS, Framer Motion
- **Belgilar**: Lucide Icons

---

## 🚀 Ishga Tushirish Qoʻllanmasi

### 1. Bogʻliqliklarni oʻrnatish

```bash
pnpm install
# yoki: npm install
```

### 2. LiveKit Serverni sozlash

Sizda 2 xil variant bor:

#### A variant: Bepul LiveKit Cloud (Tavsiya etiladi - 1 daqiqa)
1. [cloud.livekit.io](https://cloud.livekit.io) saytida bepul roʻyxatdan oʻting va yangi loyiha oching.
2. Loyihangizning **API Key**, **API Secret** va **WebSocket URL** (`wss://...`) larni oling.
3. `.env.local` fayliga yozing:

```env
LIVEKIT_API_KEY=sizning_api_keyingiz
LIVEKIT_API_SECRET=sizning_api_secretingiz
LIVEKIT_URL=wss://sizning-loyihangiz.livekit.cloud
NEXT_PUBLIC_LIVEKIT_URL=wss://sizning-loyihangiz.livekit.cloud
```

#### B variant: Oʻz VPS serveringizda ishlatish (Masalan: Docker orqali)
VPS serverda LiveKit SFU konteynerini ishga tushirish:

```bash
docker run -d --name livekit \
  -p 7880:7880 -p 7881:7881 -p 50000-60000:50000-60000/udp \
  livekit/livekit-server --config /etc/livekit.yaml
```

---

### 3. Dasturni ishga tushirish

```bash
pnpm dev
# yoki: npm run dev
```

Brauzeringizda oching: [http://localhost:3000](http://localhost:3000)

1. **"Qoʻngʻiroq yaratish"** tugmasini bosing — avtomatik 4 xonali xona ochiladi.
2. 4 xonali kod yoki havolani suhbatdoshingizga yuboring.
3. Suhbatdosh ushbu kod yoki havola orqali kelsa, video qoʻngʻiroq zudlik bilan boshlanadi!

---

## 📁 Loyiha Tuzilmasi

```text
videocall/
├── app/
│   ├── layout.tsx                # Asosiy global layout, metadata va PWA sozlamalari
│   ├── page.tsx                  # 1-ekranli ixcham bosh sahifa (Qo'ng'iroq yaratish va 4 xonali kod)
│   ├── globals.css               # Glassmorphism & animatsiya stillari
│   ├── room/[roomId]/page.tsx    # Xona sahifasi (PreJoinLobby -> FaceTimeRoom ulanishi)
│   └── api/livekit/token/route.ts# Xavfsiz JWT token generatsiyasi
├── components/
│   ├── facetime/
│   │   ├── PreJoinLobby.tsx      # Xonaga kirishdan oldingi kamera/mikrofon tekshiruvi
│   │   ├── FaceTimeRoom.tsx      # Jonli WebRTC sessiya boshqaruvchisi va LowLatencyPlayoutOptimizer
│   │   ├── VideoGrid.tsx         # 1-on-1 PiP, Guruh Spotlight va Ekran ulashish ko'rinishlari
│   │   ├── ParticipantTile.tsx   # Ishtirokchi video darchasi va audio vizualizatsiya
│   │   ├── ControlsBar.tsx       # FaceTime boshqaruv paneli (Mic, Cam, Screen, Emoji, Flip, Leave)
│   │   └── ReactionsOverlay.tsx  # Jonli suzuvchi emojilar (DataChannel)
│   ├── pwa/
│   │   └── PWAInstaller.tsx      # Mobil ilova sifatida o'rnatish taklifi
│   └── ui/
│       └── LanguageSwitcher.tsx  # UZ / EN / RU til almashtirgich
├── context/
│   └── LanguageContext.tsx       # Ko'p tillilik lug'ati va konteksti
├── lib/
│   ├── sounds.ts                 # Web Audio API FaceTime ovoz effektlari (Join, Leave, End)
│   └── utils.ts                  # 4 xonali xona ID generatsiyasi va yordamchilar
└── public/
    ├── manifest.json             # PWA manifesti
    └── icons/                    # PWA ilova belgilari
```
