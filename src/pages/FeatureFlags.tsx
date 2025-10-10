import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Search, Flag } from "lucide-react";
import { Environment, FeatureFlag, Country, ValueType } from "@/types";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "sonner";
import axios from "axios";
import { getFeatureFlagUrl } from "@/config/api";
import { TokenManager } from "@/utils/auth";

const countryNames: Record<Country, string> = {
  AE: "United Arab Emirates",
  QA: "Qatar",
  SA: "Saudi Arabia",
  PK: "Pakistan",
  KW: "Kuwait",
  EG: "Egypt",
  JO: "Jordan",
  OM: "Oman",
  BH: "Bahrain",
  LB: "Lebanon",
  KE: "Kenya",
  GE: "Georgia",
  UZ: "Uzbekistan"
};

const typeColors: Record<string, string> = {
  ROUTE: "bg-blue-100 text-blue-800 border-blue-200",
  KAFKA_MESSAGING: "bg-purple-100 text-purple-800 border-purple-200",
  DRIVER_ROUTE: "bg-green-100 text-green-800 border-green-200",
  ASSIGNEE: "bg-amber-100 text-amber-800 border-amber-200",
  DRIVER_TRIP: "bg-indigo-100 text-indigo-800 border-indigo-200",
  COMMS_NOTIFY: "bg-pink-100 text-pink-800 border-pink-200",
  ASSIGNEE_TIP: "bg-teal-100 text-teal-800 border-teal-200",
  OTP: "bg-cyan-100 text-cyan-800 border-cyan-200",
  OMS_COD: "bg-orange-100 text-orange-800 border-orange-200",
  OLD_REPORTING: "bg-gray-100 text-gray-800 border-gray-200",
  ANALYTICS: "bg-red-100 text-red-800 border-red-200",
  GEOFENCE: "bg-lime-100 text-lime-800 border-lime-200",
  ALERTS: "bg-yellow-100 text-yellow-800 border-yellow-200",
  BUFFER_TIME: "bg-violet-100 text-violet-800 border-violet-200",
  THRESHOLD_TIME: "bg-rose-100 text-rose-800 border-rose-200",
  // Fallback for any new categories not explicitly defined
  DEFAULT: "bg-gray-100 text-gray-800 border-gray-200"
};

const FeatureFlagsPage = () => {
  const navigate = useNavigate();
  const environment = (TokenManager.getEnvironment() as Environment) || "development";
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [countryFilter, setCountryFilter] = useState<Country | "all">("all");
  const [typeFilter, setTypeFilter] = useState<"string" | "all">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const availableCountries: Country[] = [
    "AE", "QA", "SA", "PK", "KW", "EG", "JO", "OM", "BH", "LB", "KE", "GE", "UZ"
  ];

  const transformConfigToFeatures = (config: Record<string, Record<string, Array<{
    key: string;
    value: any;
    valueType: ValueType;
    active: boolean;
  }>>>): FeatureFlag[] => {
    const features: FeatureFlag[] = [];

    for (const region in config) {
      const regionConfig = config[region];

      for (const featureSet in regionConfig) {
        const featureItems = regionConfig[featureSet];

        featureItems.forEach((item) => {
          features.push({
            id: `${region}-${featureSet}-${item.key}`,
            name: item.key,
            description: "", // Adding empty description since it's required but not in source data
            enabled: item.active,
            type: featureSet,
            value: item.value,
            valueType: item.valueType,
            countries: [region as Country]
          });
        });
      }
    }

    return features;
  };

  // Check if user is logged in
  useEffect(() => {
    if (!TokenManager.isAuthenticated()) {
      navigate("/login");
      return;
    } else {
      setToken(TokenManager.getToken());
    }
  }, [navigate]);

  // Fetch flags when token and environment change
  useEffect(() => {
    if (token) {
      fetchFeatureFlags();
    }
  }, [token, environment]);

  // Extract unique categories from featureFlags
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    featureFlags.forEach(flag => {
      if (flag.type) {
        categories.add(flag.type);
      }
    });
    return Array.from(categories).sort(); // Sort alphabetically for consistent display
  }, [featureFlags]);

  const fetchFeatureFlags = async () => {
    setIsLoading(true)
    try {
      const getFeaturesUrl = getFeatureFlagUrl('list', environment);
      
      const config = {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'System-id': 'CWINGS'
        },
      };
      
      const response = await axios.get(getFeaturesUrl, config);
      const transformedFeatures = transformConfigToFeatures(response.data)
      setFeatureFlags(transformedFeatures)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setToken(null);
          navigate('/login');
        } else {
          console.error('API Error:', error.response?.data);
          toast.error("Failed to fetch feature flags: " + (error.message || "Unknown error"));
        }
      } else {
        console.error('Unexpected Error:', error);
        toast.error("An unexpected error occurred while fetching feature flags");
      }
    } finally {
      setIsLoading(false)
    }
  }

  const filteredFlags = useMemo(() => {
    return featureFlags.filter(flag => {
      const matchesSearch = flag.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           flag.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCountry = countryFilter === "all" || 
                            (flag.countries && flag.countries.includes(countryFilter as Country));
      
      const matchesType = typeFilter === "all" || flag.type === typeFilter;
      
      return matchesSearch && matchesCountry && matchesType;
    });
  }, [featureFlags, searchQuery, countryFilter, typeFilter]);

  const handleAddOrUpdateFlag = () => {
    if (!editingFlag) return;
    
    if (!editingFlag.name) {
      toast.error("Flag name is required");
      return;
    }
    
    if (editingFlag.id) {
      const updatedFlags = featureFlags.map(flag => 
        flag.id === editingFlag.id ? editingFlag : flag
      );
      setFeatureFlags(updatedFlags);
      toast.success(`Feature flag "${editingFlag.name}" updated`);
    } else {
      const newFlag = {
        ...editingFlag,
        id: `flag-${Date.now()}`,
      };
      setFeatureFlags([...featureFlags, newFlag]);
      toast.success(`Feature flag "${editingFlag.name}" created`);
    }
    
    setIsAddDialogOpen(false);
    setEditingFlag(null);
  };

  const handleEdit = (flag: FeatureFlag) => {
    setEditingFlag({ ...flag });
    setIsAddDialogOpen(true);
  };

  const handleToggleFlag = (flagId: string, enabled: boolean) => {
    const updatedFlags = featureFlags.map(flag => {
      if (flag.id === flagId) {
        return {
          ...flag
        };
      }
      return flag;
    });
    
    setFeatureFlags(updatedFlags);
    const flag = featureFlags.find(f => f.id === flagId);
    toast.success(`${flag?.name} is now ${enabled ? 'enabled' : 'disabled'} in ${environment}`);
  };

  const openAddDialog = () => {
    setEditingFlag({
      id: "",
      name: "",
      description: "",
      enabled: false,
      type: "OTP",
      value: true,
      valueType: "BOOLEAN",
      countries: ["AE"]
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        environment={environment}
      />
      <main className="flex-1 container py-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Feature Flags</h1>
            <p className="text-muted-foreground">
              Manage feature flags and their settings across environments
            </p>
          </div>
          <Button onClick={openAddDialog} className="gap-1">
            <Plus className="h-4 w-4" />
            Add Flag
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Feature Flags</CardTitle>
            <div className="flex flex-col md:flex-row gap-3 mt-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search flags..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select 
                  value={countryFilter} 
                  onValueChange={(value) => setCountryFilter(value as Country | 'all')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {availableCountries.map((country) => (
                      <SelectItem key={country} value={country}>{countryNames[country]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select 
                  value={typeFilter} 
                  onValueChange={(value) => setTypeFilter(value as 'string' | 'all')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Feature Type</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFlags.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Flag className="h-10 w-10 text-muted-foreground/60 mb-3" />
                  <h3 className="text-lg font-medium">No feature flags found</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    {searchQuery || countryFilter !== "all" || typeFilter !== "all" 
                      ? "No flags match your current filters"
                      : "Create your first feature flag to get started"}
                  </p>
                  {!searchQuery && countryFilter === "all" && typeFilter === "all" && (
                    <Button onClick={openAddDialog} size="sm">
                      Create a Feature Flag
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-2 text-left font-medium text-sm">Name</th>
                        <th className="py-3 px-2 text-left font-medium text-sm">Type</th>
                        <th className="py-3 px-2 text-left font-medium text-sm">Countries</th>
                        <th className="py-3 px-2 text-left font-medium text-sm">Status</th>
                        <th className="py-3 px-2 text-right font-medium text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFlags.map((flag) => (
                        <tr key={flag.id} className="border-b">
                          <td className="py-3 px-2">
                            <div>
                              <div className="font-medium">{flag.name}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {flag.description}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            {flag.type && (
                              <Badge variant="outline" className={typeColors[flag.type]}>
                                {flag.type}
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex flex-wrap gap-1">
                              {flag.countries?.map(country => (
                                <Badge key={country} variant="outline">
                                  {country}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          {/* <td className="py-3 px-2">
                            <Switch
                              checked={flag.environments[environment]}
                              onCheckedChange={(checked) => handleToggleFlag(flag.id, checked)}
                            />
                          </td> */}
                          <td className="py-3 px-2 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  className="cursor-pointer" 
                                  onClick={() => handleEdit(flag)}
                                >
                                  Edit
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingFlag?.id ? "Edit Feature Flag" : "Create Feature Flag"}</DialogTitle>
            <DialogDescription>
              {editingFlag?.id 
                ? "Update the details for this feature flag" 
                : "Create a new feature flag to control feature visibility"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Flag Name</Label>
              <Input
                id="name"
                value={editingFlag?.name || ""}
                onChange={(e) => setEditingFlag(prev => prev ? {...prev, name: e.target.value} : null)}
                placeholder="e.g. new-checkout-flow"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editingFlag?.description || ""}
                onChange={(e) => setEditingFlag(prev => prev ? {...prev, description: e.target.value} : null)}
                placeholder="Describe what this feature flag controls"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={editingFlag?.type} 
                onValueChange={(value) => setEditingFlag(prev => prev ? {...prev, type: value as ValueType} : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="release">Release</SelectItem>
                  <SelectItem value="experiment">Experiment</SelectItem>
                  <SelectItem value="ops">Operations</SelectItem>
                  <SelectItem value="permission">Permission</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Countries</Label>
              <div className="flex flex-wrap gap-2">
                {availableCountries.map((country) => (
                  <Badge 
                    key={country}
                    variant={editingFlag?.countries?.includes(country) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setEditingFlag(prev => {
                        if (!prev) return null;
                        
                        let newCountries = [...(prev.countries || [])];
                        
                        if (newCountries.includes(country)) {
                          newCountries = newCountries.filter(c => c !== country);
                          if (newCountries.length === 0) {
                            newCountries = ["AE"];
                          }
                        } else {
                          newCountries.push(country);
                        }
                        
                        return {...prev, countries: newCountries};
                      });
                    }}
                  >
                    {country}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <Label>Default State</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label htmlFor="dev-env" className="flex items-center gap-2 cursor-pointer">
                    <Badge variant="outline" className="bg-info/10 text-info border-info/20">Dev</Badge>
                    Development
                  </Label>
                  {/* <Switch
                    id="dev-env"
                    checked={editingFlag?.environments?.development || false}
                    onCheckedChange={(checked) => setEditingFlag(prev => prev ? {
                      ...prev,
                      environments: { ...prev.environments, development: checked }
                    } : null)}
                  /> */}
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label htmlFor="staging-env" className="flex items-center gap-2 cursor-pointer">
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Stage</Badge>
                    Staging
                  </Label>
                  {/* <Switch
                    id="staging-env"
                    checked={editingFlag?.environments?.staging || false}
                    onCheckedChange={(checked) => setEditingFlag(prev => prev ? {
                      ...prev,
                      environments: { ...prev.environments, staging: checked }
                    } : null)}
                  /> */}
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label htmlFor="prod-env" className="flex items-center gap-2 cursor-pointer">
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Prod</Badge>
                    Production
                  </Label>
                  {/* <Switch
                    id="prod-env"
                    checked={editingFlag?.environments?.production || false}
                    onCheckedChange={(checked) => setEditingFlag(prev => prev ? {
                      ...prev,
                      environments: { ...prev.environments, production: checked }
                    } : null)}
                  /> */}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              setEditingFlag(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddOrUpdateFlag}>
              {editingFlag?.id ? "Save Changes" : "Create Flag"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeatureFlagsPage;
