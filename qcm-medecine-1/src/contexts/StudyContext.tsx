import React, { createContext, useContext, useState, useEffect } from 'react';

interface Course {
  id: string;
  name: string;
  subject: string;
  content: string;
  summary: string;
  qcm: Question[];
  flashcards: Flashcard[];
  createdAt: Date;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface StudySession {
  id: string;
  courseId: string;
  type: 'qcm' | 'flashcard';
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: Date;
}

interface StudyContextType {
  courses: Course[];
  studySessions: StudySession[];
  addCourse: (course: Omit<Course, 'id' | 'createdAt'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addStudySession: (session: Omit<StudySession, 'id' | 'completedAt'>) => void;
  getCourseById: (id: string) => Course | undefined;
  getCoursesBySubject: (subject: string) => Course[];
  getStudyStats: () => {
    totalCourses: number;
    totalSessions: number;
    averageScore: number;
    totalTimeSpent: number;
  };
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Charger les données depuis localStorage
      const savedCourses = localStorage.getItem('courses');
      const savedSessions = localStorage.getItem('studySessions');
      
      if (savedCourses) {
        setCourses(JSON.parse(savedCourses));
      }
      
      if (savedSessions) {
        setStudySessions(JSON.parse(savedSessions));
      }
    }
  }, []);

  useEffect(() => {
    // Sauvegarder les cours dans localStorage
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    // Sauvegarder les sessions dans localStorage
    localStorage.setItem('studySessions', JSON.stringify(studySessions));
  }, [studySessions]);

  const addCourse = (courseData: Omit<Course, 'id' | 'createdAt'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, ...updates } : course
    ));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
    // Supprimer aussi les sessions associées
    setStudySessions(prev => prev.filter(session => session.courseId !== id));
  };

  const addStudySession = (sessionData: Omit<StudySession, 'id' | 'completedAt'>) => {
    const newSession: StudySession = {
      ...sessionData,
      id: Date.now().toString(),
      completedAt: new Date()
    };
    setStudySessions(prev => [...prev, newSession]);
  };

  const getCourseById = (id: string) => {
    return courses.find(course => course.id === id);
  };

  const getCoursesBySubject = (subject: string) => {
    return courses.filter(course => course.subject === subject);
  };

  const getStudyStats = () => {
    const totalCourses = courses.length;
    const totalSessions = studySessions.length;
    const averageScore = studySessions.length > 0 
      ? studySessions.reduce((sum, session) => sum + session.score, 0) / studySessions.length
      : 0;
    const totalTimeSpent = studySessions.reduce((sum, session) => sum + session.timeSpent, 0);

    return {
      totalCourses,
      totalSessions,
      averageScore,
      totalTimeSpent
    };
  };

  return (
    <StudyContext.Provider value={{
      courses,
      studySessions,
      addCourse,
      updateCourse,
      deleteCourse,
      addStudySession,
      getCourseById,
      getCoursesBySubject,
      getStudyStats
    }}>
      {children}
    </StudyContext.Provider>
  );
};