import { Check, Clock, Presentation, Shield } from "lucide-react";


export const benefits = [
    {
        title: "Time Efficiency",
        description:
            "Create presentations 10x faster than traditional methods",
        icon: <Clock className="w-6 h-6 text-primary" />,
    },
    {
        title: "Professional Design",
        description: "Get access to premium templates and layouts",
        icon: <Presentation className="w-6 h-6 text-primary" />,
    },
    {
        title: "Easy to Use",
        description:
            "No design skills required - just describe your needs",
        icon: <Check className="w-6 h-6 text-primary" />,
    },
    {
        title: "Secure Platform",
        description: "Your content is always private and protected",
        icon: <Shield className="w-6 h-6 text-primary" />,
    },
]