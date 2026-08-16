import { useEffect, useState } from 'react';
import { db, ensureAuthenticated } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  setDoc
} from 'firebase/firestore';
import { InvitationCardData } from '../types';

const INVITATIONS_COLLECTION = 'invitations';
const GUESTBOOK_COLLECTION = 'guestbook';

export interface GuestbookEntry {
  id?: string;
  authorName: string;
  village?: string;
  message: string;
  createdAt: string;
  userId?: string;
}

// Hook to synchronize invitations with Cloud Firestore & localStorage fallback
export function useCloudInvitations(initialLocalInvitations: InvitationCardData[]) {
  const [invitations, setInvitations] = useState<InvitationCardData[]>(initialLocalInvitations);
  const [loading, setLoading] = useState(true);
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupSync = async () => {
      try {
        await ensureAuthenticated();
        const invitationsRef = collection(db, INVITATIONS_COLLECTION);
        const q = query(invitationsRef, orderBy('createdAt', 'desc'));

        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            if (!snapshot.empty) {
              const cloudItems: InvitationCardData[] = snapshot.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Omit<InvitationCardData, 'id'>),
              }));
              setInvitations(cloudItems);
              try {
                localStorage.setItem('hassi_bekay_invitations_list', JSON.stringify(cloudItems));
              } catch (e) {
                // ignore
              }
            }
            setIsCloudConnected(true);
            setLoading(false);
          },
          (error) => {
            console.warn('Firestore snapshot error or offline mode:', error);
            setIsCloudConnected(false);
            setLoading(false);
          }
        );
      } catch (err) {
        console.warn('Error setting up Firebase connection:', err);
        setIsCloudConnected(false);
        setLoading(false);
      }
    };

    setupSync();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const saveInvitation = async (invitation: InvitationCardData) => {
    // 1. Optimistic update
    setInvitations((prev) => [invitation, ...prev.filter((i) => i.id !== invitation.id)]);
    try {
      localStorage.setItem(
        'hassi_bekay_invitations_list',
        JSON.stringify([invitation, ...invitations.filter((i) => i.id !== invitation.id)])
      );
    } catch (e) {
      // ignore
    }

    // 2. Persist to Firestore
    try {
      await ensureAuthenticated();
      const docRef = doc(db, INVITATIONS_COLLECTION, invitation.id);
      await setDoc(docRef, {
        recipientName: invitation.recipientName,
        recipientHonorificFr: invitation.recipientHonorificFr,
        recipientHonorificAr: invitation.recipientHonorificAr,
        whatsappPhone: invitation.whatsappPhone,
        category: invitation.category,
        seatZone: invitation.seatZone || '',
        notes: invitation.notes || '',
        createdAt: invitation.createdAt,
        invitationCode: invitation.invitationCode,
      });
      setIsCloudConnected(true);
    } catch (err) {
      console.error('Failed to save invitation to Firestore:', err);
    }
  };

  const removeInvitation = async (id: string) => {
    // 1. Optimistic remove
    setInvitations((prev) => prev.filter((i) => i.id !== id));
    try {
      localStorage.setItem(
        'hassi_bekay_invitations_list',
        JSON.stringify(invitations.filter((i) => i.id !== id))
      );
    } catch (e) {
      // ignore
    }

    // 2. Delete from Firestore
    try {
      await ensureAuthenticated();
      await deleteDoc(doc(db, INVITATIONS_COLLECTION, id));
    } catch (err) {
      console.error('Failed to delete invitation from Firestore:', err);
    }
  };

  return {
    invitations,
    setInvitations,
    saveInvitation,
    removeInvitation,
    loading,
    isCloudConnected,
  };
}

// Hook for Guestbook / Signatures & Volunteer registrations in Cloud
export function useCloudGuestbook() {
  const [messages, setMessages] = useState<GuestbookEntry[]>([]);
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      try {
        await ensureAuthenticated();
        const ref = collection(db, GUESTBOOK_COLLECTION);
        const q = query(ref, orderBy('createdAt', 'desc'));
        unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const list: GuestbookEntry[] = snapshot.docs.map((docSnap) => ({
              id: docSnap.id,
              ...(docSnap.data() as Omit<GuestbookEntry, 'id'>),
            }));
            setMessages(list);
            setIsCloudConnected(true);
          },
          (err) => {
            console.warn('Guestbook sync error:', err);
            setIsCloudConnected(false);
          }
        );
      } catch (err) {
        console.warn('Firebase init error:', err);
      }
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const addMessage = async (entry: Omit<GuestbookEntry, 'id' | 'createdAt'>) => {
    try {
      const user = await ensureAuthenticated();
      const newEntry = {
        ...entry,
        createdAt: new Date().toISOString(),
        userId: user ? user.uid : 'anonymous',
      };
      await addDoc(collection(db, GUESTBOOK_COLLECTION), newEntry);
      return true;
    } catch (err) {
      console.error('Failed to post guestbook entry:', err);
      return false;
    }
  };

  return { messages, addMessage, isCloudConnected };
}
