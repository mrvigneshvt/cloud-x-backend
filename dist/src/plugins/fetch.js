"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchWithRetry = void 0;
const fetchWithRetry = (url_1, options_1, ...args_1) => __awaiter(void 0, [url_1, options_1, ...args_1], void 0, function* (url, options, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = yield fetch(url, options);
            if (response.ok)
                return yield response.json();
            console.log(`Attempt ${i + 1} failed: ${response.status} ${response.statusText}`);
            if (response.status >= 500) {
                yield new Promise((resolve) => setTimeout(resolve, delay * (i + 1))); // Exponential backoff
                continue;
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.log(`Attempt ${i + 1} failed: ${error}`);
            yield new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
        }
    }
    return null;
});
exports.fetchWithRetry = fetchWithRetry;
