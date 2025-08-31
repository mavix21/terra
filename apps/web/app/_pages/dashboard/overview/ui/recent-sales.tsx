import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@terra/ui/components/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@terra/ui/components/card";

const salesData = [
  {
    name: "Caturra Lot #12",
    email: "buyer1@roastery.com",
    avatar: "https://api.slingacademy.com/public/sample-users/6.png",
    fallback: "C1",
    amount: "+$1,250.00",
  },
  {
    name: "Bourbon Lot #7",
    email: "buyer2@cafe.com",
    avatar: "https://api.slingacademy.com/public/sample-users/7.png",
    fallback: "B7",
    amount: "+$890.00",
  },
  {
    name: "Geisha Lot #3",
    email: "buyer3@importer.com",
    avatar: "https://api.slingacademy.com/public/sample-users/8.png",
    fallback: "G3",
    amount: "+$2,340.00",
  },
  {
    name: "Typica Lot #5",
    email: "buyer4@distributor.com",
    avatar: "https://api.slingacademy.com/public/sample-users/9.png",
    fallback: "T5",
    amount: "+$1,020.00",
  },
  {
    name: "Blend Lot #4",
    email: "buyer5@wholesale.com",
    avatar: "https://api.slingacademy.com/public/sample-users/10.png",
    fallback: "BL",
    amount: "+$640.00",
  },
];

export function RecentSales() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          Latest purchases from roasters and shops.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {salesData.map((sale, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={sale.avatar} alt="Avatar" />
                <AvatarFallback>{sale.fallback}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm leading-none font-medium">{sale.name}</p>
                <p className="text-muted-foreground text-sm">{sale.email}</p>
              </div>
              <div className="ml-auto font-medium">{sale.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
