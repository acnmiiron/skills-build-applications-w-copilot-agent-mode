import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import './App.css'
import './Dashboard.css'

const navigation = [
  { to: '/activities', label: 'Activity log' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/teams', label: 'Teams' },
  { to: '/users', label: 'Members' },
  { to: '/workouts', label: 'Workouts' },
]

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const dateLabel = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(new Date())

function App() {
  return (
    <div className="app-frame">
      <aside className="sidebar">
        <NavLink className="brand-lockup" to="/activities" aria-label="OctoFit Tracker home">
          <img src={logo} alt="" />
          <span><strong>OctoFit</strong><small>TRACKER</small></span>
        </NavLink>
        <div className="sidebar-label">YOUR TRAINING</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) => `side-nav-link${isActive ? ' is-active' : ''}`}
              key={item.to}
              to={item.to}
            >
              <span className="nav-marker" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="note-label">A GOOD REMINDER</span>
            <p>Small efforts add up. Show up for the next one.</p>
          </div>
          <div className="sidebar-credit">MERGINGTON ATHLETICS</div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div>
            <p className="topbar-kicker">OCTOFIT / TRAINING DESK</p>
            <h1>Move well. Get stronger.</h1>
          </div>
          <div className="topbar-details">
            <span className="api-status"><span className="status-dot" />{codespaceName ? 'CODESPACES API' : 'LOCAL API'}</span>
            <span className="today-date">{dateLabel}</span>
            <div className="user-mark" aria-label="OctoFit member">OF</div>
          </div>
        </header>
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/activities" replace />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="*" element={<Navigate to="/activities" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
