import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import StudentPortal from "./components/StudentPortal";
import PracticePortal from "./components/PracticePortal";
import InstallBanner from "./components/InstallBanner";
import { User, AuthResponse } from "./types";

export default function App() {
  
  const queryParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const portalStudentId = queryParams.get("portal_student");
  const practiceExamId = queryParams.get("practice_exam");
  const isParentLogin = queryParams.get("parent_login") === "true" ||
                        portalStudentId === "login" ||
                        portalStudentId === "parent" ||
                        portalStudentId === "guardian";
  const isAdminLogin = queryParams.get("admin_login") === "true" ||
                       queryParams.get("mode") === "admin" ||
                       queryParams.get("mode") === "staff";

  const isExplicitLoginReq = isParentLogin || isAdminLogin;

  if (portalStudentId && !isParentLogin && !isAdminLogin) {
    return (
      <>
        <StudentPortal studentId={portalStudentId} />
        <InstallBanner />
      </>
    );
  }

  if (practiceExamId) {
    return (
      <>
        <PracticePortal examId={practiceExamId} />
        <InstallBanner />
      </>
    );
  }

  const [token, setToken] = useState<string | null>(() => {
    if (isExplicitLoginReq) return null;
    return localStorage.getItem("plc_auth_token");
  });
  const [user, setUser] = useState<User | null>(() => {
    if (isExplicitLoginReq) return null;
    const savedUser = localStorage.getItem("plc_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [isInitializing, setIsInitializing] = useState(() => {
    if (isExplicitLoginReq) return false;
    const savedToken = localStorage.getItem("plc_auth_token");
    const isLangChanging = localStorage.getItem("plc_lang_changing") === "true";
    if (isLangChanging) {
      localStorage.removeItem("plc_lang_changing");
      return false;
    }
    return !!savedToken;
  });

  

    

  
  // Check for existing session on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("plc_theme");
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    if (document.getElementById('google-translate-script')) return;
    
    // Inject global CSS to perfectly hide all Google Translate UI
    const style = document.createElement('style');
    style.innerHTML = `
      html { top: 0px !important; margin-top: 0px !important; }
      body { top: 0px !important; position: static !important; margin-top: 0px !important; }
      .skiptranslate iframe.goog-te-banner-frame,
      iframe.goog-te-banner-frame, .goog-te-banner-frame,
      iframe[class*="goog-te-banner-frame"], iframe[id*="goog-te-banner-frame"],
      .goog-te-banner, .goog-te-balloon-frame {
        display: none !important; visibility: hidden !important; opacity: 0 !important;
        height: 0px !important; width: 0px !important;
      }
      .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; border: none !important; }
      #goog-gt-tt, .goog-te-balloon-frame, .goog-tooltip { display: none !important; }
      .goog-logo-link { display: none !important; }
      .goog-te-gadget { font-size: 0 !important; }
    `;
    document.head.appendChild(style);

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'km',
        includedLanguages: 'km,en',
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      }, 'google_translate_element');
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    if (isExplicitLoginReq) {
      setIsInitializing(false);
      return;
    }

    const savedToken = localStorage.getItem("plc_auth_token");
    if (!savedToken) {
      setIsInitializing(false);
      return;
    }

    if (savedToken === "demo_auth_token_bypass") {
      const savedUser = localStorage.getItem("plc_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        } catch (e) {
          localStorage.removeItem("plc_auth_token");
          localStorage.removeItem("plc_user");
        }
      }
      setIsInitializing(false);
      return;
    }

    // Verify token against backend
    fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${savedToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Session expired");
        }
        return res.json();
      })
      .then((data) => {
        setToken(savedToken);
        const resolvedUser = data?.user || (data?.id ? data : null);
        if (resolvedUser) {
          setUser(resolvedUser);
          localStorage.setItem("plc_user", JSON.stringify(resolvedUser));
        }
      })
      .catch((err) => {
        console.info("Auto-auth session check:", err.message || err);
        localStorage.removeItem("plc_auth_token");
        localStorage.removeItem("plc_user");
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsInitializing(false);
      });
  }, []);

  const handleLoginSuccess = (authData: AuthResponse) => {
    localStorage.setItem("plc_auth_token", authData.token);
    localStorage.setItem("plc_user", JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
    if (typeof window !== "undefined") {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("plc_auth_token");
    localStorage.removeItem("plc_user");
    setToken(null);
    setUser(null);
  };

  // 1. Initializing State: Gorgeous loading splash screen
  if (isInitializing) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 font-sans">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center shadow-md text-white font-bold text-3xl font-sans mb-4"
        >
          P
        </motion.div>
        <div className="flex items-center gap-2 text-primary-600 font-bold text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>
            {(() => {
              const lang = localStorage.getItem("plc_lang") || "kh";
              if (lang === "en") return "Initializing system data...";
              if (lang === "zh") return "正在加载系统数据...";
              return "កំពុងសរសេរទិន្នន័យប្រព័ន្ធ...";
            })()}
          </span>
        </div>
      </div>
    );
  }

  // 2. Authenticated or Guest screen with beautiful animated route transition
  return (
    <div className="h-full w-full app-background overflow-hidden flex flex-col">
      
      <div id="google_translate_hidden_container" className="absolute -top-[10000px] -left-[10000px] invisible opacity-0"><div id="google_translate_element"></div></div>
      <AnimatePresence mode="wait">
        {!user || !token ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full h-full overflow-y-auto"
          >
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full h-full overflow-hidden flex flex-col"
          >
            <Dashboard user={user} token={token} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>
      <InstallBanner />
    </div>
  );
}
