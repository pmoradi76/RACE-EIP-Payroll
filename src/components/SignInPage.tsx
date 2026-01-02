import { Shield, User, Building2, Settings, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface SignInPageProps {
  onSelectUserType: (userType: 'employee' | 'organisation' | 'admin') => void;
  onBackToLanding: () => void;
}

export function SignInPage({ onSelectUserType, onBackToLanding }: SignInPageProps) {
  const userTypes = [
    {
      type: 'employee' as const,
      icon: User,
      title: "I'm an Employee",
      description: "Check your pay, verify entitlements, and get evidence-cited explanations",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      iconColor: "text-blue-600",
      exampleUser: "Ava Nguyen • Casual Educator"
    },
    {
      type: 'organisation' as const,
      icon: Building2,
      title: "I'm an Organisation/Auditor",
      description: "Bulk audits, compliance reports, and review queue for HR managers and auditors",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      iconColor: "text-purple-600",
      exampleUser: "Jane Davis • HR Manager"
    },
    {
      type: 'admin' as const,
      icon: Settings,
      title: "I'm a System Admin",
      description: "Manage awards, prompts, models, users, and monitor system performance",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      iconColor: "text-green-600",
      exampleUser: "Mark Smith • System Administrator"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Top Bar */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onBackToLanding}>
              <Shield className="size-7 text-primary" />
              <span className="text-xl">PayGuard</span>
            </div>
            <Button variant="ghost" onClick={onBackToLanding}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="mb-4">Sign In to PayGuard</h1>
            <p className="text-lg text-muted-foreground">
              Select your account type to continue
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {userTypes.map((userType) => (
              <Card
                key={userType.type}
                className={`cursor-pointer transition-all hover:shadow-lg ${userType.color} border-2`}
                onClick={() => onSelectUserType(userType.type)}
              >
                <CardHeader>
                  <div className="mb-4">
                    <div className={`rounded-full bg-white p-4 w-fit ${userType.iconColor}`}>
                      <userType.icon className="size-8" />
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{userType.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {userType.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="pt-4 border-t border-border/50">
                    <div className="text-xs text-muted-foreground mb-2">Demo account:</div>
                    <div className="text-sm mb-4">{userType.exampleUser}</div>
                    <Button 
                      className="w-full gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectUserType(userType.type);
                      }}
                    >
                      Continue
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Don't have an account? <a href="#" className="text-primary hover:underline">Request Demo</a>
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm">
              <span className="text-amber-800">
                🔒 This is a demo environment. All data is sample data.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
