
import { useState } from "react";
import { Flag, PlusCircle, Info, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Environment, FeatureFlag, ValueType } from "@/types";

interface FeatureFlagsProps {
  flags: FeatureFlag[];
  environment: Environment;
  onUpdateFlag: (flag: FeatureFlag) => void;
}

const FeatureFlags = ({ flags, environment, onUpdateFlag }: FeatureFlagsProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFlag, setNewFlag] = useState<Partial<FeatureFlag>>({
    name: "",
    description: "",
    enabled: false
  });

  const handleToggleFlag = (flagId: string, enabled: boolean) => {
    const flag = flags.find(f => f.id === flagId);
    if (flag) {
      const updatedFlag = {
        ...flag
      };
      onUpdateFlag(updatedFlag);
      toast.success(`${flag.name} is now ${enabled ? 'enabled' : 'disabled'} in ${environment}`);
    }
  };

  const handleAddFlag = () => {
    if (!newFlag.name) {
      toast.error("Flag name is required");
      return;
    }
    
    // In a real app, you would make an API call here
    const id = `flag-${Date.now()}`;
    const flag: FeatureFlag = {
      id,
      name: newFlag.name || "",
      description: newFlag.description || "",
      enabled: newFlag.enabled || false,
      type: newFlag.type || "",
      value: newFlag.value || "",
      valueType: newFlag.valueType || "STRING",
    };
    
    onUpdateFlag(flag);
    setIsAddDialogOpen(false);
    setNewFlag({
      name: "",
      description: "",
      enabled: false,
    });
    
    toast.success("Feature flag created successfully");
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Feature Flags</CardTitle>
            <CardDescription>
              Toggle features across different environments
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            New Flag
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {flags.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Flag className="h-10 w-10 text-muted-foreground/60 mb-3" />
                <h3 className="text-lg font-medium">No feature flags yet</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Create your first feature flag to get started
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
                  Create a Feature Flag
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {flags.map((flag) => (
                  <div
                    key={flag.id}
                    className="flex items-center justify-between rounded-md border p-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* <Switch
                        checked={flag.environments[environment]}
                        onCheckedChange={(checked) => handleToggleFlag(flag.id, checked)}
                      /> */}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{flag.name}</p>
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                              <div className="space-y-2">
                                <h4 className="font-medium">{flag.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {flag.description || "No description provided"}
                                </p>
                                {/* <div className="flex flex-wrap gap-2 pt-2">
                                  <Badge variant={flag.environments.development ? "default" : "outline"}>
                                    Development
                                  </Badge>
                                  <Badge variant={flag.environments.staging ? "default" : "outline"}>
                                    Staging
                                  </Badge>
                                  <Badge variant={flag.environments.production ? "default" : "outline"}>
                                    Production
                                  </Badge>
                                </div> */}
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {flag.description || "No description provided"}
                        </p>
                      </div>
                    </div>
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
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <Edit className="h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                          <Trash className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Feature Flag</DialogTitle>
            <DialogDescription>
              Create a new feature flag to control feature visibility
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Flag Name</Label>
              <Input
                id="name"
                value={newFlag.name || ""}
                onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })}
                placeholder="e.g. new-checkout-flow"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newFlag.description || ""}
                onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                placeholder="Describe what this feature flag controls"
                rows={3}
              />
            </div>
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
                    checked={newFlag.environments?.development || false}
                    onCheckedChange={(checked) => setNewFlag({
                      ...newFlag,
                      environments: { ...newFlag.environments, development: checked }
                    })}
                  /> */}
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label htmlFor="staging-env" className="flex items-center gap-2 cursor-pointer">
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Stage</Badge>
                    Staging
                  </Label>
                  {/* <Switch
                    id="staging-env"
                    checked={newFlag.environments?.staging || false}
                    onCheckedChange={(checked) => setNewFlag({
                      ...newFlag,
                      environments: { ...newFlag.environments, staging: checked }
                    })}
                  /> */}
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <Label htmlFor="prod-env" className="flex items-center gap-2 cursor-pointer">
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Prod</Badge>
                    Production
                  </Label>
                  {/* <Switch
                    id="prod-env"
                    checked={newFlag.environments?.production || false}
                    onCheckedChange={(checked) => setNewFlag({
                      ...newFlag,
                      environments: { ...newFlag.environments, production: checked }
                    })}
                  /> */}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFlag}>
              Create Flag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeatureFlags;
