import { customAlphabet } from "nanoid/non-secure";
const nanoid = customAlphabet('1234567890abcdef', 10)

export const generateId = () => nanoid(10);