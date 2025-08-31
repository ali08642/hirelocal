import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ChatMessage, ChatSession } from '../types/firebase';

export const ChatService = {
  async createSession(userId: string, title: string): Promise<string> {
    try {
      const session = {
        userId,
        title,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: []
      };

      const docRef = await addDoc(collection(db, 'chatSessions'), session);
      return docRef.id;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  },

  async getSession(sessionId: string): Promise<ChatSession | null> {
    try {
      const docRef = doc(db, 'chatSessions', sessionId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ChatSession;
      }
      return null;
    } catch (error) {
      console.error('Error fetching chat session:', error);
      throw error;
    }
  },

  async getUserSessions(userId: string): Promise<ChatSession[]> {
    try {
      const q = query(
        collection(db, 'chatSessions'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const sessions: ChatSession[] = [];
      
      querySnapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() } as ChatSession);
      });

      return sessions;
    } catch (error) {
      console.error('Error fetching user chat sessions:', error);
      throw error;
    }
  },

  async addMessage(sessionId: string, message: Omit<ChatMessage, 'id'>): Promise<string> {
    try {
      const sessionRef = doc(db, 'chatSessions', sessionId);
      const session = await getDoc(sessionRef);
      
      if (!session.exists()) {
        throw new Error('Chat session not found');
      }

      const messageWithId = {
        ...message,
        id: crypto.randomUUID()
      };

      await updateDoc(sessionRef, {
        messages: [...session.data().messages, messageWithId],
        lastMessage: message.content,
        updatedAt: new Date()
      });

      return messageWithId.id;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  async getRecentMessages(sessionId: string, limit: number = 50): Promise<ChatMessage[]> {
    try {
      const sessionRef = doc(db, 'chatSessions', sessionId);
      const session = await getDoc(sessionRef);
      
      if (!session.exists()) {
        return [];
      }

      const messages = session.data().messages || [];
      return messages.slice(-limit);
    } catch (error) {
      console.error('Error fetching recent messages:', error);
      throw error;
    }
  }
};
