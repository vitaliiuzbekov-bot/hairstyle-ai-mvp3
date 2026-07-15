import fs from 'fs';

const file = 'src/services/api.ts';
let code = fs.readFileSync(file, 'utf8');

const oldHtmlError = 'if (textResponse.includes("<!doctype html>") || textResponse.includes("<!DOCTYPE html>")) {';
const newHtmlError = 'if (textResponse.trim().toLowerCase().startsWith("<!doctype html>")) {';

if (code.includes(oldHtmlError)) {
    code = code.replace(oldHtmlError, newHtmlError);
}

const oldProxyError = 'throw new Error(`Ошибка сети: Сервер перегружен или недоступен (HTML Proxy Error, HTTP ${response.status}). Пожалуйста, подождите немного и повторите попытку.`);';
const newProxyError = 'throw new Error(`Сбой сети: Сервер перегружен или вернул HTML-страницу (Код ${response.status}). Возможно, вы загружаете слишком большое фото (>15МБ). Попробуйте еще раз.`);';

if (code.includes(oldProxyError)) {
    code = code.replace(oldProxyError, newProxyError);
}

fs.writeFileSync(file, code);
console.log("Successfully patched api.ts");
