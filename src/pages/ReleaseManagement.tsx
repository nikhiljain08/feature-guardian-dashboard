import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { z } from 'zod';
import { Info, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Environment } from '@/types';
import { TokenManager } from '@/utils/auth';
import { FeatureFlagForm } from '@/components/features/FeatureFlagForm';
import { Skeleton } from '@/components/ui/skeleton';

type Platform = 'ios' | 'android' | 'feature-flags';
type Country = { id: string; name: string; };
type AppVersion = { id: string; name: string; };

const countries: Country[] = [
  { id: 'us', name: 'United States' },
  { id: 'in', name: 'India' },
  { id: 'uk', name: 'United Kingdom' },
  { id: 'ca', name: 'Canada' },
  { id: 'au', name: 'Australia' },
];

const appVersions: AppVersion[] = [
  { id: '1.0.0', name: '1.0.0' },
  { id: '1.1.0', name: '1.1.0' },
  { id: '1.2.0', name: '1.2.0' },
  { id: '2.0.0', name: '2.0.0' },
];

// Enhanced form validation schema
const featureFlagSchema = z.object({
  countryCode: z.string()
    .min(2, 'Country code must be at least 2 characters')
    .max(5, 'Country code is too long')
    .regex(/^[A-Z]{2,5}$/i, 'Country code must be 2-5 uppercase letters'),
  
  countryEnabled: z.boolean(),
  storeEnabled: z.boolean(),
  
  stores: z.array(
    z.string().min(1, 'Store ID cannot be empty')
  ).max(50, 'Maximum 50 stores allowed'),
  
  users: z.array(
    z.string().email('Invalid email address')
  ).max(100, 'Maximum 100 users allowed'),
  
  app: z.string()
    .min(1, 'App name is required')
    .max(50, 'App name is too long'),
  
  countryRolloutPercentage: z.number()
    .min(-1, 'Rollout percentage must be between -1 and 100')
    .max(100, 'Rollout percentage must be between -1 and 100')
    .refine(
      val => val === -1 || (val >= 0 && val <= 100),
      'Use -1 for no rollout or 0-100 for percentage'
    ),
  
  storeRollouts: z.array(z.object({
    storeId: z.string().min(1, 'Store ID is required'),
    percentage: z.number()
      .min(0, 'Percentage must be between 0 and 100')
      .max(100, 'Percentage must be between 0 and 100')
  })).max(50, 'Maximum 50 store rollouts allowed'),
  
  softUpdateEnabled: z.boolean()
}).refine(
  data => !data.countryEnabled || data.countryCode,
  {
    message: 'Country code is required when country is enabled',
    path: ['countryCode']
  }
);

// Memoize the form component to prevent unnecessary re-renders
const MemoizedFeatureFlagForm = React.memo(FeatureFlagForm);

// Initial form data
const initialFormData = {
  countryCode: "AE",
  countryEnabled: true,
  storeEnabled: false,
  stores: [],
  users: [],
  app: "express",
  countryRolloutPercentage: -1,
  storeRollouts: [],
  softUpdateEnabled: false
};

export default function ReleaseManagement() {
  const environment = (TokenManager.getEnvironment() as Environment) || "development";
  const [selectedIosCountry, setSelectedIosCountry] = useState<string>('');
  const [selectedIosVersion, setSelectedIosVersion] = useState<string>('');
  const [selectedAndroidCountry, setSelectedAndroidCountry] = useState<string>('');
  const [selectedAndroidVersion, setSelectedAndroidVersion] = useState<string>('');

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Memoize handlers to prevent unnecessary re-renders
  const handleUpdateRelease = useCallback((platform: Platform) => {
    if (platform === 'feature-flags') return;
    
    const country = platform === 'ios' ? selectedIosCountry : selectedAndroidCountry;
    const version = platform === 'ios' ? selectedIosVersion : selectedAndroidVersion;
    
    toast.promise(
      new Promise((resolve) => {
        // Simulate API call
        setTimeout(() => {
          console.log(`Updating ${platform} release for ${country} to version ${version}`);
          resolve(true);
        }, 1000);
      }),
      {
        loading: `Updating ${platform} release...`,
        success: () => {
          return `${platform.charAt(0).toUpperCase() + platform.slice(1)} release updated successfully!`;
        },
        error: (error) => {
          console.error(`Error updating ${platform} release:`, error);
          return `Failed to update ${platform} release`;
        },
      }
    );
  }, [selectedIosCountry, selectedIosVersion, selectedAndroidCountry, selectedAndroidVersion]);

  // Memoized form validation
  const validateForm = useCallback((data: any) => {
    try {
      featureFlagSchema.parse(data);
      setFormErrors({});
      return { isValid: true, errors: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce((acc, curr) => {
          const path = curr.path.join('.');
          return { ...acc, [path]: curr.message };
        }, {} as Record<string, string>);
        
        setFormErrors(errors);
        return { isValid: false, errors };
      }
      return { isValid: false, errors: { general: 'Validation failed' } };
    }
  }, []);

  // Handle form submission
  const handleFeatureFlagSubmit = useCallback(async (data: any) => {
    const { isValid } = validateForm(data);
    
    if (!isValid) {
      toast.error('Please fix the validation errors before submitting.');
      return;
    }

    setFormData(data);
    setShowConfirmDialog(true);
  }, [validateForm]);

  // Confirm and submit the form
  const confirmFeatureFlagUpdate = useCallback(async () => {
    if (!formData) return;
    
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    
    try {
      // Simulate API call with loading state
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Feature flag updated successfully!', {
        description: 'Your changes have been saved.',
        duration: 5000,
      });
      
      // Reset form
      setFormData(initialFormData);
      setFormErrors({});
    } catch (error) {
      console.error('Error saving feature flag:', error);
      toast.error('Failed to update feature flag', {
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  // Reset form to initial state
  const handleResetForm = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all fields?')) {
      setFormData(initialFormData);
      setFormErrors({});
      toast.success('Form has been reset');
    }
  }, []);

  // Simulate loading data
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader environment={environment} />
      <main className="flex-1 container py-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Release Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage and control application releases across different platforms and countries
          </p>
        </div>
      
        <Tabs defaultValue="ios" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ios">
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                iOS
              </span>
            </TabsTrigger>
            <TabsTrigger value="android">
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a1.8 1.8 0 0 1-.61-.66 1.8 1.8 0 0 1 0-1.65L10.94 12 3 3.124a1.8 1.8 0 0 1 0-1.65 1.8 1.8 0 0 1 .61-.66zm16.782 0l-10.18 10.18L20.391 22.2a1.8 1.8 0 0 0 2.09.36 1.8 1.8 0 0 0 .7-2.08l-7.13-8.6 7.13-8.6a1.8 1.8 0 0 0-.7-2.08 1.8 1.8 0 0 0-2.09.36z"/>
                </svg>
                Android
              </span>
            </TabsTrigger>
            <TabsTrigger value="feature-flags">
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
                Feature Flags
              </span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>iOS Release Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ios-country">Country</Label>
                    <Select 
                      value={selectedIosCountry} 
                      onValueChange={setSelectedIosCountry}
                    >
                      <SelectTrigger id="ios-country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.id} value={country.id}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ios-version">Version</Label>
                    <Select
                      value={selectedIosVersion}
                      onValueChange={setSelectedIosVersion}
                    >
                      <SelectTrigger id="ios-version">
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        {appVersions.map(version => (
                          <SelectItem key={version.id} value={version.id}>
                            {version.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      className="w-full"
                      disabled={!selectedIosCountry || !selectedIosVersion}
                      onClick={() => handleUpdateRelease('ios')}
                    >
                      Update iOS Release
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="android" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Android Release Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="android-country">Country</Label>
                    <Select
                      value={selectedAndroidCountry}
                      onValueChange={setSelectedAndroidCountry}
                    >
                      <SelectTrigger id="android-country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.id} value={country.id}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="android-version">Version</Label>
                    <Select
                      value={selectedAndroidVersion}
                      onValueChange={setSelectedAndroidVersion}
                    >
                      <SelectTrigger id="android-version">
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        {appVersions.map(version => (
                          <SelectItem key={version.id} value={version.id}>
                            {version.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      className="w-full"
                      disabled={!selectedAndroidCountry || !selectedAndroidVersion}
                      onClick={() => handleUpdateRelease('android')}
                    >
                      Update Android Release
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feature-flags" className="space-y-6">
            <Card className="shadow-lg" role="region" aria-labelledby="feature-flag-heading">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle id="feature-flag-heading" className="text-2xl font-bold text-gray-900 dark:text-white">
                      Feature Flag Management
                    </CardTitle>
                    <CardDescription className="mt-1 text-sm text-muted-foreground">
                      Configure feature flags for different environments and user segments
                    </CardDescription>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleResetForm}
                          disabled={isSubmitting}
                          className="ml-auto"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reset Form
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reset all fields to their default values</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full rounded-md" />
                    ))}
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto space-y-6">
                    <MemoizedFeatureFlagForm 
                      initialData={formData || initialFormData}
                      onSubmit={handleFeatureFlagSubmit}
                      isSubmitting={isSubmitting}
                      errors={formErrors}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Confirmation Dialog */}
          <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <AlertDialogContent className="sm:max-w-[425px]">
              <AlertDialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                    <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <AlertDialogTitle className="text-lg">Confirm Changes</AlertDialogTitle>
                </div>
                <AlertDialogDescription className="pt-2 pl-2">
                  <div className="space-y-4">
                    <p>You're about to update the following feature flag settings:</p>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Country Code:</span>
                        <span className="font-mono text-sm">{formData?.countryCode || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">App:</span>
                        <span className="font-mono text-sm">{formData?.app || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Rollout:</span>
                        <span className="font-mono text-sm">
                          {formData?.countryRolloutPercentage === -1 
                            ? 'No rollout' 
                            : `${formData?.countryRolloutPercentage}%`}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      This change will affect all users in the selected country. Are you sure you want to continue?
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="sm:justify-between">
                <AlertDialogCancel 
                  disabled={isSubmitting}
                  className="mt-0"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={confirmFeatureFlagUpdate}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Confirm Changes</span>
                    </>
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Release History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col" className="p-4 text-left">Platform</TableHead>
                    <TableHead scope="col" className="p-4 text-left">Country</TableHead>
                    <TableHead scope="col" className="p-4 text-left">Version</TableHead>
                    <TableHead scope="col" className="p-4 text-left">Updated At</TableHead>
                    <TableHead scope="col" className="p-4 text-left">Updated By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="p-4">iOS</TableCell>
                    <TableCell className="p-4">United States</TableCell>
                    <TableCell className="p-4">2.0.0</TableCell>
                    <TableCell className="p-4">Oct 10, 2023</TableCell>
                    <TableCell className="p-4">admin@example.com</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="p-4">Android</TableCell>
                    <TableCell className="p-4">India</TableCell>
                    <TableCell className="p-4">1.2.0</TableCell>
                    <TableCell className="p-4">Oct 9, 2023</TableCell>
                    <TableCell className="p-4">admin@example.com</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}