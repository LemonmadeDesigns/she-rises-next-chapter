import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/sections/Hero";
import { Clock, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import BecomeVolunteerModal from "@/components/modals/BecomeVolunteerModal";

const VolunteerOpportunityDetails = () => {
  const { opportunityId } = useParams();
  const navigate = useNavigate();
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);

  const opportunities = [
    {
      id: "direct-support",
      title: "Direct Support Volunteer",
      category: "Direct Service",
      commitment: "4-8 hours/week",
      description: "Work directly with women in our programs, providing mentorship, life skills support, and companionship. As a direct support volunteer, you'll be paired with program participants to offer guidance, encouragement, and practical assistance as they navigate their journey toward independence and self-sufficiency.",
      fullDescription: "Direct support volunteers are the heart of our organization. You'll work one-on-one with women who are rebuilding their lives after incarceration, domestic violence, or other challenging circumstances. This role involves building trusting relationships, providing emotional support, and helping with practical tasks like job applications, housing searches, or life skills development. You'll attend training sessions, meet regularly with your mentee, and work closely with our staff to ensure the best outcomes for participants.",
      requirements: [
        "Background check required",
        "Training provided",
        "6-month minimum commitment",
        "Trauma-informed care training"
      ],
      responsibilities: [
        "Meet with assigned participant 1-2 times per week",
        "Provide emotional support and encouragement",
        "Assist with goal-setting and achievement tracking",
        "Help with practical tasks (job applications, transportation, etc.)",
        "Attend monthly volunteer meetings",
        "Maintain confidentiality and professional boundaries",
        "Complete required documentation and check-ins"
      ],
      impact: [
        "Help women successfully transition to independent living",
        "Reduce recidivism rates in our community",
        "Provide crucial support during vulnerable times",
        "Build lasting, meaningful relationships",
        "Contribute to breaking cycles of poverty and incarceration"
      ],
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop&crop=center",
      featured: true
    },
    {
      id: "administrative",
      title: "Administrative Support",
      category: "Office Support",
      commitment: "2-4 hours/week",
      description: "Help with data entry, filing, phone calls, and general office tasks that keep our programs running smoothly.",
      fullDescription: "Administrative volunteers provide essential behind-the-scenes support that enables our programs to function efficiently. You'll work in our office environment, helping with various tasks that support our mission. This role is perfect for those who enjoy organization, have good computer skills, and want to contribute in a structured, office-based setting.",
      requirements: [
        "Basic computer skills",
        "Reliable schedule",
        "Detail-oriented",
        "Professional communication"
      ],
      responsibilities: [
        "Answer phones and direct calls appropriately",
        "Manage filing systems and maintain organized records",
        "Data entry for participant information and program metrics",
        "Prepare materials for workshops and events",
        "Assist with mailings and correspondence",
        "Help with donor database management",
        "Support event planning and coordination"
      ],
      impact: [
        "Enable staff to focus more time on direct services",
        "Ensure accurate record-keeping for program evaluation",
        "Improve organizational efficiency",
        "Support fundraising efforts through donor management",
        "Help maintain professional office operations"
      ],
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&h=400&fit=crop&crop=center",
      featured: false
    },
    {
      id: "events",
      title: "Event Support Team",
      category: "Events",
      commitment: "Flexible",
      description: "Help plan and execute fundraising events, community workshops, and awareness campaigns.",
      fullDescription: "Event support volunteers help bring our community events to life. From fundraising galas to educational workshops, you'll be part of creating memorable experiences that raise awareness, build community, and generate support for our mission. This dynamic role offers variety and the chance to use your creativity and organizational skills.",
      requirements: [
        "Enthusiasm for event planning",
        "Good communication skills",
        "Team player attitude",
        "Weekend availability preferred"
      ],
      responsibilities: [
        "Assist with event planning and logistics",
        "Set up and break down event spaces",
        "Greet guests and provide information",
        "Manage registration tables",
        "Coordinate volunteers during events",
        "Help with marketing and promotion",
        "Collect feedback and evaluate event success"
      ],
      impact: [
        "Raise funds for critical programs and services",
        "Build community awareness and support",
        "Create networking opportunities for participants",
        "Showcase success stories and program impact",
        "Foster community engagement and partnership"
      ],
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop&crop=center",
      featured: true
    },
    {
      id: "professional",
      title: "Professional Skills Volunteer",
      category: "Professional Services",
      commitment: "1-3 hours/week",
      description: "Share your professional expertise in areas like legal aid, financial counseling, healthcare, or career coaching.",
      fullDescription: "Professional skills volunteers bring specialized expertise to support program participants. Whether you're a lawyer, accountant, healthcare provider, career counselor, or other professional, your skills can make a tremendous difference in the lives of women working to rebuild their futures. This role allows you to use your professional training in a meaningful, community-focused way.",
      requirements: [
        "Professional certification/license",
        "Relevant experience",
        "Cultural sensitivity training",
        "Flexible schedule"
      ],
      responsibilities: [
        "Provide consultations in your area of expertise",
        "Offer workshops or training sessions",
        "Review documents or provide guidance",
        "Connect participants with resources",
        "Maintain professional standards and ethics",
        "Document services provided",
        "Collaborate with staff on participant needs"
      ],
      impact: [
        "Provide access to professional services often unaffordable",
        "Help resolve legal, financial, or health barriers",
        "Empower women with knowledge and skills",
        "Prevent crises through early intervention",
        "Build pathways to economic stability"
      ],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=center",
      featured: false
    },
    {
      id: "childcare",
      title: "Childcare Support",
      category: "Family Services",
      commitment: "3-6 hours/week",
      description: "Provide childcare during program sessions, workshops, and events to support mothers in our programs.",
      fullDescription: "Childcare volunteers provide a crucial service that enables mothers to fully participate in programs, workshops, and events. By caring for children in a safe, engaging environment, you remove a major barrier to participation and demonstrate that we value and support the whole family. This role is perfect for those who love working with children and want to support mothers in their journey.",
      requirements: [
        "Experience with children",
        "Background check required",
        "CPR certification preferred",
        "Patience and creativity"
      ],
      responsibilities: [
        "Supervise children during program activities",
        "Plan and lead age-appropriate activities",
        "Maintain a safe, clean environment",
        "Communicate with parents about their children",
        "Handle minor emergencies appropriately",
        "Keep attendance and incident records",
        "Support children's emotional and social needs"
      ],
      impact: [
        "Enable mothers to focus on their development",
        "Remove childcare as a barrier to participation",
        "Provide positive experiences for children",
        "Support healthy parent-child relationships",
        "Demonstrate family-centered approach"
      ],
      image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&h=400&fit=crop&crop=center",
      featured: false
    },
    {
      id: "transportation",
      title: "Transportation Assistance",
      category: "Support Services",
      commitment: "2-4 hours/week",
      description: "Help women get to appointments, job interviews, court dates, and program activities.",
      fullDescription: "Transportation volunteers provide reliable rides to women who lack access to transportation. This essential service helps participants make it to job interviews, medical appointments, court dates, and program activities. Your commitment helps remove a critical barrier to success and demonstrates that we're here to support every step of the journey.",
      requirements: [
        "Valid driver's license",
        "Clean driving record",
        "Reliable vehicle",
        "Flexible schedule"
      ],
      responsibilities: [
        "Provide safe, reliable transportation",
        "Maintain punctuality and communication",
        "Respect participant privacy and dignity",
        "Track mileage for reimbursement",
        "Follow safety protocols",
        "Maintain professional boundaries",
        "Report any concerns to staff"
      ],
      impact: [
        "Ensure participants can access critical services",
        "Support employment success through reliable transportation",
        "Reduce stress and anxiety about getting places",
        "Demonstrate tangible support and care",
        "Remove barriers to program participation"
      ],
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center",
      featured: false
    }
  ];

  const opportunity = opportunities.find(opp => opp.id === opportunityId);

  if (!opportunity) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-royal-plum mb-4">Opportunity Not Found</h1>
          <p className="text-muted-foreground mb-8">The volunteer opportunity you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/get-involved')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Get Involved
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title={opportunity.title}
        subtitle={opportunity.description}
        backgroundColor="#4B2E6D"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            size="lg"
            className="bg-crown-gold hover:bg-crown-gold/90 text-royal-plum font-bold"
            onClick={() => setIsVolunteerModalOpen(true)}
          >
            Apply for This Role
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            className="hero-button-secondary btn-force-visible"
            onClick={() => navigate('/get-involved')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            View All Opportunities
          </Button>
        </div>
      </Hero>

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <Badge className="bg-royal-plum text-white text-lg px-4 py-2">
                {opportunity.category}
              </Badge>
              {opportunity.featured && (
                <Badge className="bg-crown-gold text-royal-plum text-lg px-4 py-2">
                  Featured Opportunity
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mb-8 text-lg">
              <Clock className="h-5 w-5 text-crown-gold" />
              <span className="font-semibold">Time Commitment:</span>
              <span>{opportunity.commitment}</span>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-royal-plum mb-6">About This Role</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {opportunity.fullDescription}
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-royal-plum mb-6">Requirements</h2>
              <div className="space-y-3">
                {opportunity.requirements.map((req, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-crown-gold mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-lg text-muted-foreground">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-royal-plum mb-6">Key Responsibilities</h2>
              <div className="space-y-3">
                {opportunity.responsibilities.map((resp, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-crown-gold rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-lg text-muted-foreground">{resp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-3xl font-bold text-royal-plum mb-6">Your Impact</h2>
              <p className="text-lg text-muted-foreground mb-6">
                As a {opportunity.title.toLowerCase()}, you will:
              </p>
              <div className="space-y-3">
                {opportunity.impact.map((impact, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-sage-green mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-lg text-muted-foreground">{impact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <Card className="overflow-hidden mb-12">
              <img
                src={opportunity.image}
                alt={opportunity.title}
                className="w-full h-96 object-cover"
              />
            </Card>

            {/* Call to Action */}
            <Card className="bg-gradient-soft">
              <CardContent className="p-8 text-center">
                <h3 className="font-serif text-2xl font-bold text-royal-plum mb-4">
                  Ready to Make a Difference?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Join our team of dedicated volunteers and help empower women in our community.
                  Your time and skills can transform lives.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-royal-plum hover:bg-royal-plum/90 text-white"
                    onClick={() => setIsVolunteerModalOpen(true)}
                  >
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/get-involved')}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    View Other Opportunities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Volunteer Modal */}
      <BecomeVolunteerModal
        isOpen={isVolunteerModalOpen}
        onClose={() => setIsVolunteerModalOpen(false)}
      />
    </Layout>
  );
};

export default VolunteerOpportunityDetails;
