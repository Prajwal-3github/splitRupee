import { Link, useLocation } from 'react-router-dom';

export default function Shell({ children }){
  const { pathname } = useLocation();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>Split<span className="brand">Rupee</span></h2>
        <nav>
          <Link className={pathname==="/"?"active":""} to="/">Home</Link>
          <Link className={pathname.startsWith("/groups")?"active":""} to="/groups">Groups</Link>
        </nav>
        <div className="sidebar-foot">INR • 🇮🇳</div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
