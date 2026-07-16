import { Outlet } from 'react-router';
import { createContext, useState, useContext } from 'react';
import Sidebar from './Sidebar';

export const SidebarContext = createContext();

export function useSidebar() {
  return useContext(SidebarContext);
}

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="app-layout flex min-h-screen">
        <Sidebar />
        <div className="app-main flex-1 w-full min-w-0 flex flex-col md:ml-[240px]">
          <Outlet />
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
