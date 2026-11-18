# FaceTime Web Video Call App

Apple FaceTime uslubidagi zamonaviy, tezkor va ultra-past kechikishli (ultra-low latency) video qoʻngʻiroq ilovasi. 2 kishilik 1-on-1 qoʻngʻiroqlar va havola orqali istalgancha odam qoʻshiladigan guruh suhbatlarini qoʻllab-quvvatlaydi.

---

## 🌟 Asosiy Imkoniyatlar (Features)

- **Apple FaceTime Dizayni**: Shishasimon xiralashgan fon (Glassmorphism), suzuvchi pastki dock paneli, yashil va qizil Apple boshqaruv tugmalari.
- **1-on-1 Rejimi (Picture-in-Picture)**: 2 kishi gaplashganda suhbatdosh toʻliq ekranda, sizning kamerangiz esa burchakda suzuvchi oynada (PiP) joylashadi.
- **Guruh Rejimi (Dynamic Grid Layout)**: 3 va undan ortiq ishtirokchilar boʻlganda ekranni avtomatik qulay toʻrga taqsimlaydi.
- **Faol Gapiruvchi (Active Speaker Glow)**: Kim gapirsa, uning oynasi yashil nur va audio toʻlqinlar bilan avtomatik ajralib turadi.
- **Pre-Join Lobby (Tayyorgarlik ekrani)**: Xonaga kirmasdan oldin oʻz kamerasini koʻrish, mikrofonni tekshirish va ismni kiritish.
- **Ekran Ulashish (Screen Sharing)**: Prezentatsiyalar, video yoki ish stolini birgalikda tomosha qilish.
- **Jonli Reaksiyalar (FaceTime Reactions)**: Suhbat paytida butun xonadagilar ekranida pastdan tepaga suzib chiquvchi emojilar (❤️, 👍, 👏, 🎉, 🔥, 😂).
- **Havola orqali oson ulanish**: Bir marta bosish orqali taklif havolasini nusxalash va doʻstlarga yuborish.

---

## 🛠 Ishlatilgan Texnologiyalar (Tech Stack)

- **Frontend**: [Next.js 14 (App Router)](https://nextjs.org), React 18, TypeScript
- **WebRTC SFU Engine**: [LiveKit](https://livekit.io) (`livekit-client`, `@livekit/components-react`, `livekit-server-sdk`)
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

#### B variant: Mahalliy Docker orqali ishlatish (Lokal test uchun)
Agar kompyuteringizda Docker oʻrnatilgan boʻlsa, 1 ta buyruq bilan lokal LiveKit serverini yoqing:

```bash
docker run --rm -it -p 7880:7880 -p 7881:7881 -p 7882:7882/udp livekit/livekit-server --dev
```
*Standart `.env.local` faylida dev sozlamalari allaqachon kiritilgan.*

---

### 3. Dasturni ishga tushirish

```bash
pnpm dev
# yoki: npm run dev
```

Brauzeringizda oching: [http://localhost:3000](http://localhost:3000)

1. **"Qoʻngʻiroqni boshlash"** tugmasini bosing yoki xona havolasini doʻstingizga yuboring.
2. Ikkinchi brauzer yoki boshqa tabda xuddi shu havolani oching.
3. 2 kishi ulanganda darhol FaceTime 1-on-1 PiP rejimi, 3-kishi qoʻshilganda esa dinamik guruh toʻri ochiladi!

---

## 📁 Loyiha Tuzilmasi

```text
videocall/
├── app/
│   ├── layout.tsx                # Asosiy global layout va LiveKit stillari
│   ├── page.tsx                  # Bosh sahifa (Yangi xona yaratish & link orqali kirish)
│   ├── globals.css               # FaceTime glassmorphism & animatsiya stillari
│   ├── room/[roomId]/page.tsx    # Xona sahifasi (Lobby -> FaceTimeRoom ulanishi)
│   └── api/livekit/token/route.ts# Xavfsiz JWT token generatsiyasi
├── components/facetime/
│   ├── PreJoinLobby.tsx          # Xonaga kirishdan oldingi kamera/mikrofon tekshiruvi
│   ├── FaceTimeRoom.tsx          # Jonli WebRTC sessiya boshqaruvchisi
│   ├── VideoGrid.tsx             # 1-on-1 PiP, Guruh Grid va Ekran ulashish ko'rinishlari
│   ├── ParticipantTile.tsx       # Ishtirokchi video darchasi, audio vizualizatsiya & avatarlar
│   ├── ControlsBar.tsx           # Suzuvchi FaceTime Apple dock paneli
│   └── ReactionsOverlay.tsx      # Jonli suzuvchi emojilar (Real-time DataChannel)
└── lib/
    └── utils.ts                  # Yordamchi funksiyalar va xona ID generatsiyasi
```
