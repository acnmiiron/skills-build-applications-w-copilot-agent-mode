import { useState } from 'react'
import CollectionFeedback from './CollectionFeedback.jsx'
import SearchField from './SearchField.jsx'
import useCollection, { displayName, matchesSearch } from '../hooks/useCollection.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/'

function Users() {
  const { records, loading, error, reload } = useCollection(endpoint, 'users')
  const [query, setQuery] = useState('')
  const users = records.filter((user) => matchesSearch(query, displayName(user), user.username, user.email, user.goal))

  return (
    <section className="page-view">
      <header className="view-heading"><div><p className="view-kicker">THE OCTOFIT COMMUNITY</p><h2 className="view-title">Members</h2><p className="view-intro">Get to know the people building healthy habits together.</p></div><span className="record-count">{records.length} MEMBERS</span></header>
      <div className="collection-toolbar"><div><h3>Member directory</h3><span>Profiles and personal goals</span></div><SearchField label="Search members" onChange={setQuery} value={query} /></div>
      <CollectionFeedback emptyMessage="Member profiles will appear here once they join." emptyTitle="No members yet" error={error} items={users} loading={loading} onRetry={reload}>
        <div className="table-frame"><div className="table-scroll"><table className="data-table">
          <thead><tr><th>MEMBER</th><th>FITNESS LEVEL</th><th>GOAL</th><th>TEAM</th></tr></thead>
          <tbody>{users.map((user) => <tr key={user._id}>
            <td><span className="member-cell">{displayName(user)}</span><span className="sub-cell">{user.email || user.username}</span></td>
            <td><span className={`level-tag level-${user.fitnessLevel || 'beginner'}`}>{user.fitnessLevel || 'beginner'}</span></td>
            <td>{user.goal || 'General fitness'}</td><td>{displayName(user.team) === 'Unknown member' ? 'Unassigned' : displayName(user.team)}</td>
          </tr>)}</tbody>
        </table></div></div>
      </CollectionFeedback>
    </section>
  )
}

export default Users