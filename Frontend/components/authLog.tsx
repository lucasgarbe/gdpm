import { useEffect, useState } from "react";
import { useStore } from "../hooks/useStore";
import authStore from "../stores/auth";

export default function AuthLog() {
    const store = useStore(authStore, (state) => state);
    const expires = store?.expires;
    const expiresDate = new Date(expires).toLocaleString();
    const [now, setNow] = useState<Number | null>(null);
    const [nowDate, setNowDate] = useState<String | null>(null);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = new Date()
            setNow(currentTime.valueOf());
            setNowDate(new Date(currentTime).toLocaleString());

            if (expires && now && now >= expires) {
                setFetching(true);
                const fetchRefreshInStore = async () => {
                    await store?.fetchRefresh();
                };
                fetchRefreshInStore();
                setFetching(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [])

    return (
        <div className="fixed right-0 bottom-0 z-50 grid grid-cols-2 font-mono p-1 text-white bg-black">
            <p>name:</p><p> {store?.user?.username}</p>
            <p>expires:</p><p> {expiresDate}</p>
            <p>expires:</p><p> {expires}</p>
            {now &&
                <>
                    <p>now:</p><p> {now}</p>
                    <p>now:</p><p> {nowDate}</p>
                </>
            }
            <p>{now < expires ? 'valid' : 'expired'}</p>
            <p>{fetching ? 'fetching' : 'not fetching'}</p>
        </div>
    );
}
