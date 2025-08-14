import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function UserProfile() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  // Removed Stripe upgrade handler as PayPal component handles payments

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4">
          {session.user?.image && (
            <img 
              src={session.user.image} 
              alt="Profile" 
              className="h-16 w-16 rounded-full"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold">{session.user?.name}</h2>
            <p className="text-gray-600">{session.user?.email}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Your Plan</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Current Plan</p>
                <p className="text-sm text-gray-600">
                  Basic features with AI image generation
                </p>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
