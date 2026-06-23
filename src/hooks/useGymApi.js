import { useState, useEffect, useCallback } from 'react';

// Pre-populated mockup database
const MOCK_PLANS = [
  { planID: '1', planName: 'Standard 1 Month', planPrice: 30.0, duration: 30 },
  { planID: '2', planName: 'Premium 3 Months', planPrice: 80.0, duration: 90 },
  { planID: '3', planName: 'Elite Year VIP', planPrice: 280.0, duration: 365 },
];

const MOCK_MEMBERS = [
  { id: '10', fullName: 'John Doe', phoneNumber: '012345678', dob: '1990-05-15', gender: 'MALE', planName: 'Premium 3 Months', status: 'ACTIVE' },
  { id: '11', fullName: 'Sarah Connor', phoneNumber: '098765432', dob: '1985-11-10', gender: 'FEMALE', planName: 'Elite Year VIP', status: 'ACTIVE' },
];

export default function useGymApi() {
  const [plans, setPlans] = useState(MOCK_PLANS);
  const [recentMembers, setRecentMembers] = useState(MOCK_MEMBERS);
  const [cashier, setCashier] = useState(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-detect backend on mount
  useEffect(() => {
    async function checkBackend() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/plans', { signal: AbortSignal.timeout(2000) });
        if (res.ok) {
          const data = await res.json();
          setPlans(data.length ? data : MOCK_PLANS);
          setIsSimulated(false);
        } else {
          setIsSimulated(true);
        }
      } catch (err) {
        console.warn('Backend offline. Switched to Simulation Mode.', err);
        setIsSimulated(true);
      } finally {
        setIsLoading(false);
      }
    }

    checkBackend();
  }, []);

  // Login action
  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isSimulated) {
        // Simulate response delay
        await new Promise((r) => setTimeout(r, 600));
        if (username === 'admin' && password === 'admin123') {
          const mockUser = { id: '1', name: 'admin', role: 'ADMIN', shift: 'FULLTIME' };
          setCashier(mockUser);
          return mockUser;
        } else {
          throw new Error('Invalid credentials. Hint: use admin/admin123');
        }
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: username, password }),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Login failed');
        }
        const data = await res.json();
        setCashier(data);
        return data;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isSimulated]);

  // Fetch plans (manual refetch)
  const fetchPlans = useCallback(async () => {
    if (isSimulated) return MOCK_PLANS;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/plans');
      if (!res.ok) throw new Error('Failed to fetch plans');
      const data = await res.json();
      setPlans(data);
      return data;
    } catch (err) {
      setError(err.message);
      return MOCK_PLANS;
    } finally {
      setIsLoading(false);
    }
  }, [isSimulated]);

  // Register Member and create Subscription workflow (Step 1 & 2)
  const createSubscription = useCallback(async (memberData, subscriptionData) => {
    setIsLoading(true);
    setError(null);
    try {
      let finalMemberID = '';
      let memberName = memberData.fullName;

      if (isSimulated) {
        await new Promise((r) => setTimeout(r, 1000));
        finalMemberID = String(Math.floor(Math.random() * 1000) + 12);
      } else {
        // Step 1: Create Member
        const memberRes = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberData),
        });
        if (!memberRes.ok) {
          throw new Error('Failed to register member profile');
        }
        const memberObj = await memberRes.json();
        finalMemberID = String(memberObj.memberID || memberObj.id);
        memberName = memberObj.fullName || memberName;
      }

      // Step 2: Create Subscription
      const subPayload = {
        memberID: finalMemberID,
        planID: subscriptionData.planID,
        startDate: subscriptionData.startDate,
        discount: Number(subscriptionData.discount),
        paymentMethod: subscriptionData.paymentMethod,
      };

      let subscriptionId = '';
      let paymentID = '';

      if (isSimulated) {
        subscriptionId = String(Math.floor(Math.random() * 1000) + 50);
        paymentID = `pay-${subscriptionId}`;
      } else {
        const subRes = await fetch('/api/memberships', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(subPayload),
        });
        if (!subRes.ok) {
          throw new Error('Failed to create membership subscription');
        }
        const subObj = await subRes.json();
        subscriptionId = String(subObj.membershipID || subObj.id);
        paymentID = String(subObj.paymentID || subObj.payment?.id || `pay-${subscriptionId}`);
      }

      return {
        memberID: finalMemberID,
        memberName,
        membershipID: subscriptionId,
        paymentID: paymentID,
        planID: subscriptionData.planID,
        discount: subPayload.discount,
        paymentMethod: subPayload.paymentMethod,
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isSimulated]);

  // Confirm Payment (Step 4)
  const confirmPayment = useCallback(async (paymentID, paymentMethod) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isSimulated) {
        await new Promise((r) => setTimeout(r, 1200));
        // Success mockup
        return { success: true, paymentID };
      } else {
        const res = await fetch(`/api/payments/${paymentID}/process`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentMethod }),
        });
        if (!res.ok) {
          throw new Error('Payment processing failed. Card declined or terminal error.');
        }
        return { success: true, paymentID };
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isSimulated]);

  // Add registered subscriber to recent dashboard log
  const commitNewSubscriber = useCallback((newSub, planDetails) => {
    const freshRecord = {
      id: newSub.memberID,
      fullName: newSub.memberName,
      phoneNumber: newSub.phoneNumber || 'N/A',
      dob: newSub.dob || 'N/A',
      gender: newSub.gender || 'OTHER',
      planName: planDetails ? planDetails.planName : 'Gym Plan',
      status: 'ACTIVE',
    };
    setRecentMembers((prev) => [freshRecord, ...prev]);
  }, []);

  const logout = useCallback(() => {
    setCashier(null);
  }, []);

  const bypassLogin = useCallback(() => {
    const bypassUser = { id: 'bypass-1', name: 'bypass-dev', role: 'ADMIN', shift: 'DEVELOPER' };
    setCashier(bypassUser);
    setIsSimulated(true);
  }, []);

  return {
    plans,
    recentMembers,
    cashier,
    isSimulated,
    isLoading,
    error,
    login,
    fetchPlans,
    createSubscription,
    confirmPayment,
    commitNewSubscriber,
    logout,
    bypassLogin,
  };
}
