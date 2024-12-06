import { Users, MessageCircle, TrendingUp, CheckCircle2 } from 'lucide-react'

export const engagementData = [
  { month: "Jan", engagement: 50 },
  { month: "Feb", engagement: 80 },
  { month: "Mar", engagement: 120 },
  { month: "Apr", engagement: 180 },
  { month: "May", engagement: 250 },
]

export const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Social Media Manager",
    company: "TechStart Inc.",
    content: "automateinstareply has revolutionized our Instagram engagement. We've seen a 200% increase in meaningful interactions!",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Digital Marketing Director",
    company: "GrowFast Agency",
    content: "The analytics provided by automateinstareply have been invaluable. We can now make data-driven decisions for our clients.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "E-commerce Owner",
    content: "As a small business owner, automateinstareply has saved me countless hours. It's like having a full-time social media team!",
    rating: 4
  }
]

export const statistics = [
  { title: "Active Users", value: "10,000+", icon: Users },
  { title: "Comments Handled", value: "1M+", icon: MessageCircle },
  { title: "Engagement Increase", value: "200%", icon: TrendingUp },
  { title: "Time Saved", value: "1000+ hours", icon: CheckCircle2 },
]

export const pricingPlans = [
  {
    name: "Pro",
    description: "Ideal for those who've already got their Instagram presence up and running and are seeking assistance to enhance and update it further.",
    monthlyPrice: 10,
    quarterlyPrice: 27,
    features: [
      "3-5 day turnaround",
      "Native Development",
      "Task delivered one-by-one",
      "Dedicated dashboard",
      "Updates via Dashboard & Slack"
    ]
  },
  {
    name: "Pro Plus",
    description: "Ideal if you want to build or scale your Instagram presence fast, with the strategy calls included.",
    monthlyPrice: 20,
    quarterlyPrice: 54,
    features: [
      "1-3 day turnaround",
      "Monthly strategy call",
      "Commercial license",
      "Native Development",
      "Tasks delivered one-by-one",
      "Dedicated dashboard",
      "Updates via Dashboard & Slack"
    ]
  }
]
