
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card, CardContent } from '../../../components/ui/card';
import { Job } from '../../../types';

interface DetailTabsProps {
  job: Job;
}

const DetailTabs: React.FC<DetailTabsProps> = ({ job }) => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <Card>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1">
            <TabsTrigger value="description" className="text-xs sm:text-sm">Description</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs sm:text-sm">Notes</TabsTrigger>
            <TabsTrigger value="tasks" className="text-xs sm:text-sm">Tasks</TabsTrigger>
            <TabsTrigger value="emails" className="text-xs sm:text-sm">Emails</TabsTrigger>
            <TabsTrigger value="links" className="text-xs sm:text-sm hidden lg:block">Links</TabsTrigger>
            <TabsTrigger value="files" className="text-xs sm:text-sm hidden lg:block">Files</TabsTrigger>
            <TabsTrigger value="workorders" className="text-xs sm:text-sm hidden lg:block">Work Orders</TabsTrigger>
            <TabsTrigger value="directional" className="text-xs sm:text-sm hidden lg:block">Directional</TabsTrigger>
          </TabsList>
          
          <div className="p-4 sm:p-6">
            <TabsContent value="description" className="mt-0">
              <div>
                <h3 className="font-medium mb-3">Project Description</h3>
                <textarea 
                  className="w-full min-h-32 p-3 border border-gray-300 rounded-md text-sm"
                  defaultValue={job.description}
                  placeholder="Enter project description..."
                />
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="mt-0">
              <div>
                <h3 className="font-medium mb-3">Notes</h3>
                <textarea 
                  className="w-full min-h-32 p-3 border border-gray-300 rounded-md text-sm"
                  placeholder="Add your notes here..."
                />
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-0">
              <div>
                <h3 className="font-medium mb-3">Tasks (Beta)</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Initial site survey</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Equipment installation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">System testing</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="emails" className="mt-0">
              <div>
                <h3 className="font-medium mb-3">Email Communications</h3>
                <p className="text-sm text-gray-500">No emails found for this job.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="links" className="mt-0">
              <div>
                <h3 className="font-medium mb-3">Related Links</h3>
                <p className="text-sm text-gray-500">No links added yet.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="files" className="mt-0">
              <div>
                <h3 className="font-medium mb-3">Files & Documents</h3>
                <p className="text-sm text-gray-500">No files uploaded yet.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="workorders" className="mt-0">
              <div>
                <h3 className="font-medium mb-3">Work Orders</h3>
                <p className="text-sm text-gray-500">No work orders created yet.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="directional" className="mt-0">
              <div>
                <h3 className="font-medium mb-3">Directional Information</h3>
                <p className="text-sm text-gray-500">No directional data available.</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DetailTabs;
