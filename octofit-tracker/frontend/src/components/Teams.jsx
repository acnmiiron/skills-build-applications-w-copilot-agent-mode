import { useState } from 'react'
import CollectionFeedback from './CollectionFeedback.jsx'
import SearchField from './SearchField.jsx'
import useCollection, { displayName, matchesSearch } from '../hooks/useCollection.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/'

function Teams() {
  const { records, loading, error, reload } = useCollection(endpoint, 'teams')
  const [query, setQuery] = useState('')
  const teams = records.filter((team) => matchesSearch(query, team.name, team.description, ...(team.members || []).map(displayName)))

  return (
    <section className="page-view">
      <header className="view-heading"><div><p className="view-kicker">BETTER TOGETHER</p><h2 className="view-title">Teams</h2><p className="view-intro">Find your people, share a goal, and keep each other moving.</p></div><span className="record-count">{records.length} TEAMS</span></header>
      <div className="collection-toolbar"><div><h3>Team roster</h3><span>Members and team goals</span></div><SearchField label="Search teams" onChange={setQuery} value={query} /></div>
      <CollectionFeedback emptyMessage="New teams will show up here when they are created." emptyTitle="No teams yet" error={error} items={teams} loading={loading} onRetry={reload}>
        <div className="team-list">{teams.map((team, index) => <article className="team-row" key={team._id}>
          <div className={`team-index team-index-${index % 3}`}>0{index + 1}</div>
          <div className="team-copy"><h4>{team.name}</h4><p>{team.description || 'A crew for staying active together.'}</p>
            <div className="member-chips">{(team.members || []).slice(0, 4).map((member) => <span key={member._id || member}>{displayName(member)}</span>)}{(team.members || []).length > 4 && <span>+{team.members.length - 4}</span>}</div>
          </div>
          <div className="team-size"><strong>{(team.members || []).length}</strong><span>{(team.members || []).length === 1 ? 'MEMBER' : 'MEMBERS'}</span></div>
        </article>)}</div>
      </CollectionFeedback>
    </section>
  )
}

export default Teams