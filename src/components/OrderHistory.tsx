
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data for order history
const mockOrders = [
  {
    id: "ORD-12345",
    date: "May 12, 2023",
    status: "Delivered",
    total: "$34.99",
    items: [
      {
        name: "Custom Tote Bag",
        price: "$34.99",
        imageUrl: "https://picsum.photos/seed/tote1/200",
      },
    ],
  },
  {
    id: "ORD-12344",
    date: "April 29, 2023",
    status: "Shipped",
    total: "$69.98",
    items: [
      {
        name: "Custom Tote Bag",
        price: "$34.99",
        imageUrl: "https://picsum.photos/seed/tote2/200",
      },
      {
        name: "Custom Tote Bag",
        price: "$34.99",
        imageUrl: "https://picsum.photos/seed/tote3/200",
      },
    ],
  },
];

export function OrderHistory() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            View your past orders and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mockOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">You haven't placed any orders yet.</p>
              <Button className="mt-4" variant="outline">
                Browse products
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="border-b border-border pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium">{order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          order.status === "Delivered"
                            ? "default"
                            : order.status === "Shipped"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                      <p className="font-medium">{order.total}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      View details
                    </Button>
                    <Button variant="outline" size="sm">
                      Track order
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
