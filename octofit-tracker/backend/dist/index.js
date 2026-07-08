"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./config/database");
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 8000);
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.send('OctoFit Tracker API');
});
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
mongoose_1.default.connection.once('open', () => {
    app.listen(port, () => {
        console.log(`API listening on http://localhost:${port}`);
    });
});
