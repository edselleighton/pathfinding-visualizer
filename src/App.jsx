import Header from './components/Header'
import Toolbar from './components/Toolbar'
import Workspace from './components/Workspace'
import Legend from './components/Legend'

export default function App() {
  return (
    <main className="app-shell">
      <Header />
      <Toolbar />
      <Workspace />
      <Legend />
    </main>
  )
}
