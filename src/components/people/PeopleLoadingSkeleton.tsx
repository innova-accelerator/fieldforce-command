
import React from 'react';

const PeopleLoadingSkeleton: React.FC = () => {
  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-32 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-lg shadow-sm border p-6">
              <div className="h-6 bg-muted rounded mb-2"></div>
              <div className="h-4 bg-muted rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeopleLoadingSkeleton;
