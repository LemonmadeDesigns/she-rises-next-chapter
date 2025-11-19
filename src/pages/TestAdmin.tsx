import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestAdmin() {
  const [status, setStatus] = useState<any>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const runTests = async () => {
      const results: any = {};

      try {
        // Test 1: Check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        results.session = {
          success: !!session,
          user: session?.user?.email,
          error: sessionError?.message
        };

        // Test 2: Test visit_requests table access
        const { data, error: visitError } = await supabase
          .from('visit_requests')
          .select('count')
          .limit(1);

        results.visitRequests = {
          success: !visitError,
          error: visitError?.message,
          hint: visitError?.hint,
          details: visitError?.details,
          code: visitError?.code
        };

        // Test 3: Check if user is admin (case-insensitive)
        const adminEmails = ['pransom1319@gmail.com', 'empowerhavenhomes@gmail.com'];
        const userEmail = session?.user?.email?.toLowerCase() || '';
        results.isAdmin = {
          success: userEmail && adminEmails.map(e => e.toLowerCase()).includes(userEmail),
          email: session?.user?.email,
          adminList: adminEmails
        };

        // Test 4: Try to fetch actual visit requests
        const { data: requests, error: fetchError } = await supabase
          .from('visit_requests')
          .select('*')
          .limit(5);

        results.fetchRequests = {
          success: !fetchError,
          count: requests?.length || 0,
          error: fetchError?.message,
          hint: fetchError?.hint
        };

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }

      setStatus(results);
    };

    runTests();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8">Admin Access Test Page</h1>

        {error && (
          <Card className="mb-6 border-red-500">
            <CardHeader>
              <CardTitle className="text-red-600">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-red-600">{error}</pre>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {Object.entries(status).map(([key, value]: [string, any]) => (
            <Card key={key} className={value.success ? 'border-green-500' : 'border-red-500'}>
              <CardHeader>
                <CardTitle>{key}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(value, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}