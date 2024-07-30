import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect } from "react";

export default function LoginButton() {
    const { data: session } = useSession()
    useEffect(() => {
        console.log('session', session);
    }, [session]);

    const className = `flex gap-1 items-center bg-stone-100 border-2 border-black hover:shadow-hard hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all ease-in-out duration-75 p-1`

    if (session) {
        return (
            <button onClick={() => signOut()} className={className}>Log out {session.user?.username}</button>
        )
    }
    return (
        <button onClick={() => signIn()} className={className}>Sign in</button>
    )
}
