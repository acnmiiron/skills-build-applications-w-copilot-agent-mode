import { useState } from 'react'
import CollectionFeedback from './CollectionFeedback.jsx'
import SearchField from './SearchField.jsx'
import useCollection, { matchesSearch } from '../hooks/useCollection.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/'

function Workouts() {
  const { records, loading, error, reload } = useCollection(endpoint, 'workouts')
  const [query, setQuery] = useState('')
  const workouts = records.filter((workout) => matchesSearch(query, workout.title, workout.description, workout.activityType, workout.level, workout.goal))

  return (
    <section className="page-view">
      <header className="view-heading"><div><p className="view-kicker">A PLAN FOR TODAY</p><h2 className="view-title">Workouts</h2><p className="view-intro">Choose a session that fits your energy, experience, and goals.</p></div><span className="record-count">{records.length} SESSIONS</span></header>
      <div className="collection-toolbar"><div><h3>Suggested sessions</h3><span>Movement for every level</span></div><SearchField label="Search workouts" onChange={setQuery} value={query} /></div>
      <CollectionFeedback emptyMessage="Workout ideas will show up here as they are added." emptyTitle="No workouts available" error={error} items={workouts} loading={loading} onRetry={reload}>
        <div className="workout-grid">{workouts.map((workout, index) => <article className="workout-item" key={workout._id}>
          <div className={`workout-band workout-band-${index % 3}`}><span>{workout.activityType?.replaceAll('-', ' ') || 'Movement'}</span><span>{workout.durationMinutes ?? 0} MIN</span></div>
          <div className="workout-copy"><div className="workout-tags"><span className={`level-tag level-${workout.level || 'beginner'}`}>{workout.level || 'all levels'}</span><span className="goal-tag">{workout.goal || 'general fitness'}</span></div><h4>{workout.title}</h4><p>{workout.description}</p></div>
        </article>)}</div>
      </CollectionFeedback>
    </section>
  )
}

export default Workouts