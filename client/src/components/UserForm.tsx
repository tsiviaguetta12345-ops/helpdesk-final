import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { CreateUserInput, PublicUser } from "../types/user";
import { createUser } from "../services/usersApi";
import ErrorMessage from "./ErrorMessage";

interface UserFormProps {
    onUserCreated: (user: PublicUser) => void;
}

const emptyForm: CreateUserInput = {
    name: "",
    lastName: "",
    email: "",
    userName: "",
    password: ""
};

export default function UserForm({ onUserCreated }: UserFormProps) {
    const [form, setForm] = useState<CreateUserInput>(emptyForm);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const field = event.target.name;
        const value = event.target.value;
        setForm((previous) => ({ ...previous, [field]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            const user = await createUser(form);
            onUserCreated(user);
            setForm(emptyForm);
        } catch {
            setError("Failed to create user");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-violet-500";
    const labelClass = "flex flex-col gap-1 text-sm font-medium text-slate-700";

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Add User</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                    Name
                    <input name="name" value={form.name} onChange={handleChange} className={inputClass} required />
                </label>

                <label className={labelClass}>
                    Last Name
                    <input name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} required />
                </label>

                <label className={labelClass}>
                    Email
                    <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} required />
                </label>

                <label className={labelClass}>
                    Username
                    <input name="userName" value={form.userName} onChange={handleChange} className={inputClass} required />
                </label>

                <label className={labelClass}>
                    Password
                    <input name="password" type="password" value={form.password} onChange={handleChange} className={inputClass} required />
                </label>
            </div>

            {error !== null && <ErrorMessage message={error} />}

            <button
                type="submit"
                disabled={isSaving}
                className="self-start rounded-lg bg-violet-600 px-5 py-2 font-medium text-white hover:bg-violet-700 disabled:bg-slate-300"
            >
                {isSaving ? "Saving..." : "Add User"}
            </button>
        </form>
    );
}
