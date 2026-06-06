import fs from "fs";

let appCode = fs.readFileSync("src/App.tsx", "utf-8");

const startStr = 'const [preferredStyle, setPreferredStyle] = useState<string>("Любой");';
const endStr = '  const deleteHistoryItem = async (';

const startIndex = appCode.indexOf(startStr) + startStr.length;
const endIndex = appCode.indexOf(endStr);

if (startIndex > -1 && endIndex > -1) {
    const replacement = `
  const {
    generationsLeft,
    setGenerationsLeft,
    history,
    setHistory,
    userId,
    initError,
    consumeToken,
    buyTokens,
    checkLimits,
    processPayment,
    isBuying,
    showBuyModal,
    setShowBuyModal,
    isTelegramEnv
  } = useTokenManager();

`;
    appCode = appCode.substring(0, startIndex) + replacement + appCode.substring(endIndex);
}

fs.writeFileSync("src/App.tsx", appCode);
console.log("Replaced block");
