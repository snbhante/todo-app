import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Profile() {
  const [user] = useAuthState(auth);
  if (!user) return <p>Please login first.</p>;

  return (
    <div>
      <h2>My Profile</h2>
      <p>Email: {user.email}</p>
      <button onClick={()=>auth.signOut()}>Logout</button>
    </div>
  );
}
