import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, Check, Download, ExternalLink, Calendar, Info, Share2, Sparkles } from "lucide-react";
import { useUI } from "../context/UIContext";
import { downloadImage } from "../utils/downloadImage";

// SVG-иконки популярных социальных сетей для максимальной совместимости и идеального стиля
const TelegramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.51 9.94 15.93 13.37 15.63 15C15.5 15.69 15.25 15.92 15.01 15.94C14.48 15.99 14.07 15.59 13.56 15.26C12.76 14.74 12.31 14.42 11.53 13.91C10.63 13.32 11.21 12.99 11.73 12.45C11.86 12.31 14.21 10.17 14.26 10.04C14.27 10.02 14.28 9.93 14.22 9.88C14.16 9.83 14.07 9.85 14 9.87C13.9 9.89 12.33 10.93 11.28 11.64C10.97 11.85 10.69 11.95 10.45 11.94C10.18 11.93 9.67 11.79 9.29 11.67C8.82 11.52 8.44 11.44 8.47 11.18C8.49 11.04 8.68 10.9 9.04 10.75C11.26 9.78 12.74 9.14 13.48 8.83C15.59 7.95 16.03 7.8 16.32 7.8C16.38 7.8 16.52 7.82 16.61 7.89C16.69 7.96 16.71 8.06 16.72 8.14C16.71 8.2 16.68 8.5 16.64 8.8Z" fill="currentColor"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="currentColor"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" fill="currentColor"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.004 2C6.48 2 2 6.48 2 12C2 13.91 2.54 15.7 3.47 17.22L2 22L6.95 20.61C8.42 21.5 10.15 22 12.004 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12.004 2ZM18.12 15.65C17.87 16.36 16.91 16.94 16.2 17.07C15.71 17.16 15.08 17.22 12.91 16.32C10.13 15.17 8.34 12.31 8.2 12.12C8.07 11.94 7.07 10.6 7.07 9.22C7.07 7.84 7.77 7.18 8.06 6.88C8.3 6.64 8.7 6.52 9.08 6.52C9.2 6.52 9.31 6.53 9.41 6.53C9.7 6.54 9.85 6.56 10.05 7.04C10.3 7.64 10.9 9.1 10.97 9.25C11.04 9.4 11.11 9.6 11.01 9.8C10.91 10 10.83 10.1 10.68 10.27C10.53 10.44 10.4 10.57 10.24 10.77C10.1 10.95 9.93 11.15 10.11 11.47C10.29 11.78 10.91 12.8 11.83 13.62C13.02 14.68 14 15.02 14.32 15.16C14.64 15.3 14.82 15.26 15 15.06C15.22 14.81 15.94 13.96 16.19 13.59C16.44 13.22 16.69 13.27 17 13.39C17.32 13.51 19.01 14.35 19.36 14.52C19.71 14.69 19.95 14.78 20.03 14.92C20.12 15.07 20.12 15.77 19.87 16.48L18.12 15.65Z" fill="currentColor"/>
  </svg>
);

const VkIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-3.321 3.515c.123-.33-.038-.683-.497-.683h-1.53c-.386 0-.563.205-.66.427 0 0-.78 1.905-1.887 3.14-.356.357-.52.472-.716.472-.098 0-.24-.115-.24-.445v-3.048c0-.387-.11-.563-.473-.563h-2.4c-.244 0-.39.18-.39.351 0 .232.348.286.383.94v1.419c0 .31-.056.368-.178.368-.328 0-1.127-1.134-1.587-2.433-.146-.423-.29-.594-.68-.594H6.203c-.435 0-.522.205-.522.428 0 .4.515 2.4.24 3.737C6.46 17.9 7.749 19 9.397 19c1.002 0 1.252-.403 1.252-.976v-.88c0-.448.094-.537.406-.537.23 0 .626.116 1.547 1.002.923.886 1.077 1.391 1.594 1.391h1.533c.435 0 .653-.217.528-.646a7.615 7.615 0 00-1.128-1.551c-.305-.363-.762-.752-.9-.948-.19-.244-.136-.35 0-.57 0 0 1.849-2.615 2.035-3.416z" fill="currentColor" />
  </svg>
);

export const ShareModal: React.FC = () => {
  const { isShareOpen, setIsShareOpen, shareUrl, shareTitle } = useUI();
  const [copiedApp, setCopiedApp] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [activeTab, setActiveTab] = useState<"networks" | "instagram">("networks");

  if (!isShareOpen) return null;

  // Telegram Бот ссылка
  const botUrl = "https://t.me/neirostilist_bot";
  // Текст для шеринга
  const defaultText = shareTitle || "Посмотри, какую классную прическу и цвет волос мне подобрал ИИ в НейроСтилисте!";
  const shareTextWithBot = `${defaultText}\n\nПопробуй тоже в @neirostilist_bot!`;

  const copyToClipboard = async (text: string, isAppUrl: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isAppUrl) {
        setCopiedApp(true);
        setTimeout(() => setCopiedApp(false), 2000);
      } else {
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2000);
      }
    } catch (err) {
      console.error("Не удалось скопировать", err);
    }
  };

  // Поделиться в Telegram
  const handleTelegramShare = () => {
    const url = shareUrl && !shareUrl.startsWith("data:") && !shareUrl.startsWith("blob:") ? shareUrl : botUrl;
    const shareLink = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareTextWithBot)}`;
    window.open(shareLink, "_blank");
  };

  // Поделиться в X (Twitter)
  const handleTwitterShare = () => {
    const url = shareUrl && !shareUrl.startsWith("data:") && !shareUrl.startsWith("blob:") ? shareUrl : botUrl;
    const shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(defaultText)}`;
    window.open(shareLink, "_blank");
  };

  // Поделиться в Facebook
  const handleFacebookShare = () => {
    const url = shareUrl && !shareUrl.startsWith("data:") && !shareUrl.startsWith("blob:") ? shareUrl : botUrl;
    const shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareLink, "_blank");
  };

  // Поделиться в VK
  const handleVkShare = () => {
    const url = shareUrl && !shareUrl.startsWith("data:") && !shareUrl.startsWith("blob:") ? shareUrl : botUrl;
    const shareLink = `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(shareTextWithBot)}`;
    window.open(shareLink, "_blank");
  };

  // Поделиться в WhatsApp
  const handleWhatsAppShare = () => {
    const url = shareUrl && !shareUrl.startsWith("data:") && !shareUrl.startsWith("blob:") ? shareUrl : botUrl;
    const shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(defaultText + " " + url)}`;
    window.open(shareLink, "_blank");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Затемнение фона */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsShareOpen(false)}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Контентное окно */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0d0e12] p-6 text-white shadow-2xl z-10"
        >
          {/* Свечение на заднем плане модалки */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Заголовок */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                <Share2 size={18} />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-semibold tracking-wide">
                Поделиться образом
              </h3>
            </div>
            <button
              onClick={() => setIsShareOpen(false)}
              className="rounded-full bg-white/5 p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Превью образа, если есть */}
          {shareUrl && (
            <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden mb-6 border border-white/5 bg-black/40 flex items-center justify-center">
              <img
                src={shareUrl}
                alt="Превью образа"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <div className="flex items-center gap-1 text-[11px] text-white/50 bg-[#0c0d12]/80 backdrop-blur-sm py-1 px-2.5 rounded-full border border-white/5">
                  <Sparkles size={10} className="text-blue-400" />
                  <span>Создано ИИ НейроСтилист</span>
                </div>
              </div>
            </div>
          )}

          {/* Переключатель вкладок: Соцсети / Инстаграм */}
          <div className="flex border-b border-white/5 mb-6">
            <button
              onClick={() => setActiveTab("networks")}
              className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${
                activeTab === "networks" ? "text-blue-400" : "text-white/50 hover:text-white/80"
              }`}
            >
              Соцсети и мессенджеры
              {activeTab === "networks" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("instagram")}
              className={`flex-1 pb-3 text-sm font-semibold transition-all relative ${
                activeTab === "instagram" ? "text-pink-400" : "text-white/50 hover:text-white/80"
              }`}
            >
              Instagram Stories
              {activeTab === "instagram" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-400"
                />
              )}
            </button>
          </div>

          {activeTab === "networks" ? (
            <div className="space-y-6">
              {/* Сетка кнопок быстрого шеринга */}
              <div className="grid grid-cols-5 gap-3">
                <button
                  onClick={handleTelegramShare}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center group-hover:bg-[#0088cc]/20 group-hover:scale-110 active:scale-95 transition-all">
                    <TelegramIcon />
                  </div>
                  <span className="text-[10px] text-white/60 font-medium tracking-wide">Telegram</span>
                </button>

                <button
                  onClick={handleVkShare}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#0077ff]/10 text-[#0077ff] flex items-center justify-center group-hover:bg-[#0077ff]/20 group-hover:scale-110 active:scale-95 transition-all">
                    <VkIcon />
                  </div>
                  <span className="text-[10px] text-white/60 font-medium tracking-wide">ВКонтакте</span>
                </button>

                <button
                  onClick={handleWhatsAppShare}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#25d366]/10 text-[#25d366] flex items-center justify-center group-hover:bg-[#25d366]/20 group-hover:scale-110 active:scale-95 transition-all">
                    <WhatsAppIcon />
                  </div>
                  <span className="text-[10px] text-white/60 font-medium tracking-wide">WhatsApp</span>
                </button>

                <button
                  onClick={handleTwitterShare}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-white/5 text-white/90 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 active:scale-95 transition-all">
                    <TwitterIcon />
                  </div>
                  <span className="text-[10px] text-white/60 font-medium tracking-wide">X (Twitter)</span>
                </button>

                <button
                  onClick={handleFacebookShare}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#1877f2]/10 text-[#1877f2] flex items-center justify-center group-hover:bg-[#1877f2]/20 group-hover:scale-110 active:scale-95 transition-all">
                    <FacebookIcon />
                  </div>
                  <span className="text-[10px] text-white/60 font-medium tracking-wide">Facebook</span>
                </button>
              </div>

              {/* Поля для копирования */}
              <div className="space-y-3">
                {/* Ссылка на бота */}
                <div>
                  <label className="text-xs text-white/40 block mb-1.5 font-medium uppercase tracking-wider">Ссылка на сервис</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={botUrl}
                      className="flex-1 text-sm bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-white/85 focus:outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(botUrl, true)}
                      className="px-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-medium text-xs flex items-center gap-1.5 transition-all active:scale-95 self-stretch shrink-0"
                    >
                      {copiedApp ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedApp ? "Скопировано" : "Копировать"}</span>
                    </button>
                  </div>
                </div>

                {/* Ссылка на картинку (если внешняя ссылка) */}
                {shareUrl && !shareUrl.startsWith("data:") && !shareUrl.startsWith("blob:") && (
                  <div>
                    <label className="text-xs text-white/40 block mb-1.5 font-medium uppercase tracking-wider">Прямая ссылка на прическу</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="flex-1 text-sm bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-white/85 focus:outline-none truncate"
                      />
                      <button
                        onClick={() => copyToClipboard(shareUrl, false)}
                        className="px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 font-medium text-xs flex items-center gap-1.5 transition-all active:scale-95 self-stretch shrink-0"
                      >
                        {copiedImage ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedImage ? "Скопировано" : "Копировать"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Пояснительный блок для Instagram */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent border border-pink-500/10 flex gap-3 text-left">
                <div className="p-2 h-fit rounded-xl bg-pink-500/10 text-pink-400 shrink-0 mt-0.5 animate-pulse">
                  <InstagramIcon />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-pink-200 mb-1">
                    Инструкция для Instagram Stories:
                  </h4>
                  <ul className="text-xs text-white/70 space-y-1.5 list-decimal pl-4 leading-relaxed">
                    <li>Скачайте изображение образа на ваше устройство ниже.</li>
                    <li>
                      Скопируйте ссылку на бот <span className="text-pink-400 font-semibold">@neirostilist_bot</span>, чтобы люди могли кликнуть её.
                    </li>
                    <li>Создайте историю в Instagram, добавив скачанное фото.</li>
                    <li>Используйте стикер <strong>&quot;Ссылка&quot;</strong>, вставив скопированный адрес, или напишите текст <strong>@neirostilist_bot</strong>!</li>
                  </ul>
                </div>
              </div>

              {/* Кнопки скачивания и копирования */}
              <div className="flex gap-2.5">
                <button
                  onClick={() => {
                    if (shareUrl) {
                      downloadImage(shareUrl, "my_neuro_style.jpg");
                    }
                  }}
                  className="flex-1 py-3 px-4 bg-pink-600 hover:bg-pink-500 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Download size={16} />
                  <span>Скачать образ</span>
                </button>

                <button
                  onClick={() => copyToClipboard(botUrl, true)}
                  className="py-3 px-4 bg-white/5 hover:bg-white/10 font-semibold text-sm border border-white/5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 text-white/90"
                >
                  {copiedApp ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedApp ? "Бот скопирован" : "Копировать бот"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Информационный футер */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] text-white/40">
            <Info size={13} className="text-blue-400 shrink-0" />
            <span>Вы также можете просто поделиться результатом анализа в формате PDF по кнопке на главном экране.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
