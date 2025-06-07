
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Filter, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { useJobs, useOrganizations } from '../hooks/useData';
import { Input } from '../components/ui/input';

interface MapFilters {
  showJobs: boolean;
  showAssociates: boolean;
  jobStatus: string[];
  searchTerm: string;
}

const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<MapFilters>({
    showJobs: true,
    showAssociates: true,
    jobStatus: ['New', 'Scheduled', 'In Progress'],
    searchTerm: ''
  });

  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const { data: organizations = [], isLoading: orgsLoading } = useOrganizations();

  const jobStatusOptions = ['New', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-74.006, 40.7128], // Default to NYC
      zoom: 10
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current || jobsLoading || orgsLoading) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add job markers
    if (filters.showJobs) {
      const filteredJobs = jobs.filter(job => {
        const matchesStatus = filters.jobStatus.includes(job.status);
        const matchesSearch = job.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                            job.customerName?.toLowerCase().includes(filters.searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
      });

      filteredJobs.forEach((job, index) => {
        // Generate random coordinates around NYC for demo
        const lat = 40.7128 + (Math.random() - 0.5) * 0.2;
        const lng = -74.006 + (Math.random() - 0.5) * 0.2;

        const marker = document.createElement('div');
        marker.className = 'w-8 h-8 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center cursor-pointer shadow-lg';
        marker.innerHTML = '<div class="w-3 h-3 bg-white rounded-full"></div>';

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-3">
            <h3 class="font-semibold text-gray-900">${job.name}</h3>
            <p class="text-sm text-gray-600">${job.customerName || 'No customer'}</p>
            <p class="text-xs text-gray-500 mt-1">Status: ${job.status}</p>
            <p class="text-xs text-gray-500">Phase: ${job.phase}</p>
          </div>
        `);

        new mapboxgl.Marker(marker)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
    }

    // Add associate company markers
    if (filters.showAssociates) {
      const associateOrgs = organizations.filter(org => 
        org.classification === 'associate' &&
        org.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );

      associateOrgs.forEach((org, index) => {
        // Generate random coordinates around NYC for demo
        const lat = 40.7128 + (Math.random() - 0.5) * 0.2;
        const lng = -74.006 + (Math.random() - 0.5) * 0.2;

        const marker = document.createElement('div');
        marker.className = 'w-8 h-8 bg-green-500 border-2 border-white rounded-full flex items-center justify-center cursor-pointer shadow-lg';
        marker.innerHTML = '<div class="w-3 h-3 bg-white rounded-full"></div>';

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-3">
            <h3 class="font-semibold text-gray-900">${org.name}</h3>
            <p class="text-sm text-gray-600">Associate Company</p>
            <p class="text-xs text-gray-500 mt-1">${org.email || 'No email'}</p>
            <p class="text-xs text-gray-500">${org.phone || 'No phone'}</p>
          </div>
        `);

        new mapboxgl.Marker(marker)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
    }
  }, [jobs, organizations, filters, jobsLoading, orgsLoading]);

  const handleStatusToggle = (status: string) => {
    setFilters(prev => ({
      ...prev,
      jobStatus: prev.jobStatus.includes(status)
        ? prev.jobStatus.filter(s => s !== status)
        : [...prev.jobStatus, status]
    }));
  };

  if (!mapboxToken) {
    return (
      <div className="p-6">
        <div className="max-w-md mx-auto mt-20">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Mapbox Configuration Required</h2>
            <p className="text-muted-foreground mb-4">
              To use the map feature, please enter your Mapbox public token. You can get one from{' '}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
            <div className="space-y-3">
              <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
              <Input
                id="mapbox-token"
                type="text"
                placeholder="pk.eyJ1..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
              <Button 
                onClick={() => setMapboxToken(mapboxToken)}
                disabled={!mapboxToken.trim()}
                className="w-full"
              >
                Initialize Map
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Filters Sidebar */}
      <div className={`${showFilters ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-card border-r`}>
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Map Filters</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(false)}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <Label>Search</Label>
            <Input
              placeholder="Search jobs or companies..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            />
          </div>

          {/* Display Options */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Display Options</Label>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="show-jobs"
                checked={filters.showJobs}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showJobs: checked }))}
              />
              <Label htmlFor="show-jobs" className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Active Jobs</span>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-associates"
                checked={filters.showAssociates}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showAssociates: checked }))}
              />
              <Label htmlFor="show-associates" className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Associate Companies</span>
              </Label>
            </div>
          </div>

          {/* Job Status Filters */}
          {filters.showJobs && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Job Status</Label>
              {jobStatusOptions.map(status => (
                <div key={status} className="flex items-center space-x-2">
                  <Switch
                    id={`status-${status}`}
                    checked={filters.jobStatus.includes(status)}
                    onCheckedChange={() => handleStatusToggle(status)}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="pt-4 border-t">
            <Label className="text-sm font-medium mb-3 block">Legend</Label>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 border border-white rounded-full shadow"></div>
                <span className="text-muted-foreground">Active Jobs</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 border border-white rounded-full shadow"></div>
                <span className="text-muted-foreground">Associate Companies</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {!showFilters && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 left-4 z-10 bg-background shadow-md"
            onClick={() => setShowFilters(true)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        )}
        
        <div ref={mapContainer} className="w-full h-full" />
        
        {/* Loading Overlay */}
        {(jobsLoading || orgsLoading) && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading map data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
