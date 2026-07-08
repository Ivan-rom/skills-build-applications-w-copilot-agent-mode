import express, { type Request, type Response } from 'express';
import { connectToDatabase } from './config/database';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';

export const port = Number(process.env.PORT || 8000);

export function getApiBaseUrl(req: Request): string {
  const codespaceName = process.env.CODESPACE_NAME?.trim();

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }

  const forwardedProto = req.headers['x-forwarded-proto'];
  const protocol = forwardedProto === 'https' ? 'https' : 'http';
  const host = req.headers.host || `localhost:${port}`;

  return `${protocol}://${host}`;
}

async function sendCollection<T>(res: Response, resourceName: string, query: () => Promise<T[]>, req: Request) {
  try {
    const items = await query();
    res.json({
      resource: resourceName,
      count: items.length,
      items,
      apiUrl: getApiBaseUrl(req),
    });
  } catch (error) {
    console.error(`Error fetching ${resourceName}:`, error);
    res.status(500).json({ error: `Failed to fetch ${resourceName}` });
  }
}

export function createServer() {
  const app = express();

  app.use(express.json());

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
    void sendCollection(res, 'users', () => User.find().lean(), req);
  });

  app.get(['/api/teams', '/api/teams/'], (req, res) => {
    void sendCollection(res, 'teams', () => Team.find().lean(), req);
  });

  app.get(['/api/activities', '/api/activities/'], (req, res) => {
    void sendCollection(res, 'activities', () => Activity.find().populate('userId', 'username').lean(), req);
  });

  app.get(['/api/leaderboard', '/api/leaderboard/'], (req, res) => {
    void sendCollection(res, 'leaderboard', () => LeaderboardEntry.find().populate('userId', 'username').lean(), req);
  });

  app.get(['/api/workouts', '/api/workouts/'], (req, res) => {
    void sendCollection(res, 'workouts', () => Workout.find().lean(), req);
  });

  return app;
}

const app = createServer();

export default app;

export function startServer() {
  void connectToDatabase();

  app.listen(port, '0.0.0.0', () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}
