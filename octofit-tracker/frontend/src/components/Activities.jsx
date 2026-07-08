import { useState, useEffect } from 'react'
import { fetchFromApi } from '../utils/api'

export default function Activities() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      setLoading(true)
      const data = await fetchFromApi('/activities/')
      setActivities(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="alert alert-info">Loading activities...</div>
  }

  if (error) {
    return <div className="alert alert-danger">Error loading activities: {error}</div>
  }

  return (
    <div>
      <h2>Activities</h2>
      <button className="btn btn-primary mb-3" onClick={loadActivities}>
        Refresh
      </button>

      {activities.length === 0 ? (
        <div className="alert alert-warning">No activities found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Type</th>
                <th>Duration (min)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id || activity._id}>
                  <td>{activity.id || activity._id}</td>
                  <td>{activity.userId || activity.user_id}</td>
                  <td>{activity.type}</td>
                  <td>{activity.duration}</td>
                  <td>{new Date(activity.date || activity.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
