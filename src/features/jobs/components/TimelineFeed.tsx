
import React, { useState } from 'react';
import { Clock, Filter } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { TimelineEntry } from '../../../types/job';

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

  const displayedTimeline = showAll ? filteredTimeline : filteredTimeline.slice(0, 5);

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'status': return '📊';
      case 'note': return '📝';
      case 'assignment': return '👤';
      case 'scheduling': return '📅';
      default: return '📋';
    }
  };

  const getEntryColor = (type: string) => {
    switch (type) {
      case 'status': return 'border-l-blue-500 bg-blue-50';
      case 'note': return 'border-l-green-500 bg-green-50';
      case 'assignment': return 'border-l-purple-500 bg-purple-50';
      case 'scheduling': return 'border-l-orange-500 bg-orange-50';
      default: return 'border-l-gray-500 bg-gray-50';
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
        {displayedTimeline.length === 0 ? (
          <p className="text-sm text-gray-500 italic text-center py-4">
            No activity found for the selected filter.
          </p>
        ) : (
          displayedTimeline.map((entry, index) => (
            <div 
              key={`${entry.timestamp}-${index}`}
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
                    {entry.author}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">
                {entry.content}
              </p>
            </div>
          ))
        )}
      </div>
      
      {/* Load More / Show Less */}
      {filteredTimeline.length > 5 && (
        <div className="mt-4 pt-4 border-t text-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show ${filteredTimeline.length - 5} More`}
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
