
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { TimelineEntry } from '../../../types/job';

const getEntryColor = (type: TimelineEntry['type']): string => {
  switch (type) {
    case 'note':
      return 'border-blue-400';
    case 'status':
      return 'border-green-400';
    case 'assignment':
      return 'border-purple-400';
    case 'scheduling':
      return 'border-yellow-400';
    default:
      return 'border-gray-200';
  }
};

interface TimelineFeedProps {
  timeline: TimelineEntry[];
}

const TimelineFeed: React.FC<TimelineFeedProps> = ({ timeline }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const filters = ['all', 'status', 'note', 'assignment', 'scheduling'];
  
  const filteredTimeline = timeline.filter(entry => 
    activeFilter === 'all' || entry.type === activeFilter
  );

  // Add no entries fallback
  if (filteredTimeline.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Activity Timeline</h2>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1 mb-4">
          {filters.map((filter) => (
            <Button
              key={filter}
              size="sm"
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              className="text-xs capitalize h-7"
            >
              {filter === 'all' ? 'All' : filter}
            </Button>
          ))}
        </div>
        
        <div className="text-center text-gray-500 py-6">
          No timeline activity to display.
        </div>
      </div>
    );
  }

  // Fix sort logic to use proper date parsing
  const sortedEntries = [...filteredTimeline].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const displayedTimeline = showAll ? sortedEntries : sortedEntries.slice(0, 5);

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'status': return '📊';
      case 'note': return '📝';
      case 'assignment': return '👤';
      case 'scheduling': return '📅';
      default: return '📋';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Activity Timeline</h2>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 mb-4">
        {filters.map((filter) => (
          <Button
            key={filter}
            size="sm"
            variant={activeFilter === filter ? "default" : "outline"}
            onClick={() => setActiveFilter(filter)}
            className="text-xs capitalize h-7"
          >
            {filter === 'all' ? 'All' : filter}
          </Button>
        ))}
      </div>
      
      {/* Timeline Entries */}
      <div className="space-y-3">
        {displayedTimeline.map((entry) => (
          <div 
            key={`${entry.timestamp}-${entry.author_id}-${entry.type}`}
            className={`border-l-4 pl-4 pb-3 ${getEntryColor(entry.type)}`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">{getEntryIcon(entry.type)}</span>
                <span className="text-xs font-medium text-gray-600 capitalize">
                  {entry.type}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">
                  {formatTimestamp(entry.timestamp)}
                </div>
                <div className="text-xs text-gray-600 font-medium">
                  {entry.author_id || 'System'}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">
              {entry.content}
            </p>
          </div>
        ))}
      </div>
      
      {/* Show More / Show Less */}
      {sortedEntries.length > 5 && (
        <div className="mt-4 pt-4 border-t text-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show ${sortedEntries.length - 5} More`}
          </Button>
        </div>
      )}
      
      {/* Summary */}
      {timeline.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-xs text-gray-500 text-center">
            {timeline.length} total activities • Last updated {formatTimestamp(timeline[0]?.timestamp)}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineFeed;
