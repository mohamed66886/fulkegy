import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, storage, auth } from '@/lib/firebase/config';
import type {
  Project,
  Client,
  Employee,
  Message,
  BlogPost,
  NewsletterSubscriber,
} from '@/types';

function requireAuth() {
  if (!auth) {
    throw new Error('Firebase auth is not configured');
  }

  return auth;
}

function requireDb() {
  if (!db) {
    throw new Error('Firebase database is not configured');
  }

  return db;
}

function requireStorage() {
  if (!storage) {
    throw new Error('Firebase storage is not configured');
  }

  return storage;
}

// Auth
export async function loginAdmin(email: string, password: string) {
  return signInWithEmailAndPassword(requireAuth(), email, password);
}

export async function logoutAdmin() {
  return signOut(requireAuth());
}

// Upload Image
export async function uploadImage(
  file: File,
  path: string
): Promise<string> {
  const storageRef = ref(requireStorage(), `${path}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function deleteImage(url: string) {
  try {
    if (!storage) {
      return;
    }

    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // Image may not exist
  }
}

// Projects
export async function getProjects(): Promise<Project[]> {
  if (!db) {
    return [];
  }

  const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Project)
  );
}

export async function getProject(id: string): Promise<Project | null> {
  if (!db) {
    return null;
  }

  const docRef = doc(db, 'projects', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Project;
}

export async function addProject(
  data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
) {
  return addDoc(collection(requireDb(), 'projects'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function updateProject(
  id: string,
  data: Partial<Project>
) {
  const docRef = doc(requireDb(), 'projects', id);
  return updateDoc(docRef, { ...data, updatedAt: Timestamp.now() });
}

export async function deleteProject(id: string) {
  return deleteDoc(doc(requireDb(), 'projects', id));
}

// Clients
export async function getClients(): Promise<Client[]> {
  if (!db) {
    return [];
  }

  const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Client)
  );
}

export async function addClient(
  data: Omit<Client, 'id' | 'createdAt'>
) {
  return addDoc(collection(requireDb(), 'clients'), {
    ...data,
    createdAt: Timestamp.now(),
  });
}

export async function updateClient(id: string, data: Partial<Client>) {
  return updateDoc(doc(requireDb(), 'clients', id), data);
}

export async function deleteClient(id: string) {
  return deleteDoc(doc(requireDb(), 'clients', id));
}

// Employees
export async function getEmployees(): Promise<Employee[]> {
  if (!db) {
    return [];
  }

  const q = query(collection(db, 'employees'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Employee)
  );
}

export async function addEmployee(
  data: Omit<Employee, 'id' | 'createdAt'>
) {
  return addDoc(collection(requireDb(), 'employees'), {
    ...data,
    createdAt: Timestamp.now(),
  });
}

export async function updateEmployee(id: string, data: Partial<Employee>) {
  return updateDoc(doc(requireDb(), 'employees', id), data);
}

export async function deleteEmployee(id: string) {
  return deleteDoc(doc(requireDb(), 'employees', id));
}

// Messages
export async function getMessages(): Promise<Message[]> {
  if (!db) {
    return [];
  }

  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Message)
  );
}

export async function getUnreadMessages(): Promise<Message[]> {
  if (!db) {
    return [];
  }

  const q = query(
    collection(db, 'messages'),
    where('read', '==', false),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Message)
  );
}

export async function sendMessage(
  data: Omit<Message, 'id' | 'read' | 'archived' | 'createdAt'>
) {
  return addDoc(collection(requireDb(), 'messages'), {
    ...data,
    read: false,
    archived: false,
    createdAt: Timestamp.now(),
  });
}

export async function markMessageRead(id: string) {
  return updateDoc(doc(requireDb(), 'messages', id), { read: true });
}

export async function archiveMessage(id: string) {
  return updateDoc(doc(requireDb(), 'messages', id), { archived: true });
}

export async function replyToMessage(id: string, reply: string) {
  return updateDoc(doc(requireDb(), 'messages', id), { reply, read: true });
}

export async function deleteMessage(id: string) {
  return deleteDoc(doc(requireDb(), 'messages', id));
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!db) {
    return [];
  }

  const q = query(collection(db, 'blog_posts'), orderBy('publishDate', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as BlogPost)
  );
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  if (!db) {
    return [];
  }

  const q = query(
    collection(db, 'blog_posts'),
    where('published', '==', true),
    orderBy('publishDate', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as BlogPost)
  );
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  if (!db) {
    return null;
  }

  const q = query(collection(db, 'blog_posts'), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as BlogPost;
}

export async function addBlogPost(
  data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>
) {
  return addDoc(collection(requireDb(), 'blog_posts'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function updateBlogPost(id: string, data: Partial<BlogPost>) {
  return updateDoc(doc(requireDb(), 'blog_posts', id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteBlogPost(id: string) {
  return deleteDoc(doc(requireDb(), 'blog_posts', id));
}

// Newsletter
export async function subscribeNewsletter(email: string) {
  return addDoc(collection(requireDb(), 'newsletter'), {
    email,
    subscribedAt: Timestamp.now(),
  });
}

export async function getNewsletterSubscribers(): Promise<
  NewsletterSubscriber[]
> {
  if (!db) {
    return [];
  }

  const snapshot = await getDocs(collection(db, 'newsletter'));
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as NewsletterSubscriber)
  );
}

// Dashboard Stats
export async function getDashboardStats() {
  if (!db) {
    return {
      totalProjects: 0,
      totalClients: 0,
      totalMessages: 0,
      totalEmployees: 0,
    };
  }

  const [projects, clients, messages, employees] = await Promise.all([
    getDocs(collection(db, 'projects')),
    getDocs(collection(db, 'clients')),
    getDocs(collection(db, 'messages')),
    getDocs(collection(db, 'employees')),
  ]);

  return {
    totalProjects: projects.size,
    totalClients: clients.size,
    totalMessages: messages.size,
    totalEmployees: employees.size,
  };
}
