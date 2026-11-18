"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "uz" | "en" | "ru";

export interface Translations {
  // Navigation & General
  appTitle: string;
  room: string;
  livekitBadge: string;
  secureConnection: string;

  // Home Page
  heroBadge: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  startCallCardTitle: string;
  startCallCardDesc: string;
  startCallBtn: string;
  generateLinkBtn: string;
  joinCardTitle: string;
  joinCardDesc: string;
  roomInputPlaceholder: string;
  joinCallBtn: string;
  linkReadyLabel: string;
  copyLinkBtn: string;
  copiedBtn: string;
  enterNowBtn: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  footerText: string;

  // Lobby
  lobbyTitle: string;
  lobbySubtitle: string;
  cameraOff: string;
  muteMic: string;
  unmuteMic: string;
  turnOffCam: string;
  turnOnCam: string;
  nameInputLabel: string;
  nameInputPlaceholder: string;
  joinRoomBtn: string;
  copiedToast: string;

  // Call Room
  waitingTitle: string;
  waitingDesc: string;
  screenSharingText: string;
  screenSharePaused: string;
  screenSharePausedDesc: string;
  you: string;
  participant: string;
  screenShareToggleOn: string;
  screenShareToggleOff: string;
  reactionsTooltip: string;
  endCallTooltip: string;
  connectingText: string;
  connectionError: string;
  retryBtn: string;

  // Install PWA banner
  installApp: string;
  installAppDesc: string;
  installBtn: string;
  dismissBtn: string;
}

const translations: Record<Language, Translations> = {
  uz: {
    appTitle: "FaceTime",
    room: "Xona",
    livekitBadge: "WebRTC LiveKit",
    secureConnection: "FaceTime himoyalangan WebRTC ulanishi",

    heroBadge: "Kristalldek tiniq video va audio qoʻngʻiroqlar",
    heroTitle: "Xuddi",
    heroHighlight: "FaceTime",
    heroSubtitle:
      "2 kishilik 1-on-1 yoki havola orqali istalgancha doʻstlaringiz qoʻshiladigan guruhli qoʻngʻiroqlar. Hech qanday roʻyxatdan oʻtish shart emas.",
    startCallCardTitle: "Yangi Qoʻngʻiroq",
    startCallCardDesc:
      "Bir marta bosish orqali yangi video xona oching va suhbatni boshlang.",
    startCallBtn: "Qoʻngʻiroqni boshlash",
    generateLinkBtn: "Havola yaratish (keyinroq ulashish)",
    joinCardTitle: "Qoʻshilish",
    joinCardDesc:
      "Doʻstingiz yuborgan taklif havolasi yoki xona kodini kiriting.",
    roomInputPlaceholder: "Xona kodi yoki linkni qoʻying",
    joinCallBtn: "Xonaga kirish",
    linkReadyLabel: "Taklif havolasi tayyor:",
    copyLinkBtn: "Nusxalash",
    copiedBtn: "Nusxalandi",
    enterNowBtn: "Hozir kirish",
    feature1Title: "1-on-1 & Guruh",
    feature1Desc: "Avtomatik FaceTime PiP yoki dinamik grid.",
    feature2Title: "Ekran Ulashish",
    feature2Desc: "Prezentatsiya va videolarni birgalikda koʻrish.",
    feature3Title: "Jonli Reaksiyalar",
    feature3Desc: "Suzuvchi Apple animatsiyali emojilar.",
    feature4Title: "Xavfsiz WebRTC",
    feature4Desc: "LiveKit SFU yuqori tezlik va past kechikish.",
    footerText: "FaceTime Web • Next.js & LiveKit WebRTC bilan yaratilgan",

    lobbyTitle: "FaceTime Qoʻngʻiroq",
    lobbySubtitle:
      "Xonaga kirishdan oldin ismingizni kiriting va qurilmalaringizni sozlang.",
    cameraOff: "Kamera oʻchirilgan",
    muteMic: "Mikrofonni oʻchirish",
    unmuteMic: "Mikrofonni yoqish",
    turnOffCam: "Kamerani oʻchirish",
    turnOnCam: "Kamerani yoqish",
    nameInputLabel: "Ismingiz (boshqalar sizni shu nom bilan koʻradi)",
    nameInputPlaceholder: "Masalan: Sardor",
    joinRoomBtn: "Qoʻngʻiroqqa qoʻshilish",
    copiedToast: "Havolani nusxalash",

    waitingTitle: "Boshqalar kutilmoqda...",
    waitingDesc:
      "Qoʻngʻiroqqa qoʻshilishlari uchun ushbu havolani doʻstlaringizga yuboring.",
    screenSharingText: "ekranini ulashmoqda",
    screenSharePaused: "Ekran ulashish toʻxtatib turildi",
    screenSharePausedDesc:
      "Foydalanuvchi boshqa ilovaga yoki tabga oʻtdi. Brauzerga qaytishi bilan efir davom etadi.",
    you: "Siz",
    participant: "Ishtirokchi",
    screenShareToggleOn: "Ekran ulashishni toʻxtatish",
    screenShareToggleOff: "Ekranni ulashish",
    reactionsTooltip: "Reaksiyalar (FaceTime Emojilar)",
    endCallTooltip: "Qoʻngʻiroqni yakunlash",
    connectingText: "FaceTime xonasiga ulanmoqda...",
    connectionError: "Ulanishda xatolik yuz berdi",
    retryBtn: "Qaytadan urinish",

    installApp: "FaceTime ilovasini oʻrnating",
    installAppDesc: "Tezkor kirish uchun asosiy ekranga qoʻshing",
    installBtn: "Oʻrnatish",
    dismissBtn: "Keyinroq",
  },
  en: {
    appTitle: "FaceTime",
    room: "Room",
    livekitBadge: "WebRTC LiveKit",
    secureConnection: "FaceTime encrypted WebRTC connection",

    heroBadge: "Crystal-clear video and audio calls",
    heroTitle: "Just like",
    heroHighlight: "FaceTime",
    heroSubtitle:
      "Seamless 1-on-1 calls or group video rooms joined via a link. Zero sign-up, instantly accessible from any device.",
    startCallCardTitle: "New Call",
    startCallCardDesc:
      "Instantly create a private video room and start your call.",
    startCallBtn: "Start Call",
    generateLinkBtn: "Create Link (share later)",
    joinCardTitle: "Join Call",
    joinCardDesc:
      "Enter an invite link or room code received from a friend.",
    roomInputPlaceholder: "Paste room link or code",
    joinCallBtn: "Join Room",
    linkReadyLabel: "Invite link is ready:",
    copyLinkBtn: "Copy Link",
    copiedBtn: "Copied",
    enterNowBtn: "Join Now",
    feature1Title: "1-on-1 & Group",
    feature1Desc: "Automatic FaceTime PiP or dynamic responsive grid.",
    feature2Title: "Screen Share",
    feature2Desc: "Share presentations, windows, and apps in real-time.",
    feature3Title: "Live Reactions",
    feature3Desc: "Floating animated emoji reactions just like Apple FaceTime.",
    feature4Title: "Ultra-Fast WebRTC",
    feature4Desc: "LiveKit SFU engine with adaptive bitrate & minimal latency.",
    footerText: "FaceTime Web • Built with Next.js & LiveKit WebRTC",

    lobbyTitle: "FaceTime Call",
    lobbySubtitle:
      "Adjust your camera and microphone, and enter your name before joining.",
    cameraOff: "Camera is off",
    muteMic: "Mute microphone",
    unmuteMic: "Unmute microphone",
    turnOffCam: "Turn off camera",
    turnOnCam: "Turn on camera",
    nameInputLabel: "Your Name (visible to other participants)",
    nameInputPlaceholder: "e.g. Alex",
    joinRoomBtn: "Join Call",
    copiedToast: "Copy Invite Link",

    waitingTitle: "Waiting for others to join...",
    waitingDesc:
      "Share this invite link with your friends or colleagues to start the call.",
    screenSharingText: "is sharing screen",
    screenSharePaused: "Screen sharing paused",
    screenSharePausedDesc:
      "The participant switched to another app or tab. It will resume once they return.",
    you: "You",
    participant: "Participant",
    screenShareToggleOn: "Stop sharing screen",
    screenShareToggleOff: "Share screen",
    reactionsTooltip: "Reactions (FaceTime Emojis)",
    endCallTooltip: "End Call",
    connectingText: "Connecting to FaceTime room...",
    connectionError: "Failed to connect to room",
    retryBtn: "Try Again",

    installApp: "Install FaceTime Web App",
    installAppDesc: "Add to Home Screen for a native fullscreen experience",
    installBtn: "Install",
    dismissBtn: "Later",
  },
  ru: {
    appTitle: "FaceTime",
    room: "Комната",
    livekitBadge: "WebRTC LiveKit",
    secureConnection: "Защищенное WebRTC соединение FaceTime",

    heroBadge: "Кристально чистые видео и аудио звонки",
    heroTitle: "Прямо как",
    heroHighlight: "FaceTime",
    heroSubtitle:
      "Удобные звонки 1-на-1 и групповые видеовстречи по ссылке. Без регистрации и ограничений, прямо в браузере.",
    startCallCardTitle: "Новый звонок",
    startCallCardDesc:
      "Создайте комнату в один клик и начните видеозвонок прямо сейчас.",
    startCallBtn: "Начать звонок",
    generateLinkBtn: "Создать ссылку (поделиться позже)",
    joinCardTitle: "Присоединиться",
    joinCardDesc:
      "Введите ссылку-приглашение или код комнаты от собеседника.",
    roomInputPlaceholder: "Вставьте ссылку или код",
    joinCallBtn: "Войти в комнату",
    linkReadyLabel: "Ссылка готова:",
    copyLinkBtn: "Копировать",
    copiedBtn: "Скопировано",
    enterNowBtn: "Войти сейчас",
    feature1Title: "1-на-1 и Группы",
    feature1Desc: "FaceTime PiP для двоих или адаптивная сетка для групп.",
    feature2Title: "Демонстрация экрана",
    feature2Desc: "Показывайте презентации, видео и рабочий стол.",
    feature3Title: "Живые реакции",
    feature3Desc: "Всплывающие анимированные эмодзи в стиле Apple.",
    feature4Title: "Быстрый WebRTC",
    feature4Desc: "LiveKit SFU сервер с минимальной задержкой звука и видео.",
    footerText: "FaceTime Web • Создано на Next.js и LiveKit WebRTC",

    lobbyTitle: "Звонок FaceTime",
    lobbySubtitle:
      "Настройте камеру и микрофон и укажите имя перед входом в комнату.",
    cameraOff: "Камера отключена",
    muteMic: "Выключить микрофон",
    unmuteMic: "Включить микрофон",
    turnOffCam: "Выключить камеру",
    turnOnCam: "Включить камеру",
    nameInputLabel: "Ваше имя (будет видно другим участникам)",
    nameInputPlaceholder: "Например: Алишер",
    joinRoomBtn: "Присоединиться к звонку",
    copiedToast: "Скопировать ссылку",

    waitingTitle: "Ожидание участников...",
    waitingDesc:
      "Отправьте эту ссылку друзьям или коллегам, чтобы они присоединились.",
    screenSharingText: "демонстрирует экран",
    screenSharePaused: "Демонстрация экрана приостановлена",
    screenSharePausedDesc:
      "Участник переключился на другое приложение или вкладку. Показ возобновится при возвращении.",
    you: "Вы",
    participant: "Участник",
    screenShareToggleOn: "Остановить показ экрана",
    screenShareToggleOff: "Поделиться экраном",
    reactionsTooltip: "Реакции (FaceTime Эмодзи)",
    endCallTooltip: "Завершить звонок",
    connectingText: "Подключение к комнате FaceTime...",
    connectionError: "Ошибка подключения к комнате",
    retryBtn: "Попробовать снова",

    installApp: "Установить FaceTime",
    installAppDesc: "Добавьте на главный экран для быстрого доступа",
    installBtn: "Установить",
    dismissBtn: "Позже",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "uz",
  setLanguage: () => {},
  t: translations.uz,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("uz");

  useEffect(() => {
    const saved = localStorage.getItem("facetime_lang") as Language;
    if (saved && (saved === "uz" || saved === "en" || saved === "ru")) {
      setLanguageState(saved);
    } else {
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === "ru") setLanguageState("ru");
      else if (browserLang === "en") setLanguageState("en");
      else setLanguageState("uz");
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("facetime_lang", lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: translations[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
