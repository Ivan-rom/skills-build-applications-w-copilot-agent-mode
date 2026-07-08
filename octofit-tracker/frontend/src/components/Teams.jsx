import { useState, useEffect } from 'react'
import { fetchFromApi } from '../utils/api'

export default function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const data = await fetchFromApi('/teams/')
      setTeams(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      setTeams([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="alert alert-info">Loading teams...</div>
  }

  if (error) {
    return <div className="alert alert-danger">Error loading teams: {error}</div>
  }

  return (
    <div>
      <h2>Teams</h2>
      <button className="btn btn-primary mb-3" onClick={loadTeams}>
        Refresh
      </button>

      {teams.length === 0 ? (
        <div className="alert alert-warning">No teams found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Leader ID</th>
                <th>Members</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id || team._id}>
                  <td>{team.id || team._id}</td>
                  <td>{team.name}</td>
                  <td>{team.leaderId || team.leader_id}</td>
                  <td>{team.members?.length || 0}</td>
                  <td>{new Date(team.createdAt || team.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
