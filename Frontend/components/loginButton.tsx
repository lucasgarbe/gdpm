import Link from "next/link";
import useAuth from "../hooks/useAuth";

export default function LoginButton() {
    const { user, logout } = useAuth();
    const className = `flex gap-1 items-center bg-stone-100 border-2 border-black hover:shadow-hard transition-all ease-in-out duration-75 p-1`

    if (user) {
        return (
            <button onClick={() => logout()} className={className}>Log out {user?.username}</button>
        )
    }
    return (
        <Link href="/login/" className={className}>Login</Link>
    )
}
