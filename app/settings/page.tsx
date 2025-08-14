import UserProfile from '../components/UserProfile';
import PayPalPayment from '../components/PayPalPayment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 px-4 sm:px-0">
          Account Settings
        </h1>
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Settings</h2>
          <PayPalPayment />
        </div>
        <UserProfile />
      </div>
    </div>
  );
}
