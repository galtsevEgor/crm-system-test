import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/header/Header'
import MainPage from './pages/MainPage/MainPage'
import './index.scss'

const DesignersPage = lazy(() => import('./pages/DesignersPage/DesignersPage'))
const TasksPage = lazy(() => import('./pages/TasksPage/TasksPage'))

const App = () => {
	return (
		<Router>
			<Header />
      <Suspense fallback={<div>Loading...</div>}>
			<Routes>
				<Route path='/' element={<MainPage />} />
				<Route path='/tasks' element={<TasksPage />} />
				<Route path='/designers' element={<DesignersPage />} />
				<Route path='*' element={<MainPage />} />
			</Routes>
      </Suspense>
		</Router>
	)
}

export default App
