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
  orDivider: string;
  screenShareNotSupported: string;
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
  swapVideosTooltip: string;
  switchCameraTooltip: string;
  splitView: string;
  pipView: string;
  gridMode: string;
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
    appTitle: "Videocall",
    room: "Xona",
    livekitBadge: "HD Video",
    secureConnection: "Xavfsiz va shifrlangan aloqa",

    heroBadge: "Tezkor va xavfsiz video aloqa",
    heroTitle: "Yaqinlaringiz bilan",
    heroHighlight: "Yuzma-yuz",
    heroSubtitle:
      "Doʻstlaringiz va jamoangiz bilan istalgan qurilmadan bir zumda bogʻlaning. Hech qanday roʻyxatdan oʻtish talab etilmaydi.",
    startCallCardTitle: "Yangi Qoʻngʻiroq",
    startCallCardDesc:
      "Bir marta bosish orqali yangi video xona oching va suhbatni boshlang.",
    startCallBtn: "Qoʻngʻiroq yaratish",
    generateLinkBtn: "Havola yaratish (keyinroq ulashish)",
    joinCardTitle: "Qoʻshilish",
    joinCardDesc:
      "Doʻstingiz yuborgan 4 xonali kod yoki taklif havolasini kiriting.",
    roomInputPlaceholder: "4 xonali kod (masalan: 1234)",
    orDivider: "yoki",
    screenShareNotSupported: "Ekran ulashish ushbu qurilma/brauzerda qoʻllab-quvvatlanmaydi",
    joinCallBtn: "Qoʻshilish",
    linkReadyLabel: "Taklif havolasi tayyor:",
    copyLinkBtn: "Nusxalash",
    copiedBtn: "Nusxalandi",
    enterNowBtn: "Hozir kirish",
    feature1Title: "1-on-1 & Guruh",
    feature1Desc: "Ikki kishilik qulay FaceTime rejimi yoki guruhli keng ekran.",
    feature2Title: "Ekran Ulashish",
    feature2Desc: "Prezentatsiya, video yoki ekranni jonli namoyish qiling.",
    feature3Title: "Jonli Reaksiyalar",
    feature3Desc: "Suhbat davomida jonli va interaktiv emojilar.",
    feature4Title: "Yuqori Sifat & Xavfsizlik",
    feature4Desc: "Kristalldek tiniq HD audio/video va toʻliq shifrlangan aloqa.",
    footerText: "Xavfsiz va shifrlangan aloqa • Roʻyxatdan oʻtish shart emas",

    lobbyTitle: "Video Qoʻngʻiroq",
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
    swapVideosTooltip: "Darchalarni almashtirish (Katta/Kichik)",
    switchCameraTooltip: "Kamerani almashtirish (Oldi / Orqa)",
    splitView: "Yonma-yon (50/50)",
    pipView: "PiP koʻrinishi",
    gridMode: "Setka koʻrinishi",
    connectingText: "FaceTime xonasiga ulanmoqda...",
    connectionError: "Ulanishda xatolik yuz berdi",
    retryBtn: "Qaytadan urinish",

    installApp: "FaceTime ilovasini oʻrnating",
    installAppDesc: "Tezkor kirish uchun asosiy ekranga qoʻshing",
    installBtn: "Oʻrnatish",
    dismissBtn: "Keyinroq",
  },
  en: {
    appTitle: "Videocall",
    room: "Room",
    livekitBadge: "HD Video",
    secureConnection: "End-to-End Encrypted Call",

    heroBadge: "Fast & secure video calls",
    heroTitle: "Connect instantly,",
    heroHighlight: "Face to Face",
    heroSubtitle:
      "High-definition video calls for 1-on-1 chats and group meetings. No sign-up or downloads required.",
    startCallCardTitle: "New Call",
    startCallCardDesc:
      "Instantly create a private video room and start your call.",
    startCallBtn: "Create Call",
    generateLinkBtn: "Create Link (share later)",
    joinCardTitle: "Join Call",
    joinCardDesc:
      "Enter 4-digit code or invite link from your friend.",
    roomInputPlaceholder: "4-digit code (e.g. 1234)",
    orDivider: "or",
    screenShareNotSupported: "Screen sharing is not supported on this device/browser",
    joinCallBtn: "Join",
    linkReadyLabel: "Invite link is ready:",
    copyLinkBtn: "Copy Link",
    copiedBtn: "Copied",
    enterNowBtn: "Join Now",
    feature1Title: "1-on-1 & Group",
    feature1Desc: "Seamless 1-on-1 FaceTime layout or dynamic responsive grid.",
    feature2Title: "Screen Share",
    feature2Desc: "Share presentations, windows, and apps in real-time.",
    feature3Title: "Live Reactions",
    feature3Desc: "Floating live animated emoji reactions during the call.",
    feature4Title: "HD Quality & Security",
    feature4Desc: "Crystal-clear HD audio/video and fully encrypted communication.",
    footerText: "End-to-end encrypted video calls • No registration required",

    lobbyTitle: "Video Call",
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
    swapVideosTooltip: "Swap videos (Main / PiP)",
    switchCameraTooltip: "Switch camera (Front / Back)",
    splitView: "Split View (50/50)",
    pipView: "PiP View",
    gridMode: "Grid View",
    connectingText: "Connecting to FaceTime room...",
    connectionError: "Failed to connect to room",
    retryBtn: "Try Again",

    installApp: "Install FaceTime Web App",
    installAppDesc: "Add to Home Screen for a native fullscreen experience",
    installBtn: "Install",
    dismissBtn: "Later",
  },
  ru: {
    appTitle: "Videocall",
    room: "Комната",
    livekitBadge: "HD Видео",
    secureConnection: "Защищенный зашифрованный звонок",

    heroBadge: "Быстрая и безопасная видеосвязь",
    heroTitle: "Общайтесь с близкими",
    heroHighlight: "Лицом к лицу",
    heroSubtitle:
      "Качественные видеозвонки один на один или групповые встречи по простой ссылке. Без регистрации и установки приложений.",
    startCallCardTitle: "Новый звонок",
    startCallCardDesc:
      "Создайте комнату в один клик и начните видеозвонок прямо сейчас.",
    startCallBtn: "Создать звонок",
    generateLinkBtn: "Создать ссылку (поделиться позже)",
    joinCardTitle: "Присоединиться",
    joinCardDesc:
      "Введите 4-значный код или ссылку-приглашение.",
    roomInputPlaceholder: "4-значный код (напр: 1234)",
    orDivider: "или",
    screenShareNotSupported: "Демонстрация экрана не поддерживается на этом устройстве/браузере",
    joinCallBtn: "Войти",
    linkReadyLabel: "Ссылка готова:",
    copyLinkBtn: "Копировать",
    copiedBtn: "Скопировано",
    enterNowBtn: "Войти сейчас",
    feature1Title: "1-на-1 и Группы",
    feature1Desc: "Удобный режим FaceTime для двоих или адаптивная сетка для групп.",
    feature2Title: "Демонстрация экрана",
    feature2Desc: "Демонстрируйте документы, презентации и рабочий стол.",
    feature3Title: "Живые реакции",
    feature3Desc: "Всплывающие анимированные эмодзи во время звонка.",
    feature4Title: "HD Качество и Защита",
    feature4Desc: "Кристально чистое видео, чистый звук и полная безопасность.",
    footerText: "Зашифрованная видеосвязь • Без регистрации",

    lobbyTitle: "Видеозвонок",
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
    swapVideosTooltip: "Поменять окна местами (Основное / PiP)",
    switchCameraTooltip: "Переключить камеру (Передняя / Задняя)",
    splitView: "Рядом (50/50)",
    pipView: "Режим PiP",
    gridMode: "Сетка",
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
