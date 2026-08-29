import React, { useState } from "react";
import { X, Star, Gift, Share2, Copy, Check, ShieldCheck, Sparkles, Building2, Smartphone, ArrowRight, Loader2 } from "lucide-react";
import { useScrollLock } from "../hooks/useScrollLock";
import { useModalBackButton } from "../hooks/useTelegramBackButton";
import { shareToTelegram } from "../utils/telegram";

export interface PackageOption {
  id: string;
  count: number;
  rubPrice: number;
  stars: number;
  label: string;
  badge?: string;
  perGen: string;
  isPopular?: boolean;
}

export const PAYMENT_PACKAGES: PackageOption[] = [
  {
    id: "start",
    count: 10,
    rubPrice: 190,
    stars: 50,
    label: "10 генераций",
    badge: "Старт",
    perGen: "19 ₽/ген • бессрочные"
  },
  {
    id: "hit",
    count: 50,
    rubPrice: 690,
    stars: 200,
    label: "50 генераций",
    badge: "Хит • Выгода 25%",
    perGen: "13.8 ₽/ген • бессрочные",
    isPopular: true
  },
  {
    id: "pro",
    count: 150,
    rubPrice: 1690,
    stars: 500,
    label: "150 генераций",
    badge: "Профи • Выгода 40%",
    perGen: "11.2 ₽/ген • бессрочные"
  }
];

const SBP_PHONE = "+79059804683";
const SBP_BANKS = ["Озон банк", "ОТП банк"] as const;

export interface BuyModalProps {
  showBuyModal: boolean;
  setShowBuyModal: (show: boolean) => void;
  isBuying: boolean;
  userId: string | null;
  generationsLeft?: number | null;
  processPayment: (packageId: string, stars: number, tokens: number) => Promise<void>;
  notifySbpPayment?: (packageId: string, selectedBank: string) => Promise<any>;
  isLightMode?: boolean;
}

export const BuyModal: React.FC<BuyModalProps> = ({
  showBuyModal,
  setShowBuyModal,
  isBuying,
  userId,
  generationsLeft,
  processPayment,
  notifySbpPayment,
  isLightMode = false,
}) => {
  useScrollLock(showBuyModal);
  useModalBackButton(showBuyModal, () => setShowBuyModal(false));

  const [paymentMethod, setPaymentMethod] = useState<"sbp" | "stars">("sbp");
  const [selectedPackageId, setSelectedPackageId] = useState<string>("hit");
  const [selectedBank, setSelectedBank] = useState<string>("Озон банк");
  const [isCopied, setIsCopied] = useState(false);
  const [isRefCopied, setIsRefCopied] = useState(false);
  const [isSbpSent, setIsSbpSent] = useState(false);
  const [sbpLoading, setSbpLoading] = useState(false);

  if (!showBuyModal) return null;

  const currentPackage = PAYMENT_PACKAGES.find(p => p.id === selectedPackageId) || PAYMENT_PACKAGES[1];
  const inviteLink = `https://t.me/neirostilist_bot/app?startapp=ref_${userId || 'guest'}`;

  const handleCopyPhone = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(SBP_PHONE);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = SBP_PHONE;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const handleCopyRefLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(inviteLink);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = inviteLink;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setIsRefCopied(true);
      setTimeout(() => setIsRefCopied(false), 2500);
    } catch (e) {
      console.error("Copy ref failed:", e);
    }
  };

  const handleSbpPaid = async () => {
    if (!notifySbpPayment) return;
    setSbpLoading(true);
    try {
      await notifySbpPayment(currentPackage.id, selectedBank);
      setIsSbpSent(true);
    } catch (err: any) {
      alert(err.message || "Произошла ошибка при отправке запроса");
    } finally {
      setSbpLoading(false);
    }
  };

  const handleClose = () => {
    setIsSbpSent(false);
    setShowBuyModal(false);
  };

  return (
    <div className={`fixed-viewport z-[200] flex items-center justify-center p-3 sm:p-4 ${isLightMode ? 'bg-black/60 backdrop-blur-md' : 'bg-black/85 backdrop-blur-md'}`}>
      <div className={`w-full max-w-md rounded-[2rem] p-5 sm:p-6 shadow-2xl relative flex flex-col items-center animate-in zoom-in-95 fade-in duration-300 overflow-hidden ${
        isLightMode ? 'bg-white border border-gray-200 text-slate-900' : 'bg-[#0f0c1b] border border-white/10 text-white'
      } max-h-[92vh] overflow-y-auto custom-scrollbar`}>
        
        {/* Top subtle glow */}
        <div className="absolute top-[-20%] right-[-20%] w-[120%] h-[120%] bg-gradient-to-bl from-amber-500/15 via-transparent to-transparent blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-20 ${
            isLightMode ? 'hover:bg-gray-100 text-gray-500 hover:text-slate-900' : 'hover:bg-white/10 text-white/60 hover:text-white'
          }`}
          aria-label="Закрыть"
        >
          <X size={20} className="stroke-current" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center mt-1 mb-4 z-10 w-full">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center mb-2 shadow-lg shadow-amber-500/25">
            <Star size={24} className="text-black fill-black" />
          </div>
          <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${
            isLightMode ? 'text-slate-900' : 'bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 bg-clip-text text-transparent'
          }`}>
            Пополнение баланса
          </h2>
          <div className={`flex items-center gap-1.5 mt-1 text-xs font-bold px-3 py-1 rounded-full border ${
            isLightMode ? 'bg-amber-100/80 border-amber-300 text-amber-900' : 'bg-amber-500/10 border-amber-500/25 text-amber-300'
          }`}>
            <span>Ваш баланс: ★ {generationsLeft !== null && generationsLeft !== undefined ? generationsLeft : "0"} генераций</span>
          </div>
        </div>

        {isSbpSent ? (
          /* SBP Success State */
          <div className="w-full flex flex-col items-center text-center py-4 z-10 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-4 text-emerald-500 animate-bounce">
              <Check size={32} className="stroke-[3]" />
            </div>
            <h3 className={`text-lg font-black mb-2 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>Заявка отправлена!</h3>
            <p className={`text-xs sm:text-sm mb-4 leading-relaxed px-2 font-medium ${isLightMode ? 'text-slate-700' : 'text-white/80'}`}>
              Администратор получил уведомление о переводе на сумму <b className={isLightMode ? 'text-slate-950 font-bold' : 'text-white'}>{currentPackage.rubPrice} ₽</b> ({selectedBank}).
            </p>
            <div className={`w-full p-4 rounded-2xl border mb-6 text-left text-xs ${
              isLightMode ? 'bg-amber-50 border-amber-300 text-amber-950 font-medium' : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
            }`}>
              <p className="font-bold mb-1 flex items-center gap-1.5 text-sm">
                <Sparkles size={16} className="text-amber-500 shrink-0" />
                Что происходит дальше?
              </p>
              <p className="leading-relaxed opacity-95">
                После проверки зачисления в банке генерации (<b>+{currentPackage.count} шт.</b>) моментально появятся на вашем балансе.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-lg shadow-amber-500/20 hover:opacity-95 active:scale-[0.98] transition-all"
            >
              Понятно, ожидаю начисления
            </button>
          </div>
        ) : (
          /* Normal Buying Form */
          <>
            {/* Payment Method Selector Tabs */}
            <div className={`w-full grid grid-cols-2 gap-1.5 p-1 rounded-2xl border mb-4 z-10 ${
              isLightMode ? 'bg-gray-100 border-gray-200' : 'bg-black/40 border-white/10'
            }`}>
              <button
                type="button"
                onClick={() => setPaymentMethod("sbp")}
                className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === "sbp"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-400/40"
                    : isLightMode ? "text-slate-600 hover:text-slate-900" : "text-white/60 hover:text-white"
                }`}
              >
                <span>💳 Оплата СБП</span>
                <span className="text-[10px] py-0.5 px-1.5 rounded-md bg-emerald-400/30 text-emerald-200 font-black">0%</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("stars")}
                className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === "stars"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md border border-amber-300/60 font-black"
                    : isLightMode ? "text-slate-600 hover:text-slate-900" : "text-white/60 hover:text-white"
                }`}
              >
                <Star size={14} className="fill-current text-amber-500" />
                <span>TG Stars</span>
              </button>
            </div>

            {/* STEP 1: Package Selection */}
            <div className="w-full flex flex-col gap-2 z-10 mb-4">
              <div className="flex items-center justify-between px-1 mb-0.5">
                <span className={`text-[11px] font-black uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-white/70'}`}>
                  1. Выберите пакет генераций:
                </span>
              </div>

              {PAYMENT_PACKAGES.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`relative flex items-center justify-between w-full p-3.5 rounded-2xl border cursor-pointer active:scale-[0.99] transition-all overflow-hidden ${
                      isSelected
                        ? isLightMode
                          ? "bg-amber-50 border-amber-500 shadow-md ring-2 ring-amber-400/30"
                          : "bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                        : isLightMode
                          ? "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 shadow-sm"
                          : "bg-white/5 border-white/10 hover:bg-white/[0.08]"
                    }`}
                  >
                    {/* Radio Button Circle & Info */}
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? "border-amber-500 bg-amber-500 text-black shadow-sm" 
                          : isLightMode ? "border-gray-400 bg-white" : "border-white/40 bg-transparent"
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                      </div>

                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2">
                          <span className={`font-black text-sm sm:text-base ${
                            isSelected 
                              ? isLightMode ? "text-slate-950" : "text-white" 
                              : isLightMode ? "text-slate-800" : "text-white/90"
                          }`}>
                            {pkg.label}
                          </span>
                          {pkg.badge && (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                              pkg.isPopular
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-sm"
                                : isLightMode ? "bg-slate-200 text-slate-800" : "bg-white/20 text-white font-bold"
                            }`}>
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                        <span className={`text-[11px] font-medium mt-0.5 ${isLightMode ? 'text-slate-600' : 'text-white/70'}`}>
                          {pkg.perGen}
                        </span>
                      </div>
                    </div>

                    {/* Price Tag */}
                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <span className={`font-black text-base sm:text-lg tracking-tight ${
                        isSelected 
                          ? isLightMode ? "text-amber-600" : "text-amber-400"
                          : isLightMode ? "text-slate-900" : "text-white"
                      }`}>
                        {paymentMethod === "sbp" ? `${pkg.rubPrice} ₽` : `${pkg.stars} ⭐`}
                      </span>
                      {paymentMethod === "sbp" && (
                        <span className={`text-[10px] font-bold ${isLightMode ? 'text-slate-500' : 'text-white/50'}`}>
                          ({pkg.stars} Stars)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* STEP 2: Payment Details */}
            {paymentMethod === "sbp" ? (
              /* SBP Mode Details */
              <div className="w-full flex flex-col gap-3 z-10 mb-2">
                <div className="flex items-center justify-between px-1">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-white/70'}`}>
                    2. Реквизиты для перевода СБП:
                  </span>
                  <span className={`text-[11px] font-bold flex items-center gap-1 ${isLightMode ? 'text-emerald-700' : 'text-emerald-400'}`}>
                    <ShieldCheck size={14} />
                    Без комиссии
                  </span>
                </div>

                {/* SBP Phone & Copy Block */}
                <div className={`w-full p-3.5 rounded-2xl border flex flex-col gap-2.5 ${
                  isLightMode ? 'bg-slate-50 border-gray-200' : 'bg-white/[0.04] border-white/10'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl border ${
                        isLightMode 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        <Smartphone size={18} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className={`text-[10px] uppercase font-black tracking-wider ${isLightMode ? 'text-slate-500' : 'text-white/50'}`}>
                          Номер телефона (СБП):
                        </span>
                        <span className={`font-mono font-black text-base sm:text-lg tracking-wider ${
                          isLightMode ? 'text-emerald-700' : 'text-emerald-400'
                        }`}>
                          {SBP_PHONE}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 ${
                        isCopied
                          ? "bg-emerald-500 text-black shadow-md"
                          : isLightMode ? "bg-slate-200 text-slate-800 hover:bg-slate-300 border border-slate-300" : "bg-white/15 text-white hover:bg-white/20"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check size={14} className="stroke-[3]" />
                          <span>Скопировано</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Скопировать</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bank Selector strictly: Озон банк / ОТП банк */}
                  <div className={`pt-2 border-t flex flex-col gap-1.5 text-left ${isLightMode ? 'border-gray-200' : 'border-white/10'}`}>
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isLightMode ? 'text-slate-600' : 'text-white/50'}`}>
                      Банк получателя (переводите строго в один из них):
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {SBP_BANKS.map((bank) => {
                        const isBankActive = selectedBank === bank;
                        return (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => setSelectedBank(bank)}
                            className={`py-2 px-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                              isBankActive
                                ? bank === "Озон банк"
                                  ? isLightMode 
                                    ? "bg-blue-50 border-blue-500 text-blue-800 shadow-sm" 
                                    : "bg-blue-600/30 border-blue-400 text-blue-300 shadow-sm"
                                  : isLightMode
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm"
                                    : "bg-emerald-600/30 border-emerald-400 text-emerald-300 shadow-sm"
                                : isLightMode ? "bg-white border-gray-200 text-slate-700 hover:bg-gray-100" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                            }`}
                          >
                            <Building2 size={13} />
                            <span>{bank}</span>
                            {isBankActive && <Check size={13} className="stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* SBP Action Button */}
                <button
                  type="button"
                  onClick={handleSbpPaid}
                  disabled={sbpLoading || isBuying}
                  className="w-full py-3.5 sm:py-4 px-4 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-black shadow-lg shadow-emerald-500/25 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sbpLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Отправка уведомления...</span>
                    </>
                  ) : (
                    <>
                      <span>🟢 Я оплатил(а) перевод ({currentPackage.rubPrice} ₽)</span>
                      <ArrowRight size={16} className="stroke-[3]" />
                    </>
                  )}
                </button>

                <p className={`text-[11px] text-center font-medium leading-normal px-2 ${isLightMode ? 'text-slate-600' : 'text-white/60'}`}>
                  После перевода в <b>{selectedBank}</b> нажмите кнопку выше. Администратор проверит поступление и моментально начислит генерации.
                </p>
              </div>
            ) : (
              /* Telegram Stars Mode */
              <div className="w-full flex flex-col gap-3 z-10 mb-2">
                <div className="flex items-center justify-between px-1">
                  <span className={`text-[11px] font-black uppercase tracking-wider ${isLightMode ? 'text-slate-700' : 'text-white/70'}`}>
                    2. Оплата через Telegram Stars:
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => processPayment(currentPackage.id, currentPackage.stars, currentPackage.count)}
                  disabled={isBuying}
                  className="w-full py-3.5 sm:py-4 px-4 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black shadow-lg shadow-amber-500/25 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isBuying ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Создание счета...</span>
                    </>
                  ) : (
                    <>
                      <Star size={18} className="fill-black text-black" />
                      <span>Оплатить {currentPackage.stars} Stars</span>
                    </>
                  )}
                </button>

                <p className={`text-[11px] text-center font-medium leading-normal px-2 ${isLightMode ? 'text-slate-600' : 'text-white/60'}`}>
                  Оплата спишется с вашего баланса Telegram Stars, и генерации будут начислены мгновенно.
                </p>
              </div>
            )}

            {/* Bottom Referral / Affiliate Block */}
            <div className={`mt-3 pt-3 w-full border-t text-center relative z-10 ${isLightMode ? 'border-gray-200' : 'border-white/10'}`}>
              <div className={`p-3.5 rounded-2xl border flex flex-col gap-2.5 ${
                isLightMode ? 'bg-purple-50/90 border-purple-300 text-purple-950' : 'bg-purple-500/10 border-purple-500/30 text-purple-200'
              }`}>
                <div className="flex items-center justify-between gap-2 text-left">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl shrink-0 ${isLightMode ? 'bg-purple-200 text-purple-800' : 'bg-purple-500/20 text-purple-300'}`}>
                      <Gift size={18} />
                    </div>
                    <div>
                      <h4 className={`font-black text-xs sm:text-sm ${isLightMode ? 'text-purple-950' : 'text-purple-100'}`}>
                        🎁 Бесплатные генерации за друга!
                      </h4>
                      <p className={`text-[11px] font-medium leading-tight mt-0.5 ${isLightMode ? 'text-purple-800' : 'text-purple-300/80'}`}>
                        <b>+1 генерация вам</b> и <b>+1 генерация другу</b> за каждого приглашенного.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Referral Buttons: Share & Copy */}
                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      shareToTelegram(inviteLink, "Смотри, какой крутой ИИ-стилист! Заходи по моей ссылке и получи бонусные генерации причесок 🎁✂️");
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm ${
                      isLightMode ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-600 text-white hover:bg-purple-500'
                    }`}
                  >
                    <Share2 size={14} />
                    <span>Пригласить</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyRefLink}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 active:scale-95 transition-all border ${
                      isRefCopied
                        ? "bg-emerald-500 text-black border-emerald-400"
                        : isLightMode 
                          ? "bg-white text-purple-900 border-purple-300 hover:bg-purple-100/50" 
                          : "bg-white/10 text-purple-200 border-purple-500/40 hover:bg-white/15"
                    }`}
                  >
                    {isRefCopied ? (
                      <>
                        <Check size={14} className="stroke-[3]" />
                        <span>Скопировано!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Копировать ссылку</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BuyModal;

