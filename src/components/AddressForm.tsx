
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for saved addresses
const mockAddresses = [
  {
    id: "addr-1",
    name: "Home",
    street: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    country: "United States",
    isDefault: true,
  },
];

export function AddressForm() {
  const [addresses, setAddresses] = useState(mockAddresses);
  const [isAdding, setIsAdding] = useState(false);

  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `addr-${Date.now()}`;
    setAddresses([...addresses, { ...newAddress, id, isDefault: addresses.length === 0 }]);
    setNewAddress({
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Saved Addresses</CardTitle>
          <CardDescription>
            Manage your shipping and billing addresses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 && !isAdding ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">You don't have any saved addresses.</p>
              <Button className="mt-4" onClick={() => setIsAdding(true)}>
                Add an address
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="flex flex-col rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{address.name}</h3>
                        {address.isDefault && (
                          <span className="text-xs text-muted-foreground">(Default)</span>
                        )}
                      </div>
                      <p className="mt-1 text-sm">
                        {address.street}
                        <br />
                        {address.city}, {address.state} {address.zipCode}
                        <br />
                        {address.country}
                      </p>
                    </div>
                    <div className="mt-4 space-x-2 sm:mt-0">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Delete
                      </Button>
                      {!address.isDefault && (
                        <Button variant="outline" size="sm">
                          Set as default
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {!isAdding && (
                <Button className="mt-4" onClick={() => setIsAdding(true)}>
                  Add new address
                </Button>
              )}
            </>
          )}

          {isAdding && (
            <form onSubmit={handleAddAddress} className="mt-6 space-y-4 border-t pt-6">
              <h3 className="font-medium">Add New Address</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Address Name</Label>
                  <Input
                    id="name"
                    placeholder="Home, Work, etc."
                    value={newAddress.name}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    placeholder="123 Main St"
                    value={newAddress.street}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, street: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="San Francisco"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="CA"
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, state: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="94105"
                    value={newAddress.zipCode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, zipCode: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={newAddress.country}
                    onValueChange={(value) =>
                      setNewAddress({ ...newAddress, country: value })
                    }
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Save Address</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
