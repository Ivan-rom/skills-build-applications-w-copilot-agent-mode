import { useState, useEffect } from 'react'
import { fetchFromApi } from '../utils/api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await fetchFromApi('/users/')
      setUsers(data)
      setError(null)
    } catch (err) {
      setError(err.message)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="alert alert-info">Loading users...</div>
  }

  if (error) {
    return <div className="alert alert-danger">Error loading users: {error}</div>
  }

  return (
    <div>
      <h2>Users</h2>
      <button className="btn btn-primary mb-3" onClick={loadUsers}>
        Refresh
      </button>

      {users.length === 0 ? (
        <div className="alert alert-warning">No users found</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id || user._id}>
                  <td>{user.id || user._id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
