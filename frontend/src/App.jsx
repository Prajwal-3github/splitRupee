import { Routes, Route, Navigate } from 'react-router-dom';
import Shell from './layout/Shell';
import Home from './pages/Home';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import InviteAccept from './pages/InviteAccept';

export default function App(){
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:groupId/*" element={<GroupDetail />} />
        <Route path="/invite/:token" element={<InviteAccept />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Shell>
  );
}
