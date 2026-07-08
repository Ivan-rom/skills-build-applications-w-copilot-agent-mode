import { useState, useEffect } from 'react'
import { fetchFromApi } from '../utils/api'

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      const data = await fetchFromApi('/leaderboard/')
      setLeaderboard(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      setLeaderboard([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="alert alert-info">Loading leaderboard...</div>
  }

  if (error) {
    return <div className="alert alert-danger">Error loading leaderboard: {error}</div>
  }

  return (
    <div>
      <h2>Leaderboard</h2>
      <button className="btn btn-primary mb-3" onClick={loadLeaderboard}>
        Refresh
      </button>

      {leaderboard.length === 0 ? (
        <div className="alert alert-warning">No leaderboard data found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User ID</th>
                <th>Username</th>
                <th>Score</th>
                <th>Activities</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry.id || entry._id || entry.userId}>
                  <td>{index + 1}</td>
                  <td>{entry.userId || entry.user_id}</td>
                  <td>{entry.username}</td>
                  <td>{entry.score || entry.totalScore || 0}</td>
                  <td>{entry.activitiesCount || entry.activities_count || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
