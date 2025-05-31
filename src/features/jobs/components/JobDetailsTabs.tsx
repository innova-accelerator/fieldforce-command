import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { MapPin, Phone, Mail, Globe, FileText, Link as LinkIcon, Upload } from 'lucide-react';
import { Job } from '../../../types/job';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';

interface JobDetailsTabsProps {
  job: Job;
  onUpdate: (updates: Partial<Job>) => void;
}

const JobDetailsTabs: React.FC<JobDetailsTabsProps> = ({ job, onUpdate }) => {
  const updateDescription = (description: string) => {
    onUpdate({ description });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-4 lg:grid-cols-8 rounded-none border-b bg-transparent h-auto p-0">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 py-3">
            Overview
          </TabsTrigger>
          <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 py-3">
            Description
          </TabsTrigger>
          <TabsTrigger value="contact" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 py-3">
            Contact
          </TabsTrigger>
          <TabsTrigger value="location" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 py-3">
            Location
          </TabsTrigger>
          <TabsTrigger value="files" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 py-3">
            Files
          </TabsTrigger>
          <TabsTrigger value="links" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 py-3">
            Links
          </TabsTrigger>
          <TabsTrigger value="emails" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 py-3">
            Emails
          </TabsTrigger>
          <TabsTrigger value="workorder" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 py-3">
            Work Order
          </TabsTrigger>
        </TabsList>
        
        <div className="p-4 sm:p-6">
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Job Summary</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Client:</span>
                    <div>
                      <Label htmlFor="customer">Customer</Label>
                      <div className="text-sm text-gray-700">{job.customerName}</div>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Phase:</span>
                    <p className="text-sm text-gray-900">{job.phase}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Duration:</span>
                    <p className="text-sm text-gray-900">
                      {new Date(job.startDate).toLocaleDateString()} - {new Date(job.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Team</h3>
                <div className="space-y-3">
                  <Label>Assigned Team</Label>
                  <div className="space-y-2">
                    {job.assignedTechs.map((techId) => (
                      <div key={techId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {`T${techId.slice(-1)}`}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">Tech {techId}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const updatedTechs = job.assignedTechs.filter(id => id !== techId);
                            onUpdate({ assignedTechs: updatedTechs });
                          }}
                          className="h-6 w-6 p-0 text-red-500"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Add Team Member
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="description" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
              <Textarea
                value={job.description}
                onChange={(e) => updateDescription(e.target.value)}
                placeholder="Enter detailed job description..."
                className="min-h-[200px] resize-vertical"
              />
              <Button size="sm">Save Changes</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="contact" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    value={job.contactInfo.name}
                    onChange={(e) => onUpdate({ 
                      contactInfo: { ...job.contactInfo, name: e.target.value }
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    value={job.contactInfo.phone}
                    onChange={(e) => onUpdate({ 
                      contactInfo: { ...job.contactInfo, phone: e.target.value }
                    })}
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={job.contactInfo.email}
                    onChange={(e) => onUpdate({ 
                      contactInfo: { ...job.contactInfo, email: e.target.value }
                    })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm">
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="location" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Job Location</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">{job.location}</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm">
                  <MapPin className="h-3 w-3 mr-1" />
                  View on Map
                </Button>
                <Button size="sm" variant="outline">
                  Get Directions
                </Button>
                <Button size="sm" variant="outline">
                  Edit Address
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="files" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Files & Documents</h3>
                <Button size="sm">
                  <Upload className="h-3 w-3 mr-1" />
                  Upload
                </Button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No files uploaded yet</p>
                <p className="text-xs text-gray-400 mt-1">Drag and drop files here or click upload</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="links" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Related Links</h3>
                <Button size="sm">
                  <LinkIcon className="h-3 w-3 mr-1" />
                  Add Link
                </Button>
              </div>
              <div className="text-center py-8">
                <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No links added yet</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="emails" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Email History</h3>
                <Button size="sm">
                  <Mail className="h-3 w-3 mr-1" />
                  Send Email
                </Button>
              </div>
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No emails sent yet</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="workorder" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Work Order</h3>
                <Button size="sm">Generate Work Order</Button>
              </div>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No work order generated yet</p>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default JobDetailsTabs;
