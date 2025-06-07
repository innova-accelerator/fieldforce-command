
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

interface HistoryFeedProps {
  jobId: string;
}

const HistoryFeed: React.FC<HistoryFeedProps> = ({ jobId }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = ['All', 'Status', 'Email', 'Call', 'Note', 'Process'];
  
  const mockHistory = [
    {
      id: '1',
      type: 'status',
      message: 'Job status changed to In Progress',
      author: 'John Smith',
      timestamp: new Date('2024-01-15T10:30:00'),
    },
    {
      id: '2',
      type: 'note',
      message: 'Initial site assessment completed. HVAC requirements confirmed.',
      author: 'Sarah Johnson',
      timestamp: new Date('2024-01-14T15:45:00'),
    },
    {
      id: '3',
      type: 'email',
      message: 'Sent project timeline to client',
      author: 'Mike Wilson',
      timestamp: new Date('2024-01-14T09:20:00'),
    },
  ];

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-base">History</CardTitle>
      </CardHeader>
      <CardContent>
        
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1 mb-4">
          {filters.map((filter) => (
            <Button
              key={filter}
              size="sm"
              variant={activeFilter === filter.toLowerCase() ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.toLowerCase())}
              className="text-xs"
            >
              {filter}
            </Button>
          ))}
        </div>
        
        {/* History entries */}
        <div className="space-y-3">
          {mockHistory.map((entry) => (
            <div key={entry.id} className="border-l-2 border-border pl-3 pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className="text-xs text-muted-foreground">
                  {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                </span>
                <span className="text-xs font-medium text-foreground">
                  {entry.author}
                </span>
              </div>
              <p className="text-sm text-foreground mt-1">{entry.message}</p>
              <span className={`inline-block text-xs px-2 py-1 rounded mt-1 ${
                entry.type === 'status' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                entry.type === 'note' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                entry.type === 'email' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                'bg-muted text-muted-foreground'
              }`}>
                {entry.type}
              </span>
            </div>
          ))}
        </div>
        
        {/* Load more */}
        <Button variant="outline" size="sm" className="w-full mt-4">
          Load More
        </Button>
        
      </CardContent>
    </Card>
  );
};

export default HistoryFeed;
