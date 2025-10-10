import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";

export interface StoreRollout {
  storeId: string;
  percentage: number;
}

export interface FeatureFlagData {
  _id: {
    $oid: string;
  };
  countryCode: string;
  countryEnabled: boolean;
  storeEnabled: boolean;
  stores: string[];
  users: string[];
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
  app: string;
  countryRolloutPercentage: number;
  storeRollouts: StoreRollout[];
  softUpdateEnabled: boolean;
}

interface FeatureFlagFormProps {
  initialData?: Partial<FeatureFlagData>;
  onSubmit: (data: Omit<FeatureFlagData, '_id' | 'createdAt' | 'updatedAt'>) => void;
  isSubmitting?: boolean;
  errors?: Record<string, string>;
}

export function FeatureFlagForm({ 
  initialData, 
  onSubmit, 
  isSubmitting = false, 
  errors = {} 
}: FeatureFlagFormProps) {
  const [formData, setFormData] = useState<Omit<FeatureFlagData, '_id' | 'createdAt' | 'updatedAt'>>({
    countryCode: '',
    countryEnabled: false,
    storeEnabled: false,
    stores: [],
    users: [],
    app: '',
    countryRolloutPercentage: 0,
    storeRollouts: [],
    softUpdateEnabled: false,
    ...initialData,
  });

  const [newStore, setNewStore] = useState('');
  const [newUser, setNewUser] = useState('');
  const [newStoreRollout, setNewStoreRollout] = useState<Omit<StoreRollout, 'percentage'>>({ 
    storeId: '' 
  });
  const [storeRolloutPercentage, setStoreRolloutPercentage] = useState(0);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const addStore = () => {
    if (newStore && !formData.stores.includes(newStore)) {
      setFormData(prev => ({
        ...prev,
        stores: [...prev.stores, newStore]
      }));
      setNewStore('');
    }
  };

  const removeStore = (storeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      stores: prev.stores.filter(store => store !== storeToRemove)
    }));
  };

  const addUser = () => {
    if (newUser && !formData.users.includes(newUser)) {
      setFormData(prev => ({
        ...prev,
        users: [...prev.users, newUser]
      }));
      setNewUser('');
    }
  };

  const removeUser = (userToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      users: prev.users.filter(user => user !== userToRemove)
    }));
  };

  const addStoreRollout = () => {
    if (newStoreRollout.storeId && !formData.storeRollouts.some(r => r.storeId === newStoreRollout.storeId)) {
      setFormData(prev => ({
        ...prev,
        storeRollouts: [
          ...prev.storeRollouts,
          { ...newStoreRollout, percentage: storeRolloutPercentage }
        ]
      }));
      setNewStoreRollout({ storeId: '' });
      setStoreRolloutPercentage(0);
    }
  };

  const removeStoreRollout = (storeId: string) => {
    setFormData(prev => ({
      ...prev,
      storeRollouts: prev.storeRollouts.filter(r => r.storeId !== storeId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="countryCode">Country Code</Label>
              <Input
                id="countryCode"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                placeholder="e.g., AE"
                required
                className={errors.countryCode ? 'border-red-500' : ''}
              />
              {errors.countryCode && (
                <p className="text-sm text-red-500 mt-1">{errors.countryCode}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="app">Application</Label>
              <Input
                id="app"
                name="app"
                value={formData.app}
                onChange={handleChange}
                placeholder="e.g., express"
                required
                className={errors.app ? 'border-red-500' : ''}
              />
              {errors.app && (
                <p className="text-sm text-red-500 mt-1">{errors.app}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="countryEnabled"
              checked={formData.countryEnabled}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, countryEnabled: checked }))
              }
            />
            <Label htmlFor="countryEnabled">Country Enabled</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="storeEnabled"
              checked={formData.storeEnabled}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, storeEnabled: checked }))
              }
            />
            <Label htmlFor="storeEnabled">Store Level Control Enabled</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="softUpdateEnabled"
              checked={formData.softUpdateEnabled}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, softUpdateEnabled: checked }))
              }
            />
            <Label htmlFor="softUpdateEnabled">Soft Update Enabled</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rollout Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="countryRolloutPercentage">Country Rollout Percentage</Label>
            <Input
              id="countryRolloutPercentage"
              name="countryRolloutPercentage"
              type="number"
              min="0"
              max="100"
              value={formData.countryRolloutPercentage}
              onChange={handleNumberChange}
              placeholder="0-100"
              className={errors.countryRolloutPercentage ? 'border-red-500' : ''}
            />
            {errors.countryRolloutPercentage && (
              <p className="text-sm text-red-500 mt-1">{errors.countryRolloutPercentage}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Store Rollouts</Label>
            <div className="space-y-2">
              {formData.storeRollouts.map((rollout) => (
                <div key={rollout.storeId} className="flex items-center space-x-2">
                  <span className="flex-1">
                    {rollout.storeId}: {rollout.percentage}%
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeStoreRollout(rollout.storeId)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="flex space-x-2">
                <Input
                  placeholder="Store ID"
                  value={newStoreRollout.storeId}
                  onChange={(e) => 
                    setNewStoreRollout(prev => ({ ...prev, storeId: e.target.value }))
                  }
                  className="flex-1"
                />
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="%"
                  value={storeRolloutPercentage}
                  onChange={(e) => setStoreRolloutPercentage(Number(e.target.value))}
                  className="w-24"
                />
                <Button
                  type="button"
                  onClick={addStoreRollout}
                  disabled={!newStoreRollout.storeId}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {formData.stores.length > 0 ? (
              <div className="space-y-2">
                {formData.stores.map((store) => (
                  <div key={store} className="flex items-center justify-between p-2 border rounded">
                    <span>{store}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStore(store)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No stores added yet</p>
            )}
            <div className="flex space-x-2">
              <Input
                placeholder="Add store ID"
                value={newStore}
                onChange={(e) => setNewStore(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addStore}
                disabled={!newStore}
              >
                Add Store
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {formData.users.length > 0 ? (
              <div className="space-y-2">
                {formData.users.map((user) => (
                  <div key={user} className="flex items-center justify-between p-2 border rounded">
                    <span>{user}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUser(user)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No users added yet</p>
            )}
            <div className="flex space-x-2">
              <Input
                placeholder="Add user ID"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addUser}
                disabled={!newUser}
              >
                Add User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
