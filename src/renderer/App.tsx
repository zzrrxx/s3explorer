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
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Login from './Login';

function Hello() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// function getBuckets(): Bucket[] {
//   return [
//     {
//       id: '1',
//       name: 'amzn-s3-demo-bucket',
//       creationDate: '2019-12-11T23:32:47+00:00',
//       region: 'Chengdu',
//     },
//     {
//       id: '2',
//       name: 'amzn-s3-demo-bucket-2',
//       creationDate: '2019-12-11T23:32:47+00:00',
//       region: 'Beijing',
//     },
//   ];
// }

// function Hello() {
//   const buckets = getBuckets();

//   return (
//     <div className="container mx-auto py-10">
//       <BucketTable columns={columns} data={buckets} />
//     </div>
//   );
// }

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
