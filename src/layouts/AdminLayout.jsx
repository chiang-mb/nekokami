import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-container">
      <header className="admin-header"></header>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
