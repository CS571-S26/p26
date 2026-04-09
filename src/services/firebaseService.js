import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  writeBatch,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== USER PROFILE ====================

export const initializeUserProfile = async (userId, userData) => {};

export const getUserProfile = async (userId) => {};

// ==================== SUBJECTS ====================

export const addSubject = async (userId, subjectData) => {};

export const getSubjects = async (userId) => [];

export const updateSubject = async (userId, subjectId, updates) => {};

export const deleteSubject = async (userId, subjectId) => {};

// ==================== SESSIONS ====================

export const addSession = async (userId, subjectId, sessionData) => {};

export const getSessions = async (userId, subjectId) => [];

export const getAllSessions = async (userId) => [];

export const updateSession = async (userId, subjectId, sessionId, updates) => {};

export const deleteSession = async (userId, subjectId, sessionId, duration) => {};
