import { useState } from 'react'
import CollectionFeedback from './CollectionFeedback.jsx'
import SearchField from './SearchField.jsx'
import useCollection, { displayName, formatDate, matchesSearch } from '../hooks/useCollection.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/'

function Activities() {
  const { records, loading, error, reload } = useCollection(endpoint, 'activities')
  const [query, setQuery] = useState('')
  const activities = records.filter((activity) => matchesSearch(query, activity.activityType, displayName(activity.user), activity.notes))
  const totalMinutes = records.reduce((sum, activity) => sum + (Number(activity.durationMinutes) || 0), 0)
  const totalPoints = records.reduce((sum, activity) => sum + (Number(activity.points) || 0), 0)

  return (
    <section className="page-view">
      <header className="view-heading"><div><p className="view-kicker">YOUR MOVEMENT</p><h2 className="view-title">Activity log</h2><p className="view-intro">Every session counts. Keep track of the work you put in.</p></div><span className="record-count">{records.length} SESSIONS</span></header>
      <div className="metric-row">
        <article className="metric-tile metric-lime"><span className="metric-label">SESSIONS LOGGED</span><strong>{records.length}</strong><span className="metric-foot">All recorded activity</span></article>
        <article className="metric-tile metric-white"><span className="metric-label">ACTIVE MINUTES</span><strong>{totalMinutes}</strong><span className="metric-foot">Minutes on the move</span></article>
        <article className="metric-tile metric-coral"><span className="metric-label">POINTS EARNED</span><strong>{totalPoints}</strong><span className="metric-foot">Across this activity list</span></article>
      </div>
      <div className="collection-toolbar"><div><h3>Recent sessions</h3><span>Newest activity first</span></div><SearchField label="Search activities" onChange={setQuery} value={query} /></div>
      <CollectionFeedback emptyMessage="Activity entries will appear here once they are logged." emptyTitle="No activities yet" error={error} items={activities} loading={loading} onRetry={reload}>
        <div className="table-frame"><div className="table-scroll"><table className="data-table">
          <thead><tr><th>ACTIVITY</th><th>MEMBER</th><th>DATE</th><th>TIME</th><th>DISTANCE</th><th>POINTS</th></tr></thead>
          <tbody>{activities.map((activity) => <tr key={activity._id}>
            <td><span className="activity-type">{activity.activityType?.replaceAll('-', ' ') || 'Activity'}</span></td>
            <td className="member-cell">{displayName(activity.user)}</td>
            <td>{formatDate(activity.completedAt)}</td><td>{activity.durationMinutes ?? 0} min</td>
            <td>{Number(activity.distanceKm || 0).toFixed(1)} km</td><td><strong className="points-value">{activity.points ?? 0}</strong></td>
          </tr>)}</tbody>
        </table></div></div>
      </CollectionFeedback>
    </section>
  )
}

export default Activities