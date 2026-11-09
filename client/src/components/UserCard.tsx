import type { PublicUser } from "../types/user";
import UserDetailsDialog from "./UserDetailsDialog";
import DeleteUserDialog from "./DeleteUserDialog";

interface UserCardProps {
    user: PublicUser;
    onUserDeleted: (id: string) => void;
}

export default function UserCard({ user, onUserDeleted }: UserCardProps) {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
                <h3 className="text-lg font-semibold text-slate-900">{user.name} {user.lastName}</h3>
                <p className="text-sm text-violet-600">@{user.userName}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
            </div>

            <div className="mt-auto flex gap-2">
                <UserDetailsDialog userId={user.id} />
                <DeleteUserDialog user={user} onUserDeleted={onUserDeleted} />
            </div>
        </div>
    );
}
