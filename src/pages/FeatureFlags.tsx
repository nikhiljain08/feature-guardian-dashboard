
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Flag, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Environment, FeatureFlag, FlagType, Country } from "@/types";

// Mock data for feature flags
const mockFlags: FeatureFlag[] = [
  {
    id: "flag-1",
    name: "new-checkout-flow",
    description: "Enable the new streamlined checkout experience",
    enabled: true,
    environments: {
      development: true,
      staging: true,
      production: false,
    },
    type: "release",
    countries: ["global"]
  },
  {
    id: "flag-2",
    name: "dark-mode",
    description: "Enable dark mode theme across the application",
    enabled: true,
    environments: {
      development: true,
      staging: true,
      production: true,
    },
    type: "experiment",
    countries: ["us", "eu"]
  },
  {
    id: "flag-3",
    name: "analytics-v2",
    description: "Use the new analytics tracking system",
    enabled: false,
    environments: {
      development: true,
      staging: false,
      production: false,
    },
    type: "ops",
    countries: ["us"]
  },
  {
    id: "flag-4",
    name: "admin-dashboard",
    description: "Access to administrative controls",
    enabled: true,
    environments: {
      development: true,
      staging: true,
      production: true,
    },
    type: "permission",
    countries: ["global"]
  },
  {
    id: "flag-5",
    name: "new-pricing-model",
    description: "Enables the new subscription pricing model",
    enabled: false,
    environments: {
      development: true,
      staging: false,
      production: false,
    },
    type: "release",
    countries: ["us", "eu", "asia"]
  },
  {
    id: "flag-6",
    name: "beta-features",
    description: "Enables access to beta features for select users",
    enabled: true,
    environments: {
      development: true,
      staging: true,
      production: false,
    },
    type: "experiment",
    countries: ["us"]
  },
];

const typeColors: Record<FlagType, string> = {
  release: "bg-blue-100 text-blue-800 border-blue-200",
  experiment: "bg-purple-100 text-purple-800 border-purple-200",
  ops: "bg-amber-100 text-amber-800 border-amber-200",
  permission: "bg-green-100 text-green-800 border-green-200"
};

const FeatureFlagsPage = () => {
  const navigate = useNavigate();
  const [environment, setEnvironment] = useState<Environment>("development");
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(mockFlags);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [countryFilter, setCountryFilter] = useState<Country | "all">("all");
  const [typeFilter, setTypeFilter] = useState<FlagType | "all">("all");

  const handleEnvironmentChange = (env: Environment) => {
    setEnvironment(env);
  };

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
      // Update existing flag
      const updatedFlags = featureFlags.map(flag => 
        flag.id === editingFlag.id ? editingFlag : flag
      );
      setFeatureFlags(updatedFlags);
      toast.success(`Feature flag "${editingFlag.name}" updated`);
    } else {
      // Add new flag
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
          ...flag,
          environments: {
            ...flag.environments,
            [environment]: enabled
          }
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
      environments: {
        development: true,
        staging: false,
        production: false
      },
      type: "release",
      countries: ["global"]
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        environment={environment}
        onEnvironmentChange={handleEnvironmentChange}
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
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="eu">Europe</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
                    <SelectItem value="latam">Latin America</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={typeFilter} 
                  onValueChange={(value) => setTypeFilter(value as FlagType | 'all')}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="release">Release</SelectItem>
                    <SelectItem value="experiment">Experiment</SelectItem>
                    <SelectItem value="ops">Operations</SelectItem>
                    <SelectItem value="permission">Permission</SelectItem>
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
                                  {country === "global" ? "Global" : 
                                   country === "us" ? "US" : 
                                   country === "eu" ? "EU" : 
                                   country === "asia" ? "Asia" : "LatAm"}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <Switch
                              checked={flag.environments[environment]}
                              onCheckedChange={(checked) => handleToggleFlag(flag.id, checked)}
                            />
                          </td>
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
                onValueChange={(value) => setEditingFlag(prev => prev ? {...prev, type: value as FlagType} : null)}
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
                {["global", "us", "eu", "asia", "latam"].map((country) => (
                  <Badge 
                    key={country}
                    variant={editingFlag?.countries?.includes(country as Country) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setEditingFlag(prev => {
                        if (!prev) return null;
                        
                        // If it's global, make it the only selection
                        if (country === "global") {
                          return {...prev, countries: ["global"]};
                        }
                        
                        // Create a new array to avoid mutation
                        let newCountries = [...(prev.countries || [])];
                        
                        // If it's already selected, remove it
                        if (newCountries.includes(country as Country)) {
                          newCountries = newCountries.filter(c => c !== country);
                          // If now empty, default to global
                          if (newCountries.length === 0) {
                            newCountries = ["global"];
                          }
                        } else {
                          // If global is selected, remove it
                          newCountries = newCountries.filter(c => c !== "global");
                          // Add the new country
                          newCountries.push(country as Country);
                        }
                        
                        return {...prev, countries: newCountries};
                      });
                    }}
                  >
                    {country === "global" ? "Global" : 
                     country === "us" ? "United States" : 
                     country === "eu" ? "Europe" : 
                     country === "asia" ? "Asia" : "Latin America"}
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
                  <Switch
                    id="dev-env"
                    checked={editingFlag?.environments?.development || false}
                    onCheckedChange={(checked) => setEditingFlag(prev => prev ? {
                      ...prev,
                      environments: { ...prev.environments, development: checked }
                    } : null)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label htmlFor="staging-env" className="flex items-center gap-2 cursor-pointer">
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Stage</Badge>
                    Staging
                  </Label>
                  <Switch
                    id="staging-env"
                    checked={editingFlag?.environments?.staging || false}
                    onCheckedChange={(checked) => setEditingFlag(prev => prev ? {
                      ...prev,
                      environments: { ...prev.environments, staging: checked }
                    } : null)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label htmlFor="prod-env" className="flex items-center gap-2 cursor-pointer">
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Prod</Badge>
                    Production
                  </Label>
                  <Switch
                    id="prod-env"
                    checked={editingFlag?.environments?.production || false}
                    onCheckedChange={(checked) => setEditingFlag(prev => prev ? {
                      ...prev,
                      environments: { ...prev.environments, production: checked }
                    } : null)}
                  />
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
