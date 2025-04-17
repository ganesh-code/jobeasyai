import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "$9.99",
    features: [
      "Up to 5 job applications per month",
      "Basic job matching",
      "Email templates",
      "Resume storage",
    ],
  },
  {
    name: "Pro",
    price: "$19.99",
    features: [
      "Unlimited job applications",
      "Advanced job matching",
      "Custom email templates",
      "Resume and cover letter storage",
      "Priority support",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated account manager",
      "Team collaboration",
      "API access",
    ],
  },
];

export function UpgradeSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">Upgrade Your Plan</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${
              plan.popular ? "border-2 border-yellow-500" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-center">{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <span className="text-3xl font-bold">{plan.price}</span>
                {plan.price !== "Custom" && (
                  <span className="text-muted-foreground">/month</span>
                )}
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
