import fs from "fs";

let appCode = fs.readFileSync("src/App.tsx", "utf-8");

const importLine = `import { useTokenManager } from "./hooks/useTokenManager";\n`;
if (!appCode.includes(importLine)) {
    const appCompIndex = appCode.indexOf("export default function App() {");
    appCode = appCode.substring(0, appCompIndex) + importLine + appCode.substring(appCompIndex);
}

const hookInstantiation = `
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

// Replace all state and functions
const statesToReplace = [
  "const [generationsLeft, setGenerationsLeft] = useState<number | null>(null);\\n",
  "const [history, setHistory] = useState<any\\[\\]>\\(\\[\\]\\);\\n",
  "const [userId, setUserId] = useState<string \\| null>\\(null\\);\\n",
  "const [initError, setInitError] = useState<string \\| null>\\(null\\);\\n",
  "const [isBuying, setIsBuying] = useState\\(false\\);\\n",
  "const [showBuyModal, setShowBuyModal] = useState\\(false\\);\\n"
];

for (let sr of statesToReplace) {
   appCode = appCode.replace(new RegExp("  " + sr), "");
}

// remove const tg and const isTelegramEnv at the beginning of App()
appCode = appCode.replace(/  const tg = window\.Telegram\?\.WebApp;\n/, "");
appCode = appCode.replace(/  const isTelegramEnv = !!tg\?\.initDataUnsafe\?\.user;\n/, "");


const extractStartStr = `useEffect(() => {
    const initUser = async () => {`;
const extractEndStr = `} finally {
      setIsBuying(false);
    }
  };`;

const startIndex = appCode.indexOf(extractStartStr);
const endIndex = appCode.indexOf(extractEndStr) + extractEndStr.length;

if (startIndex > -1 && endIndex > -1) {
    appCode = appCode.substring(0, startIndex) + hookInstantiation + appCode.substring(endIndex);
}

fs.writeFileSync("src/App.tsx", appCode);
console.log("Refactored tokens.");
