import { useState, useEffect, useCallback } from 'react';
import { loginApi } from '../services/authService';
import { fetchPlansApi } from '../services/planService';
import { registerMemberApi, updateMemberApi, deleteMemberApi } from '../services/memberService';
import { createMembershipApi } from '../services/membershipService';
import { confirmPaymentApi } from '../services/paymentService';

// Pre-populated mockup database
const MOCK_PLANS = [
  { planID: '1', planName: 'Standard 1 Month', planPrice: 30.0, duration: 30 },
  { planID: '2', planName: 'Premium 3 Months', planPrice: 80.0, duration: 90 },
  { planID: '3', planName: 'Elite Year VIP', planPrice: 280.0, duration: 365 },
];

const MOCK_MEMBERS = [
  { id: '10', memberID: 'm-10', fullName: 'John Doe', phoneNumber: '012345678', dob: '1990-05-15', gender: 'MALE', planName: 'Premium 3 Months', status: 'ACTIVE', startDate: '2026-06-20', endDate: '2026-09-20' },
  { id: '11', memberID: 'm-11', fullName: 'Sarah Connor', phoneNumber: '098765432', dob: '1985-11-10', gender: 'FEMALE', planName: 'Elite Year VIP', status: 'ACTIVE', startDate: '2026-01-01', endDate: '2027-01-01' },
];

const MOCK_PAYMENTS = [
  { id: '200', membershipID: '10', baseAmount: 80.0, finalAmount: 80.0, discount: 0, method: 'KHQR', status: 'PAID', createAt: '2026-06-20T14:30:00', paymentDate: '2026-06-20T14:30:05' },
  { id: '201', membershipID: '11', baseAmount: 280.0, finalAmount: 252.0, discount: 10, method: 'KHQR', status: 'PAID', createAt: '2026-06-24T10:15:00', paymentDate: '2026-06-24T10:15:10' },
];

export default function useGymApi() {
  const [plans, setPlans] = useState(MOCK_PLANS);
  const [recentMembers, setRecentMembers] = useState(MOCK_MEMBERS);
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [cashier, setCashier] = useState(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper mapping function for Membership objects
  const mapMemberships = useCallback((memData) => {
    return memData.map(m => ({
      id: m.id,
      memberID: m.member?.id || 'N/A',
      fullName: m.member?.fullName || 'N/A',
      phoneNumber: m.member?.phoneNumber || 'N/A',
      dob: m.member?.dob || 'N/A',
      gender: m.member?.gender || 'OTHER',
      planName: m.plan?.planName || 'N/A',
      status: m.status || 'PENDING',
      startDate: m.startDate || 'N/A',
      endDate: m.endDate || 'N/A'
    }));
  }, []);

  // Synchronize dashboard lists from backend
  const refreshDatabase = useCallback(async () => {
    const [memRes, payRes] = await Promise.all([
      fetch('/api/memberships'),
      fetch('/api/payments')
    ]);
    if (memRes.ok) {
      const memData = await memRes.json();
      setRecentMembers(mapMemberships(memData));
    }
    if (payRes.ok) {
      const payData = await payRes.json();
      setPayments(payData);
    }
  }, [mapMemberships]);

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
          await refreshDatabase();
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
  }, [refreshDatabase]);

  const login = useCallback(async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await loginApi(username, password, isSimulated);
      setCashier(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isSimulated]);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPlansApi(isSimulated, MOCK_PLANS);
      setPlans(data);
      return data;
    } catch (err) {
      setError(err.message);
      return MOCK_PLANS;
    } finally {
      setIsLoading(false);
    }
  }, [isSimulated]);

  const registerMember = useCallback(async (memberData) => {
    setIsLoading(true);
    setError(null);
    try {
      return await registerMemberApi(memberData, isSimulated);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isSimulated]);

  const createMembership = useCallback(async (subscriptionData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createMembershipApi(subscriptionData, isSimulated);
      if (!isSimulated) {
        await refreshDatabase();
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isSimulated, refreshDatabase]);

  const confirmPayment = useCallback(async (paymentID, paymentMethod) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await confirmPaymentApi(paymentID, paymentMethod, isSimulated);
      if (!isSimulated) {
        await refreshDatabase();
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isSimulated, refreshDatabase]);

  const deleteMember = useCallback(async (memberID) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteMemberApi(memberID, isSimulated);
      if (isSimulated) {
        setRecentMembers(prev => prev.filter(m => String(m.memberID) !== String(memberID)));
      } else {
        await refreshDatabase();
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isSimulated, refreshDatabase]);

  const updateMember = useCallback(async (memberID, memberData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await updateMemberApi(memberID, memberData, isSimulated);
      if (!isSimulated) {
        await refreshDatabase();
      }
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isSimulated, refreshDatabase]);

  const commitNewSubscriber = useCallback((newSub, planDetails) => {
    const freshRecord = {
      id: newSub.memberID,
      memberID: newSub.memberID,
      fullName: newSub.memberName,
      phoneNumber: newSub.phoneNumber || 'N/A',
      dob: newSub.dob || 'N/A',
      gender: newSub.gender || 'OTHER',
      planName: planDetails ? planDetails.planName : 'Gym Plan',
      status: 'ACTIVE',
      startDate: new Date().toISOString().split('T')[0],
      endDate: 'N/A'
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
    payments,
    cashier,
    isSimulated,
    isLoading,
    error,
    login,
    fetchPlans,
    registerMember,
    createMembership,
    confirmPayment,
    commitNewSubscriber,
    logout,
    bypassLogin,
    deleteMember,
    updateMember,
  };
}
