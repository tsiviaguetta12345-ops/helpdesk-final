import type { PublicUser } from "../types/user";
import UserCard from "./UserCard";

interface UserListProps {
    users: PublicUser[];
    onUserDeleted: (id: string) => void;
}

export default function UserList({ users, onUserDeleted }: UserListProps) {
    if (users.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                No users found
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
                <UserCard key={user.id} user={user} onUserDeleted={onUserDeleted} />
            ))}
        </div>
    );
}
