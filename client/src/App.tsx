import { useEffect, useState } from "react";
import type { PublicUser } from "./types/user";
import { getUsers } from "./services/usersApi";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import Loading from "./components/Loading";
import ErrorMessage from "./components/ErrorMessage";

export default function App() {
    const [users, setUsers] = useState<PublicUser[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getUsers()
            .then((data) => setUsers(data))
            .catch(() => setError("Failed to load users"))
            .finally(() => setIsLoading(false));
    }, []);

    const handleUserCreated = (user: PublicUser) => {
        setUsers((previous) => [...previous, user]);
    };

    const handleUserDeleted = (id: string) => {
        setUsers((previous) => previous.filter((user) => user.id !== id));
    };

    return (
        <div className="min-h-screen bg-slate-100 py-10">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4">
                <header>
                    <h1 className="text-3xl font-bold text-slate-900">Users Management</h1>
                    <p className="text-slate-500">React + TypeScript + Express + MongoDB</p>
                </header>

                <UserForm onUserCreated={handleUserCreated} />

                {isLoading && <Loading text="Loading users..." />}
                {error !== null && <ErrorMessage message={error} />}
                {!isLoading && error === null && <UserList users={users} onUserDeleted={handleUserDeleted} />}
            </div>
        </div>
    );
}
