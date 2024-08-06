import Link from "next/link";
import { useStore } from "../hooks/useStore";
import authStore from "../stores/auth";

export default function LoginButton() {
    const store = useStore(authStore, (state) => state);
    const className = `flex gap-1 items-center bg-stone-100 border-2 border-black hover:shadow-hard transition-all ease-in-out duration-75 p-1`

    if (store?.user) {
        return (
            <>
                <button onClick={store?.logout} className={className}>Log out {store?.user?.username}</button>
            </>
        )
    }
    return (
        <>
            <Link href="/login/" className={className}>Login</Link>
        </>
    )
}
