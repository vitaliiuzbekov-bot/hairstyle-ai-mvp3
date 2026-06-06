import fs from "fs";

let appCode = fs.readFileSync("src/App.tsx", "utf-8");

const start1 = "const [generationsLeft, setGenerationsLeft] = useState<number | null>(null);";
const end1 = "const [history, setHistory] = useState<any[]>([]);";
const end1b = "const [userId, setUserId] = useState<string | null>(null);";
const end1c = "const [initError, setInitError] = useState<string | null>(null);";

appCode = appCode.replace(start1, "");
appCode = appCode.replace(end1, "");
appCode = appCode.replace(end1b, "");
appCode = appCode.replace(end1c, "");

const extractStartBase = `  useEffect(() => {
    const initUser = async () => {`;
const extractEndBase = `    } finally {
      setIsBuying(false);
    }
  };`;

const startIndex = appCode.indexOf(extractStartBase);
const endIndex = appCode.indexOf(extractEndBase) + extractEndBase.length;

if (startIndex > -1 && endIndex > -1) {
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
    appCode = appCode.substring(0, startIndex) + hookInstantiation + appCode.substring(endIndex);
}

appCode = appCode.replace("const [isBuying, setIsBuying] = useState(false);", "");
appCode = appCode.replace("const [showBuyModal, setShowBuyModal] = useState(false);", "");

fs.writeFileSync("src/App.tsx", appCode);
console.log("Tokens replaced");
