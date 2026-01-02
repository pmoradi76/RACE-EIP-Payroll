import { useState } from 'react';
import { Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginFormProps {
  userType: 'employee' | 'organisation' | 'admin';
  onLogin: () => void;
  onBack: () => void;
}

const userTypeConfig = {
  employee: {
    title: 'Employee Login',
    description: 'Sign in to check your pay and verify entitlements',
    sampleUsername: 'ava.nguyen@brightsteps.edu.au',
    samplePassword: 'demo123',
    displayName: 'Ava Nguyen',
    role: 'Casual Educator'
  },
  organisation: {
    title: 'Organisation Login',
    description: 'Sign in to manage compliance and audits',
    sampleUsername: 'jane.davis@littlelearners.edu.au',
    samplePassword: 'demo123',
    displayName: 'Jane Davis',
    role: 'HR Manager'
  },
  admin: {
    title: 'System Admin Login',
    description: 'Sign in to manage system configuration',
    sampleUsername: 'mark.smith@payguard.com',
    samplePassword: 'admin123',
    displayName: 'Mark Smith',
    role: 'System Administrator'
  }
};

export function LoginForm({ userType, onLogin, onBack }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const config = userTypeConfig[userType];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate credentials
    if (username === config.sampleUsername && password === config.samplePassword) {
      onLogin();
    } else {
      setError('Invalid credentials. Please use the sample credentials provided below.');
    }
  };

  const fillSampleCredentials = () => {
    setUsername(config.sampleUsername);
    setPassword(config.samplePassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Top Bar */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="size-7 text-primary" />
              <span className="text-xl">PayGuard</span>
            </div>
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="size-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-20">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{config.title}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Email / Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full">
                  Sign In
                </Button>

                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground mb-3">Demo credentials:</div>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium">{config.displayName}</div>
                        <div className="text-xs text-muted-foreground">{config.role}</div>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={fillSampleCredentials}
                      >
                        Use Demo
                      </Button>
                    </div>
                    <div className="text-xs space-y-1 pt-2 border-t border-border">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <code className="text-xs">{config.sampleUsername}</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Password:</span>
                        <code className="text-xs">{config.samplePassword}</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Forgot password? <a href="#" className="text-primary hover:underline">Reset here</a>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm">
              <span className="text-amber-800">
                🔒 This is a demo environment with sample credentials
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
