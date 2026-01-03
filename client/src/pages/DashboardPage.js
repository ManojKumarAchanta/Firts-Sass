import React from 'react';
import { UploadCloud, FileImage, Files, History, MoreHorizontal, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { MOCK_HISTORY } from '../utils/constants';

export const DashboardPage = () => {
  const { setView } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to ConvertHub</h2>
          <p className="text-gray-500">Start converting your files instantly.</p>
        </div>
        <Button onClick={() => setView('tool-image')} className="hidden md:flex">
           <UploadCloud className="w-4 h-4 mr-2" /> New Conversion
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FileImage size={20} /></div>
              <span className="text-xs text-gray-400 font-medium">This Month</span>
           </div>
           <p className="text-3xl font-bold text-gray-900">124</p>
           <p className="text-sm text-gray-500">Images Processed</p>
        </Card>
        <Card className="p-5">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Files size={20} /></div>
              <span className="text-xs text-gray-400 font-medium">This Month</span>
           </div>
           <p className="text-3xl font-bold text-gray-900">45</p>
           <p className="text-sm text-gray-500">PDFs Merged</p>
        </Card>
        <Card className="p-5">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-green-50 rounded-lg text-green-600"><History size={20} /></div>
              <span className="text-xs text-gray-400 font-medium">Saved</span>
           </div>
           <p className="text-3xl font-bold text-gray-900">1.2 GB</p>
           <p className="text-sm text-gray-500">Bandwidth Saved</p>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Jobs</h3>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 font-medium whitespace-nowrap">File Name</th>
                  <th className="px-6 py-3 font-medium hidden md:table-cell">Type</th>
                  <th className="px-6 py-3 font-medium hidden md:table-cell">Result</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_HISTORY.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                       {job.name.endsWith('.pdf') ? <FileImage size={16} className="text-red-500 flex-shrink-0" /> : <ImageIcon size={16} className="text-blue-500 flex-shrink-0" />}
                       <span className="truncate max-w-[150px] md:max-w-none">{job.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{job.type}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs hidden md:table-cell">{job.size}</td>
                    <td className="px-6 py-4"><Badge status={job.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal size={16} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

