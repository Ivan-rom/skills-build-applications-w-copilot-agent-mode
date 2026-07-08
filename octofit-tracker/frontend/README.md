# Octofit Tracker Frontend

React 19 + Vite presentation tier for the Octofit Tracker multi-tier application.

## Features

- **React 19** with Vite for fast development and building
- **React Router** for client-side navigation
- **Bootstrap 5** for styling
- **Environment variables** for dynamic API configuration
- **Component-based architecture** for Users, Activities, Workouts, Teams, and Leaderboard
- **Fallback API URL** handling when `VITE_CODESPACE_NAME` is not set

## Environment Setup

The frontend requires the `VITE_CODESPACE_NAME` environment variable to construct API URLs.

### For Local Development

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. The fallback will use `http://localhost:8000/api` when `VITE_CODESPACE_NAME` is not set.

### For GitHub Codespaces

In GitHub Codespaces, `VITE_CODESPACE_NAME` is automatically provided by the environment. The frontend will construct API URLs like:
```
https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api
```

If you need to manually set it (e.g., for testing), update `.env.local`:
```
VITE_CODESPACE_NAME=your-codespace-name
```

## Project Structure

```
src/
├── components/          # Feature components
│   ├── Users.jsx
│   ├── Activities.jsx
│   ├── Workouts.jsx
│   ├── Teams.jsx
│   └── Leaderboard.jsx
├── utils/
│   └── api.js          # API utilities and environment configuration
├── App.jsx             # Main app with routing
└── main.jsx            # React 19 entry point
```

## API Integration

All API calls go through `src/utils/api.js`, which provides:

- `getApiBaseUrl()` - Returns the API base URL with proper fallback handling
- `fetchFromApi(endpoint, options)` - Fetches from API with support for:
  - Paginated responses (`data.results`)
  - Array responses
  - Direct object responses

### Example Component Usage

```jsx
import { fetchFromApi } from '../utils/api'

export default function Users() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchFromApi('/users/')
      .then(setUsers)
      .catch(err => console.error(err))
  }, [])

  return (/* render users */)
}
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Navigation

The app uses React Router for navigation between:
- `/` - Users list
- `/activities` - Activities list
- `/workouts` - Workouts list
- `/teams` - Teams list
- `/leaderboard` - Competitive leaderboard
