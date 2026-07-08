import { useState, useEffect } from 'react'
import { fetchFromApi } from '../utils/api'

export default function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadWorkouts()
  }, [])

  const loadWorkouts = async () => {
    try {
      setLoading(true)
      const data = await fetchFromApi('/workouts/')
      setWorkouts(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      setWorkouts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="alert alert-info">Loading workouts...</div>
  }

  if (error) {
    return <div className="alert alert-danger">Error loading workouts: {error}</div>
  }

  return (
    <div>
      <h2>Workouts</h2>
      <button className="btn btn-primary mb-3" onClick={loadWorkouts}>
        Refresh
      </button>

      {workouts.length === 0 ? (
        <div className="alert alert-warning">No workouts found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Difficulty</th>
                <th>Duration (min)</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) => (
                <tr key={workout.id || workout._id}>
                  <td>{workout.id || workout._id}</td>
                  <td>{workout.name}</td>
                  <td>{workout.type}</td>
                  <td>{workout.difficulty}</td>
                  <td>{workout.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
