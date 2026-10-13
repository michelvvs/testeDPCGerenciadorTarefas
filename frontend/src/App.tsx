import { AuthPage } from './components/AuthPage';
import { useAuth } from './auth/useAuth';
import { TaskBoard } from './TaskBoard';

export default function App() {
  const { user } = useAuth();
  return user ? <TaskBoard /> : <AuthPage />;
}