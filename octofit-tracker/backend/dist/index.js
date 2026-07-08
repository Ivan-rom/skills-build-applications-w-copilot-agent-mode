"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const models_1 = require("./models");
const app = (0, express_1.default)();
const port = Number(process.env.PORT || 8000);
app.use(express_1.default.json());
function getApiBaseUrl(req) {
    if (process.env.CODESPACE_NAME) {
        return `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`;
    }
    const forwardedProto = req.headers['x-forwarded-proto'];
    const protocol = forwardedProto === 'https' ? 'https' : 'http';
    const host = req.headers.host || `localhost:${port}`;
    return `${protocol}://${host}`;
}
async function sendCollection(res, resourceName, query, req) {
    try {
        const items = await query();
        res.json({
            resource: resourceName,
            count: items.length,
            items,
            apiUrl: getApiBaseUrl(req),
        });
    }
    catch (error) {
        console.error(`Error fetching ${resourceName}:`, error);
        res.status(500).json({ error: `Failed to fetch ${resourceName}` });
    }
}
app.get('/', (req, res) => {
    res.json({
        message: 'OctoFit Tracker API',
        apiUrl: getApiBaseUrl(req),
    });
});
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', apiUrl: getApiBaseUrl(req) });
});
app.get(['/api/users', '/api/users/'], (req, res) => {
    void sendCollection(res, 'users', () => models_1.User.find().lean(), req);
});
app.get(['/api/teams', '/api/teams/'], (req, res) => {
    void sendCollection(res, 'teams', () => models_1.Team.find().lean(), req);
});
app.get(['/api/activities', '/api/activities/'], (req, res) => {
    void sendCollection(res, 'activities', () => models_1.Activity.find().populate('userId', 'username').lean(), req);
});
app.get(['/api/leaderboard', '/api/leaderboard/'], (req, res) => {
    void sendCollection(res, 'leaderboard', () => models_1.LeaderboardEntry.find().populate('userId', 'username').lean(), req);
});
app.get(['/api/workouts', '/api/workouts/'], (req, res) => {
    void sendCollection(res, 'workouts', () => models_1.Workout.find().lean(), req);
});
void (0, database_1.connectToDatabase)();
app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
});
