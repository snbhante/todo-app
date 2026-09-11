import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import TodoList from "../components/TodoList";
import Link from "next/link";

export default function Home() {
  const [user] = useAuthState(auth);
  return (
    <div>
      <h1>My To‑Do App</h1>
      {user ? <TodoList /> : <Link href="/login">Login to continue</Link>}
    </div>
  );
}
