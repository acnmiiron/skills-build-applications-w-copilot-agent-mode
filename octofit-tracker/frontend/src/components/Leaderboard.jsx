import { useState } from 'react'
import CollectionFeedback from './CollectionFeedback.jsx'
import SearchField from './SearchField.jsx'
import useCollection, { displayName, matchesSearch } from '../hooks/useCollection.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/'

function Leaderboard() {
  const { records, loading, error, reload } = useCollection(endpoint, 'leaderboard')
  const [query, setQuery] = useState('')
  const standings = [...records]
    .sort((first, second) => (first.rank ?? Infinity) - (second.rank ?? Infinity) || (second.points ?? 0) - (first.points ?? 0))
    .filter((entry) => matchesSearch(query, displayName(entry.user), entry.period, entry.user?.username))

  return (
    <section className="page-view">
      <header className="view-heading"><div><p className="view-kicker">FRIENDLY COMPETITION</p><h2 className="view-title">Leaderboard</h2><p className="view-intro">Celebrate steady effort and the points earned along the way.</p></div><span className="record-count">{records.length} STANDINGS</span></header>
      <div className="collection-toolbar"><div><h3>All-time standings</h3><span>Sorted by rank and points</span></div><SearchField label="Search leaderboard" onChange={setQuery} value={query} /></div>
      <CollectionFeedback emptyMessage="Standings appear after members start earning points." emptyTitle="The board is ready" error={error} items={standings} loading={loading} onRetry={reload}>
        <div className="table-frame"><div className="table-scroll"><table className="data-table">
          <thead><tr><th>RANK</th><th>MEMBER</th><th>PERIOD</th><th className="numeric-cell">POINTS</th></tr></thead>
          <tbody>{standings.map((entry, index) => <tr key={entry._id}>
            <td><span className={`rank-mark${index === 0 ? ' rank-first' : ''}`}>{entry.rank ?? index + 1}</span></td>
            <td><span className="member-cell">{displayName(entry.user)}</span><span className="sub-cell">{entry.user?.username || 'OctoFit member'}</span></td>
            <td><span className="period-tag">{entry.period || 'all-time'}</span></td><td className="numeric-cell"><strong className="points-value">{entry.points ?? 0}</strong></td>
          </tr>)}</tbody>
        </table></div></div>
      </CollectionFeedback>
    </section>
  )
}

export default Leaderboard