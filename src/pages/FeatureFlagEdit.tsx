import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeatureFlagForm, type FeatureFlagData } from '@/components/features/FeatureFlagForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// This would typically come from your API
const mockFeatureFlagData: FeatureFlagData = {
  _id: {
    $oid: "6853cde216fa93741a70205e"
  },
  countryCode: "AE",
  countryEnabled: true,
  storeEnabled: false,
  stores: [],
  users: [],
  createdAt: {
    $date: "2025-06-17T08:25:05.089Z"
  },
  updatedAt: {
    $date: "2025-06-17T08:25:05.089Z"
  },
  app: "express",
  countryRolloutPercentage: -1,
  storeRollouts: [],
  softUpdateEnabled: false
};

export default function FeatureFlagEdit() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<FeatureFlagData, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      
      // Here you would typically make an API call to save the data
      console.log('Submitting feature flag data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After successful save, you might want to navigate away or show a success message
      // navigate('/feature-flags');
    } catch (error) {
      console.error('Error saving feature flag:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Feature Flag</h1>
      </div>
      
      <Card>
        <FeatureFlagForm 
          initialData={mockFeatureFlagData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
}
