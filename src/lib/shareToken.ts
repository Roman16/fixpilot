import {randomBytes} from "crypto";

export const generateShareToken = () => randomBytes(16).toString("hex");
