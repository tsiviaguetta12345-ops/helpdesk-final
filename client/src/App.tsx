import { BrowserRouter, Route, Routes } from "react-router";
import AuthProvider from "./context/AuthProvider";
import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";
import RequireAdmin from "./components/RequireAdmin";
import NewTicketPage from "./pages/NewTicketPage";
import TicketCreatedPage from "./pages/TicketCreatedPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TicketsPage from "./pages/TicketsPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<NewTicketPage />} />
                        <Route path="/ticket-created" element={<TicketCreatedPage />} />
                    </Route>

                    <Route path="/admin/login" element={<LoginPage />} />

                    <Route element={<RequireAdmin />}>
                        <Route element={<AdminLayout />}>
                            <Route path="/admin" element={<DashboardPage />} />
                            <Route path="/admin/tickets" element={<TicketsPage />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
