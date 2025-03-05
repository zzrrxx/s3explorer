/* eslint-disable react/no-array-index-key */
/* eslint-disable no-undef */

import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import 'tailwindcss/tailwind.css';
import { toast, Toaster } from 'sonner';
import { useEffect, useState } from 'react';
import { isApiError } from 'src/shared/ApiError';
import AppConfig from 'src/shared/AppConfig';
// import BucketTable from './components/buckettable/bucket-table';
// import { Bucket, columns } from './components/buckettable/columns';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';

import Login from './Login';
import BucketsExplorer from './BucketExplorer';

function Hello() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <BucketsExplorer />
      </SidebarInset>
    </SidebarProvider>
  );
}



export default function App() {
  const [appConfig, setAppConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    const unsubGetAppConfig = window.electron.ipcRenderer.on(
      'getAppConfig',
      (data: any) => {
        if (isApiError(data)) {
          toast.error('Failed to load application configuration');
        } else {
          setAppConfig(data as AppConfig);
        }
      },
    );
    window.electron.ipcRenderer.sendMessage('getAppConfig');

    return () => {
      unsubGetAppConfig();
    };
  }, []);

  if (appConfig === null) {
    return <div> Loading </div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            appConfig.accounts.length > 0 ? (
              <Hello />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Toaster />
    </Router>
  );
}
