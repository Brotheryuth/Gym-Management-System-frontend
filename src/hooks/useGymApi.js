import { useState, useEffect, useCallback } from 'react';
import { loginApi } from '../services/authService';
import { fetchPlansApi, createPlanApi, updatePlanApi, deletePlanApi } from '../services/planService';
import { registerMemberApi, updateMemberApi, deleteMemberApi, fetchMembersApi } from '../services/memberService';
import { createMembershipApi, cancelMembershipApi } from '../services/membershipService';
import { confirmPaymentApi, refundPaymentApi } from '../services/paymentService';

export default function useGymApi() {
  const [plans, setPlans] = useState([]);
  const [recentMembers, setRecentMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [cashier, setCashier] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper mapping function for Membership objects
  const mapMemberships = useCallback((memData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return memData.map(m => {
      let calcStatus = m.status || 'PENDING';
      if (m.endDate && m.endDate !== 'N/A' && calcStatus === 'ACTIVE') {
        const end = new Date(m.endDate);
        if (!isNaN(end.getTime()) && end < today) {
          calcStatus = 'EXPIRED';
        }
      }

      return {
        id: m.id,
        memberID: m.member?.id || 'N/A',
        fullName: m.member?.fullName || 'N/A',
        phoneNumber: m.member?.phoneNumber || 'N/A',
        dob: m.member?.dob || 'N/A',
        gender: m.member?.gender || 'OTHER',
        planName: m.plan?.planName || 'N/A',
        status: calcStatus,
        startDate: m.startDate || 'N/A',
        endDate: m.endDate || 'N/A'
      };
    });
  }, []);

  // Synchronize dashboard lists from backend
  const refreshDatabase = useCallback(async () => {
    try {
      const [memRes, payRes, membersRes] = await Promise.all([
        fetch('/api/memberships').catch(() => ({ ok: false })),
        fetch('/api/payments').catch(() => ({ ok: false })),
        fetch('/api/members').catch(() => ({ ok: false }))
      ]);

      let mappedMembers = [];
      if (membersRes && membersRes.ok) {
        const membersData = await membersRes.json();
        if (Array.isArray(membersData)) {
          mappedMembers = membersData.map(m => ({
            id: m.id,
            memberID: String(m.id || m.memberID),
            fullName: m.fullName,
            phoneNumber: m.phoneNumber,
            dob: m.dob,
            gender: m.gender,
            status: m.status || 'ACTIVE'
          }));
        }
      }

      let mappedMems = [];
      if (memRes.ok) {
        const memData = await memRes.json();
        mappedMems = mapMemberships(memData);
        setRecentMembers(mappedMems);
      } else {
        setRecentMembers([]);
      }

      // Fallback: Extract unique member accounts from memberships list
      if (mappedMembers.length === 0 && mappedMems.length > 0) {
        const uniqueIds = new Set();
        mappedMems.forEach(m => {
          if (m.memberID && m.memberID !== 'N/A' && !uniqueIds.has(m.memberID)) {
            uniqueIds.add(m.memberID);
            mappedMembers.push({
              id: m.id,
              memberID: m.memberID,
              fullName: m.fullName,
              phoneNumber: m.phoneNumber,
              dob: m.dob,
              gender: m.gender,
              status: m.status
            });
          }
        });
      }
      setMembers(mappedMembers);

      if (payRes.ok) {
        const payData = await payRes.json();
        setPayments(payData);
      } else {
        setPayments([]);
      }
    } catch (err) {
      console.warn('Failed to refresh database:', err);
      setRecentMembers([]);
      setPayments([]);
      setMembers([]);
      setIsOffline(true);
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
          setPlans(data);
          setIsOffline(false);
          await refreshDatabase();
        } else {
          setIsOffline(true);
          setPlans([]);
          setRecentMembers([]);
          setMembers([]);
          setPayments([]);
        }
      } catch (err) {
        console.warn('Backend offline.', err);
        setIsOffline(true);
        setPlans([]);
        setRecentMembers([]);
        setMembers([]);
        setPayments([]);
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
      const user = await loginApi(username, password);
      setCashier(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPlansApi();
      setPlans(data);
      return data;
    } catch (err) {
      setError(err.message);
      setPlans([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerMember = useCallback(async (memberData) => {
    setIsLoading(true);
    setError(null);
    try {
      return await registerMemberApi(memberData);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMembership = useCallback(async (subscriptionData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createMembershipApi(subscriptionData);
      await refreshDatabase();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshDatabase]);

  const confirmPayment = useCallback(async (paymentID, paymentMethod) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await confirmPaymentApi(paymentID, paymentMethod);
      await refreshDatabase();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshDatabase]);

  const deleteMember = useCallback(async (memberID) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteMemberApi(memberID);
      await refreshDatabase();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshDatabase]);

  const updateMember = useCallback(async (memberID, memberData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await updateMemberApi(memberID, memberData);
      await refreshDatabase();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshDatabase]);

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

  const createPlan = useCallback(async (planData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await createPlanApi(planData);
      await fetchPlans();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPlans]);

  const updatePlan = useCallback(async (planID, planData) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await updatePlanApi(planID, planData);
      await fetchPlans();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPlans]);

  const deletePlan = useCallback(async (planID) => {
    setIsLoading(true);
    setError(null);
    try {
      await deletePlanApi(planID);
      await fetchPlans();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchPlans]);

  const cancelMembership = useCallback(async (membershipID) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await cancelMembershipApi(membershipID);
      await refreshDatabase();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshDatabase]);

  const refundPayment = useCallback(async (paymentID) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await refundPaymentApi(paymentID);
      await refreshDatabase();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshDatabase]);

  const bypassLogin = useCallback((role = 'ADMIN') => {
    const bypassUser = { id: 'bypass-1', name: `bypass-${role.toLowerCase()}`, role: role, shift: 'DEVELOPER' };
    setCashier(bypassUser);
  }, []);

  return {
    plans,
    recentMembers,
    members,
    payments,
    cashier,
    isOffline,
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
    createPlan,
    updatePlan,
    deletePlan,
    cancelMembership,
    refundPayment
  };
}
