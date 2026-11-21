import VoiceAssistant from "./VoiceAssistant.jsx";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { auth, googleProvider } from "./firebase.js";

import {
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "firebase/auth";

import laptopImage from "../assets/laptop-selected.png";
import phoneImage from "../assets/phone-selected.png";
import routerImage from "../assets/router-selected.png";
import technicianImage from "../assets/fundi-technician.png";

const API_BASE = "";
const HISTORY_KEY = "fundi-ai-history-v1";
const MAX_HISTORY = 10;
const BOOKINGS_KEY = "fundi-ai-bookings-v1";

const copy = {
  en: {
    tagline: "Smart device diagnosis, made simple",
    home: "Home",
    diagnosis: "Diagnosis",
    result: "Result",
    shops: "Repair shops",
    history: "History",
    premium: "Premium",
    welcome: "Let's get your device working again.",
    intro: "Describe what is happening and Fundi AI will help identify possible causes and next steps.",
    choose: "Choose your device",
    phone: "Phone",
    laptop: "Laptop",
    router: "Router",
    symptoms: "Describe the problem",
    placeholder: "Example: My phone gets hot, battery drains quickly, and it switches off unexpectedly…",
    diagnose: "Diagnose my device",
    listening: "Listening… speak now",
    voice: "Use voice input",
    required: "Choose a device and describe the problem first.",
    diagnosing: "Analysing your symptoms…",
    resultTitle: "Diagnosis results",
    noResult: "Your diagnosis will appear here after you submit a problem.",
    confidence: "Confidence",
    risk: "Risk level",
    fix: "Suggested steps",
    cost: "Estimated repair cost",
    shopsTitle: "Nearby repair support",
    shopsIntro: "Repair shop information is supplied by your backend.",
    refresh: "Refresh shops",
    noShops: "No repair shops are available yet.",
    historyTitle: "Recent diagnoses",
    clear: "Clear history",
    noHistory: "No saved diagnoses yet.",
    print: "Print / Save as PDF",
    book: "Contact shop",
    built: "Built with Huawei Cloud",
    error: "Something went wrong. Please try again.",
    apiError: "Could not reach the backend. Check that the API server is running.",
    unknown: "Not provided",
    high: "High",
    medium: "Medium",
    low: "Low",
    back: "Back to diagnosis",
    google: "Continue with Google",
    signOut: "Sign out",
    signingIn: "Signing in…",
    freePlan: "Free plan",
    premiumPlan: "Fundi AI Premium",
    freePrice: "KSh 0",
    premiumPrice: "KSh 499 / month",
    freeDescription: "Get started with essential device support.",
    premiumDescription: "More guidance and convenience for frequent repairs.",
    choosePlan: "Select plan",
    selectedPlan: "Selected plan",
    planNote: "Plan selection is a frontend preview. Payments and subscriptions are not connected.",
    included: "What's included",
    freeFeature1: "Basic device diagnosis",
    freeFeature2: "Suggested repair steps",
    freeFeature3: "Recent diagnosis history",
    premiumFeature1: "Everything in Free",
    premiumFeature2: "More detailed repair guidance",
    premiumFeature3: "Priority access to support (when available)",
    premiumFeature4: "Organised repair history",
    checklistProgress: "Repair steps completed"
  },
  sw: {
    tagline: "Utambuzi wa vifaa kwa urahisi",
    home: "Mwanzo",
    diagnosis: "Utambuzi",
    result: "Matokeo",
    shops: "Fundi wa karibu",
    history: "Historia",
    premium: "Premium",
    welcome: "Turekebishe kifaa chako.",
    intro: "Eleza tatizo linalotokea ili Fundi AI ikusaidie kutambua chanzo na hatua zinazofuata.",
    choose: "Chagua kifaa",
    phone: "Simu",
    laptop: "Kompyuta",
    router: "Ruta",
    symptoms: "Eleza tatizo",
    placeholder: "Mfano: Simu yangu inapata joto, chaji inaisha haraka na inajizima ghafla…",
    diagnose: "Tambua tatizo",
    listening: "Inasikiliza… ongea sasa",
    voice: "Tumia sauti",
    required: "Chagua kifaa na ueleze tatizo kwanza.",
    diagnosing: "Inachambua maelezo yako…",
    resultTitle: "Matokeo ya utambuzi",
    noResult: "Matokeo yataonekana hapa baada ya kutuma tatizo.",
    confidence: "Uhakika",
    risk: "Kiwango cha hatari",
    fix: "Hatua zinazopendekezwa",
    cost: "Makadirio ya gharama",
    shopsTitle: "Mafundi wa karibu",
    shopsIntro: "Taarifa za mafundi hutolewa na backend yako.",
    refresh: "Pakia mafundi tena",
    noShops: "Hakuna taarifa za mafundi kwa sasa.",
    historyTitle: "Utambuzi wa hivi karibuni",
    clear: "Futa historia",
    noHistory: "Bado hakuna historia.",
    print: "Chapisha / Hifadhi PDF",
    book: "Wasiliana na fundi",
    built: "Imetengenezwa kwa Huawei Cloud",
    error: "Hitilafu imetokea. Tafadhali jaribu tena.",
    apiError: "Imeshindikana kuwasiliana na backend. Hakikisha seva ya API inafanya kazi.",
    unknown: "Haijatolewa",
    high: "Juu",
    medium: "Wastani",
    low: "Chini",
    back: "Rudi kwenye utambuzi",
    google: "Ingia kwa Google",
    signOut: "Toka",
    signingIn: "Inaingia…",
    freePlan: "Mpango wa Bure",
    premiumPlan: "Fundi AI Premium",
    freePrice: "KSh 0",
    premiumPrice: "KSh 499 / mwezi",
    freeDescription: "Anza na msaada muhimu wa vifaa.",
    premiumDescription: "Mwongozo zaidi kwa wanaohitaji huduma mara kwa mara.",
    choosePlan: "Chagua mpango",
    selectedPlan: "Mpango uliochaguliwa",
    planNote: "Uchaguzi wa mpango ni mwonekano wa frontend pekee. Malipo hayajaunganishwa.",
    included: "Vilivyojumuishwa",
    freeFeature1: "Utambuzi wa msingi wa kifaa",
    freeFeature2: "Hatua za kurekebisha",
    freeFeature3: "Historia ya hivi karibuni",
    premiumFeature1: "Kila kitu kwenye mpango wa Bure",
    premiumFeature2: "Mwongozo wa kina wa marekebisho",
    premiumFeature3: "Kipaumbele cha msaada (kitakapopatikana)",
    premiumFeature4: "Historia ya marekebisho iliyopangwa",
    checklistProgress: "Hatua za marekebisho zilizokamilishwa"
  }
};

function readHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : [];
  } catch {
    return [];
  }
}

function readBookings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function asText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  return fallback;
}

function normalizeDiagnosis(payload) {
  const list = Array.isArray(payload)
      ? payload
      : payload?.faults ||
      payload?.top_faults ||
      payload?.results ||
      payload?.diagnosis ||
      (payload && (payload.fault || payload.name || payload.title)
          ? [payload]
          : []);

  return list.slice(0, 5).map((item, index) => {
    const rawConfidence = Number(
        item.confidence ?? item.confidence_score ?? item.match_score
    );

    const confidence = Number.isFinite(rawConfidence)
        ? Math.round(Math.max(0, Math.min(100, rawConfidence <= 1 ? rawConfidence * 100 : rawConfidence)))
        : null;

    const rawSteps = item.steps || item.fix_steps || item.recommendations || [];

    const rawRisk = asText(
        item.risk || item.severity || item.risk_level,
        "unknown"
    ).toLowerCase();
    const riskMap = { red: "high", yellow: "medium", green: "low" };
    const risk = riskMap[rawRisk] || rawRisk;

    let cost = asText(item.cost || item.cost_estimate);
    if (!cost && item.estimated_cost) {
      if (typeof item.estimated_cost === "object" && item.estimated_cost !== null) {
        const min = item.estimated_cost.min;
        const max = item.estimated_cost.max;
        cost = min != null && max != null ? `${min} - ${max}` : "";
      } else {
        cost = asText(item.estimated_cost);
      }
    }

    return {
      id: `${Date.now()}-${index}`,
      title: asText(item.title || item.fault || item.name || item.issue, `Possible issue ${index + 1}`),
      description: asText(item.description || item.explanation),
      confidence,
      risk,
      steps: Array.isArray(rawSteps)
          ? rawSteps.map(x => asText(x)).filter(Boolean)
          : [],
      cost,
      currency: asText(item.currency, "KES")
    };
  });
}

function normalizeShops(payload) {
  const rows = Array.isArray(payload) ? payload : payload?.shops || payload?.results || [];
  return Array.isArray(rows) ? rows : [];
}

function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:", "tel:", "mailto:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function formatKsh(value, currency = "KES") {
  if (value === null || value === undefined || value === "") return "";
  const raw = String(value).trim();

  if (/KSh|KES/i.test(raw)) return raw.replace(/KES/ig, "KSh");

  const numeric = Number(raw.replace(/[,\s]/g, ""));
  if (Number.isFinite(numeric)) {
    return `KSh ${new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(numeric)}`;
  }

  return `${raw} ${currency === "KES" ? "KSh" : currency}`;
}

function RiskPill({ risk, t }) {
  const normRisk = { red: "high", yellow: "medium", green: "low" }[risk] || risk;
  const key = ["high", "medium", "low"].includes(normRisk)
      ? normRisk
      : "unknown";

  return (
      <span className={`risk-pill risk-${key}`}>
      {key === "unknown" ? t.unknown : t[key]}
    </span>
  );
}

export default function App() {
  const [language, setLanguage] = useState("en");
  const [device, setDevice] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [page, setPage] = useState("home");
  const [diagnoses, setDiagnoses] = useState([]);
  const [shops, setShops] = useState([]);
  const [history, setHistory] = useState(readHistory);
  const [bookings, setBookings] = useState(readBookings);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [selectedPlan, setSelectedPlan] = useState("free");

  const [loading, setLoading] = useState(false);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const recognitionRef = useRef(null);
  const [bookingMode, setBookingMode] = useState("home");
  const [bookingDevice, setBookingDevice] = useState("phone");
  const [bookingIssue, setBookingIssue] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingPlace, setBookingPlace] = useState("");
  const [bookingNote, setBookingNote] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  const t = copy[language];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
        auth,
        currentUser => {
          setUser(currentUser);
          setAuthLoading(false);
        },
        authListenerError => {
          console.error("Authentication listener error:", authListenerError);
          setAuthError("Could not check your login status.");
          setAuthLoading(false);
        }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    } catch {
      // Browser storage may be unavailable.
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
    } catch {
      // Browser storage may be unavailable.
    }
  }, [history]);

  const selectedDeviceLabel = useMemo(() => {
    const map = { phone: t.phone, laptop: t.laptop, router: t.router };
    return map[device] || device;
  }, [device, t]);

  async function handleGoogleSignIn() {
    setAuthError("");
    setSigningIn(true);

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Google sign-in error:", err);

      if (err.code === "auth/popup-closed-by-user") {
        setAuthError("Google sign-in was cancelled.");
      } else if (err.code === "auth/popup-blocked") {
        setAuthError("Your browser blocked the sign-in popup. Allow popups and try again.");
      } else {
        setAuthError(err.message || "Google sign-in failed. Please try again.");
      }
    } finally {
      setSigningIn(false);
    }
  }

  async function handleSignOut() {
    setAuthError("");

    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign-out error:", err);
      setAuthError(err.message || "Could not sign out. Please try again.");
    }
  }

  async function diagnose(event) {
    event?.preventDefault();
    setError("");

    if (!device || !symptoms.trim()) {
      setError(t.required);
      setPage("diagnosis");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/diagnose`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ device, symptom: symptoms.trim(), language })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      const parsed = normalizeDiagnosis(data);

      if (!parsed.length) throw new Error("The API returned no diagnosis results.");

      setDiagnoses(parsed);
      setHistory(prev => [
        {
          id: `${Date.now()}`,
          date: new Date().toISOString(),
          device,
          symptom: symptoms.trim(),
          results: parsed
        },
        ...prev
      ].slice(0, MAX_HISTORY));

      setPage("result");
    } catch (err) {
      console.error("Diagnosis request failed:", err);
      setError(err instanceof TypeError ? t.apiError : err.message || t.error);
    } finally {
      setLoading(false);
    }
  }

  async function loadShops() {
    setShopsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/shops`, {
        headers: { Accept: "application/json" }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setShops(normalizeShops(await response.json()));
    } catch (err) {
      console.error("Shop request failed:", err);
      setError(err instanceof TypeError ? t.apiError : err.message || t.error);
    } finally {
      setShopsLoading(false);
    }
  }

  useEffect(() => {
    if (page === "shops" && shops.length === 0) loadShops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function startVoiceInput() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceMessage("Voice input is not supported in this browser.");
      return;
    }

    if (recognitionRef.current) recognitionRef.current.stop();

    const recognition = new SpeechRecognition();
    recognition.lang = language === "sw" ? "sw-KE" : "en-KE";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setVoiceMessage(t.listening);

    recognition.onresult = event => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setSymptoms(prev => `${prev}${prev ? " " : ""}${transcript}`.trim());
      setVoiceMessage("");
    };

    recognition.onerror = () => setVoiceMessage("Voice input could not be completed.");
    recognition.onend = () => {
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  function createBooking(event) {
    event.preventDefault();
    setBookingMessage("");

    if (!bookingIssue.trim() || !bookingDate || !bookingTime ||
        !bookingName.trim() || !bookingPhone.trim() || !bookingPlace.trim()) {
      setBookingMessage("Please complete all required booking details.");
      return;
    }

    const booking = {
      id: `FA-${Date.now().toString().slice(-8)}`,
      mode: bookingMode,
      device: bookingDevice,
      issue: bookingIssue.trim(),
      date: bookingDate,
      time: bookingTime,
      customerName: bookingName.trim(),
      phone: bookingPhone.trim(),
      place: bookingPlace.trim(),
      note: bookingNote.trim(),
      status: "Pending",
      createdAt: new Date().toISOString(),
      customerEmail: user?.email || ""
    };

    setBookings(previous => [booking, ...previous]);
    setBookingIssue("");
    setBookingDate("");
    setBookingTime("");
    setBookingNote("");
    setBookingMessage(`Booking created successfully. Reference: ${booking.id}`);
    setPage("bookings");
  }

  function cancelBooking(bookingId) {
    setBookings(previous => previous.map(booking =>
        booking.id === bookingId && booking.status === "Pending"
            ? { ...booking, status: "Cancelled" }
            : booking
    ));
  }

  function openHistoryItem(item) {
    setDevice(item.device);
    setSymptoms(item.symptom);
    setDiagnoses(item.results || []);
    setPage("result");
  }

  function renderDiagnosisCards(items) {
    if (!items?.length) return <p className="muted">{t.noResult}</p>;

    return items.map((item, index) => (
        <article className="result-card" key={item.id || `${item.title}-${index}`}>
          <div className="result-heading">
            <h3>{item.title}</h3>
            <RiskPill risk={item.risk} t={t} />
          </div>

          {item.description && <p>{item.description}</p>}

          <div className="metric-row">
            <span>{t.confidence}</span>
            <strong>{item.confidence === null ? t.unknown : `${item.confidence}%`}</strong>
          </div>

          {item.confidence !== null && (
              <div className="meter">
                <span style={{ width: `${item.confidence}%` }} />
              </div>
          )}

          {item.steps.length > 0 && (
              <>
                <h4>{t.fix}</h4>
                <div className="repair-checklist">
                  <p className="checklist-progress">
                    {t.checklistProgress}:{" "}
                    {item.steps.filter((_, i) => checkedSteps[`${item.id || item.title}-${i}`]).length}/{item.steps.length}
                  </p>

                  {item.steps.map((step, i) => {
                    const stepId = `${item.id || item.title}-${i}`;

                    return (
                        <label className="repair-step" key={stepId}>
                          <input
                              type="checkbox"
                              checked={Boolean(checkedSteps[stepId])}
                              onChange={event => setCheckedSteps(previous => ({
                                ...previous,
                                [stepId]: event.target.checked
                              }))}
                          />
                          <span className={checkedSteps[stepId] ? "step-done" : ""}>{step}</span>
                        </label>
                    );
                  })}
                </div>
              </>
          )}

          {item.cost && (
              <p className="cost">
                <strong>{t.cost}:</strong> {formatKsh(item.cost, item.currency)}
              </p>
          )}
        </article>
    ));
  }

  return (
      <div className="app-shell">
        <header className="topbar">
          <button className="brand" onClick={() => setPage("home")} aria-label="Fundi AI home">
            <span className="brand-mark">F</span>
            <span>
            <strong>Fundi AI</strong>
            <small>{t.tagline}</small>
          </span>
          </button>

          <div className="header-actions">
            <button
                className="language-toggle"
                onClick={() => setLanguage(language === "en" ? "sw" : "en")}
                aria-label="Change language"
            >
              {language === "en" ? "Kiswahili" : "English"}
            </button>

            {authLoading ? (
                <span className="auth-loading">Loading...</span>
            ) : user ? (
                <div className="user-profile">
                  {user.photoURL && (
                      <img
                          src={user.photoURL}
                          alt="Google profile"
                          className="profile-image"
                          referrerPolicy="no-referrer"
                      />
                  )}
                  <span className="user-name">{user.displayName || user.email}</span>
                  <button className="secondary-button" onClick={handleSignOut}>{t.signOut}</button>
                </div>
            ) : (
                <button className="google-button" onClick={handleGoogleSignIn} disabled={signingIn}>
                  {signingIn ? t.signingIn : t.google}
                </button>
            )}
          </div>
        </header>

        <nav className="nav-tabs" aria-label="Main navigation">
          {[
            ["home", t.home],
            ["diagnosis", t.diagnosis],
            ["result", t.result],
            ["shops", t.shops],
            ["book", "Book a repair"],
            ["bookings", "My bookings"],
            ["history", t.history],
            ["premium", t.premium]
          ].map(([id, label]) => (
              <button
                  key={id}
                  className={page === id ? "nav-tab active" : "nav-tab"}
                  onClick={() => setPage(id)}
              >
                {label}
              </button>
          ))}
        </nav>

        <main className={`page-content page-${page}`} key={page}>
          {error && <div className="alert" role="alert">{error}</div>}
          {authError && <div className="alert" role="alert">{authError}</div>}

          {page === "home" && (
              <section className="hero panel">
                <span className="eyebrow">FUNDI AI</span>
                <h1>{t.welcome}</h1>
                <p>{t.intro}</p>

                <div className="hero-actions">
                  <button className="primary-button" onClick={() => setPage("diagnosis")}>
                    {t.diagnose}
                  </button>
                  <span className="hero-note">Your friendly device-care assistant</span>
                </div>

                <div className="hero-technician">
                  <img
                      src={technicianImage}
                      alt="Fundi AI repair technician standing with a screwdriver"
                  />
                  <div className="technician-caption">
                    <span className="caption-dot" />
                    <span>
                  <strong>Your repair partner</strong>
                  <small>Smart help, one step at a time</small>
                </span>
                  </div>
                </div>
              </section>
          )}

          {page === "diagnosis" && (
              <section className="panel">
                <h1>{t.diagnosis}</h1>

                <form onSubmit={diagnose}>
                  <fieldset>
                    <legend>{t.choose}</legend>

                    <div className="device-grid">
                      {[
                        ["phone", phoneImage, t.phone],
                        ["laptop", laptopImage, t.laptop],
                        ["router", routerImage, t.router]
                      ].map(([id, image, label]) => (
                          <button
                              type="button"
                              key={id}
                              className={`device-option ${device === id ? "selected" : ""}`}
                              onClick={() => setDevice(id)}
                              aria-pressed={device === id}
                          >
                            <img src={image} alt={label} className="device-option-image" />
                            <strong>{label}</strong>
                          </button>
                      ))}
                    </div>
                  </fieldset>

                  <label className="field-label" htmlFor="symptoms">{t.symptoms}</label>
                  <textarea
                      id="symptoms"
                      rows="5"
                      value={symptoms}
                      onChange={e => setSymptoms(e.target.value)}
                      placeholder={t.placeholder}
                      maxLength={2000}
                  />

                  <div className="form-meta">
                    <button className="secondary-button" type="button" onClick={startVoiceInput}>
                      {t.voice}
                    </button>
                    <span className="muted">{symptoms.length}/2000</span>
                  </div>

                  {voiceMessage && (
                      <p className="voice-status" aria-live="polite">{voiceMessage}</p>
                  )}

                  <button className="primary-button full-width" type="submit" disabled={loading}>
                    {loading ? t.diagnosing : t.diagnose}
                  </button>
                </form>
              </section>
          )}

          {page === "result" && (
              <section className="panel" id="print-report">
                <div className="section-heading">
                  <div>
                    <h1>{t.resultTitle}</h1>
                    <p className="muted">{selectedDeviceLabel} · {symptoms}</p>
                  </div>
                  <button className="secondary-button no-print" onClick={() => window.print()}>
                    {t.print}
                  </button>
                </div>

                {renderDiagnosisCards(diagnoses)}

                <button className="secondary-button no-print" onClick={() => setPage("diagnosis")}>
                  {t.back}
                </button>
              </section>
          )}

          {page === "shops" && (
              <section className="panel">
                <div className="section-heading">
                  <div>
                    <h1>{t.shopsTitle}</h1>
                    <p className="muted">{t.shopsIntro}</p>
                  </div>
                  <button className="secondary-button" onClick={loadShops} disabled={shopsLoading}>
                    {shopsLoading ? "…" : t.refresh}
                  </button>
                </div>

                {shops.length === 0 && !shopsLoading ? (
                    <p className="muted">{t.noShops}</p>
                ) : (
                    <div className="shop-list">
                      {shops.map((shop, index) => {
                        const name = asText(shop.name || shop.shop_name, `Repair shop ${index + 1}`);
                        const link = safeExternalUrl(asText(shop.booking_url || shop.phone_url || shop.website));

                        return (
                            <article className="shop-card" key={shop.id || `${name}-${index}`}>
                              <div>
                                <h3>{name}</h3>
                                <p>{asText(shop.address || shop.location)}</p>
                                <p className="shop-meta">
                                  {shop.rating != null ? `★ ${asText(shop.rating)}` : ""}
                                  {shop.price_range ? ` · ${asText(shop.price_range)}` : ""}
                                </p>
                              </div>

                              {link && (
                                  <a
                                      className="secondary-button link-button"
                                      href={link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                  >
                                    {t.book}
                                  </a>
                              )}
                            </article>
                        );
                      })}
                    </div>
                )}
              </section>
          )}

          {page === "book" && (
              <section className="panel booking-panel">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">REPAIR APPOINTMENT</span>
                    <h1>Book a repair</h1>
                    <p className="muted">Choose a home visit or book an appointment at a repair shop.</p>
                  </div>
                </div>

                {bookingMessage && <div className="alert booking-feedback" role="status">{bookingMessage}</div>}

                <form className="booking-form" onSubmit={createBooking}>
                  <fieldset>
                    <legend>Where would you like the repair?</legend>
                    <div className="booking-mode-grid">
                      <button
                          type="button"
                          className={`booking-mode-card ${bookingMode === "home" ? "selected" : ""}`}
                          onClick={() => { setBookingMode("home"); setBookingPlace(""); }}
                          aria-pressed={bookingMode === "home"}
                      >
                        <span className="booking-mode-icon">⌂</span>
                        <strong>Home service</strong>
                        <small>A technician visits your location</small>
                      </button>

                      <button
                          type="button"
                          className={`booking-mode-card ${bookingMode === "shop" ? "selected" : ""}`}
                          onClick={() => { setBookingMode("shop"); setBookingPlace(""); }}
                          aria-pressed={bookingMode === "shop"}
                      >
                        <span className="booking-mode-icon">⌖</span>
                        <strong>Visit a repair shop</strong>
                        <small>You take your device to the shop</small>
                      </button>
                    </div>
                  </fieldset>

                  <div className="booking-fields">
                    <label className="field-label">Device
                      <select value={bookingDevice} onChange={e => setBookingDevice(e.target.value)} required>
                        <option value="phone">Phone</option>
                        <option value="laptop">Laptop</option>
                        <option value="router">Router</option>
                        <option value="other">Other device</option>
                      </select>
                    </label>

                    <label className="field-label">Describe the problem
                      <textarea
                          rows="3"
                          value={bookingIssue}
                          onChange={e => setBookingIssue(e.target.value)}
                          placeholder="Tell the technician what needs repair..."
                          maxLength={1500}
                          required
                      />
                    </label>

                    <label className="field-label">Preferred date
                      <input
                          type="date"
                          value={bookingDate}
                          min={new Date().toISOString().slice(0, 10)}
                          onChange={e => setBookingDate(e.target.value)}
                          required
                      />
                    </label>

                    <label className="field-label">Preferred time
                      <input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)} required />
                    </label>

                    <label className="field-label">Your full name
                      <input type="text" value={bookingName} onChange={e => setBookingName(e.target.value)} placeholder="Name" autoComplete="name" required />
                    </label>

                    <label className="field-label">Phone number
                      <input type="tel" value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} placeholder="+254 7XX XXX XXX" autoComplete="tel" required />
                    </label>

                    <label className="field-label booking-place-field">
                      {bookingMode === "home" ? "Home / service address" : "Repair shop name or address"}
                      <input
                          type="text"
                          value={bookingPlace}
                          onChange={e => setBookingPlace(e.target.value)}
                          placeholder={bookingMode === "home" ? "Estate, building, street and area" : "Enter your preferred repair shop"}
                          autoComplete={bookingMode === "home" ? "street-address" : "off"}
                          required
                      />
                    </label>

                    <label className="field-label booking-place-field">Additional instructions (optional)
                      <textarea
                          rows="2"
                          value={bookingNote}
                          onChange={e => setBookingNote(e.target.value)}
                          placeholder="Landmark, access instructions or other details..."
                          maxLength={800}
                      />
                    </label>
                  </div>

                  <p className="booking-local-note">
                    Your request will be saved in this browser for now. A technician has not yet been notified because the booking backend is not connected.
                  </p>
                  <button className="primary-button full-width" type="submit">Submit booking request</button>
                </form>
              </section>
          )}

          {page === "bookings" && (
              <section className="panel booking-panel">
                {bookingMessage && <div className="alert booking-feedback" role="status">{bookingMessage}</div>}

                <div className="section-heading">
                  <div>
                    <span className="eyebrow">YOUR REPAIR REQUESTS</span>
                    <h1>My bookings</h1>
                    <p className="muted">Review your appointment requests and their current status.</p>
                  </div>
                  <button className="primary-button" onClick={() => { setBookingMessage(""); setPage("book"); }}>
                    New booking
                  </button>
                </div>

                {bookings.length === 0 ? (
                    <div className="booking-empty">
                      <span className="booking-empty-icon">▣</span>
                      <h3>No bookings yet</h3>
                      <p className="muted">Your repair appointments will appear here after you submit a request.</p>
                      <button className="primary-button" onClick={() => setPage("book")}>Book a technician</button>
                    </div>
                ) : (
                    <div className="booking-list">
                      {bookings.map(booking => (
                          <article className="booking-card" key={booking.id}>
                            <div className="booking-card-top">
                              <div>
                                <span className="booking-reference">REF: {booking.id}</span>
                                <h3>{booking.device.charAt(0).toUpperCase() + booking.device.slice(1)} repair</h3>
                              </div>
                              <span className={`booking-status status-${booking.status.toLowerCase().replace(/\s+/g, "-")}`}>
                        {booking.status}
                      </span>
                            </div>

                            <p className="booking-issue">{booking.issue}</p>

                            <div className="booking-details-grid">
                              <span><strong>Service:</strong> {booking.mode === "home" ? "Home visit" : "Repair shop visit"}</span>
                              <span><strong>Date:</strong> {booking.date}</span>
                              <span><strong>Time:</strong> {booking.time}</span>
                              <span><strong>Contact:</strong> {booking.phone}</span>
                              <span className="booking-address">
                        <strong>{booking.mode === "home" ? "Address:" : "Shop:"}</strong> {booking.place}
                      </span>
                            </div>

                            {booking.note && <p className="booking-note"><strong>Note:</strong> {booking.note}</p>}

                            {booking.status === "Pending" && (
                                <button className="text-button booking-cancel" onClick={() => cancelBooking(booking.id)}>
                                  Cancel request
                                </button>
                            )}
                          </article>
                      ))}
                    </div>
                )}
              </section>
          )}

          {page === "history" && (
              <section className="panel">
                <div className="section-heading">
                  <h1>{t.historyTitle}</h1>
                  <button className="text-button" onClick={() => setHistory([])} disabled={!history.length}>
                    {t.clear}
                  </button>
                </div>

                {history.length === 0 ? (
                    <p className="muted">{t.noHistory}</p>
                ) : (
                    <div className="history-list">
                      {history.map(item => (
                          <button className="history-item" key={item.id} onClick={() => openHistoryItem(item)}>
                    <span>
                      <strong>{item.device}</strong>
                      <small>{item.symptom}</small>
                    </span>
                            <time>{new Date(item.date).toLocaleDateString()}</time>
                          </button>
                      ))}
                    </div>
                )}
              </section>
          )}

          {page === "premium" && (
              <section className="premium-page">
                <div className="premium-intro">
                  <span className="eyebrow">FUNDI AI MEMBERSHIP</span>
                  <h1>Choose the support that works for you</h1>
                  <p>Start free, or explore extra guidance with Fundi AI Premium.</p>
                </div>

                <div className="plan-grid">
                  <article className={`plan-card ${selectedPlan === "free" ? "plan-selected" : ""}`}>
                    <div className="plan-label">{t.freePlan}</div>
                    <h2>{t.freePrice}</h2>
                    <p>{t.freeDescription}</p>
                    <h3>{t.included}</h3>
                    <ul>
                      <li>{t.freeFeature1}</li>
                      <li>{t.freeFeature2}</li>
                      <li>{t.freeFeature3}</li>
                    </ul>
                    <button className="secondary-button plan-button" onClick={() => setSelectedPlan("free")}>
                      {selectedPlan === "free" ? t.selectedPlan : t.choosePlan}
                    </button>
                  </article>

                  <article className={`plan-card premium-plan ${selectedPlan === "premium" ? "plan-selected" : ""}`}>
                    <span className="plan-badge">MORE SUPPORT</span>
                    <div className="plan-label">{t.premiumPlan}</div>
                    <h2>{t.premiumPrice}</h2>
                    <p>{t.premiumDescription}</p>
                    <h3>{t.included}</h3>
                    <ul>
                      <li>{t.premiumFeature1}</li>
                      <li>{t.premiumFeature2}</li>
                      <li>{t.premiumFeature3}</li>
                      <li>{t.premiumFeature4}</li>
                    </ul>
                    <button className="primary-button plan-button" onClick={() => setSelectedPlan("premium")}>
                      {selectedPlan === "premium" ? t.selectedPlan : t.choosePlan}
                    </button>
                  </article>
                </div>

                <p className="plan-disclaimer">{t.planNote}</p>
              </section>
          )}
        </main>

        <footer>
          <span>{t.built}</span>
          <span>© {new Date().getFullYear()} Fundi AI</span>
        </footer>

        <VoiceAssistant
            language={language}
            onNavigate={setPage}
            onSelectDevice={setDevice}
            onSetSymptoms={setSymptoms}
            onStartDiagnosis={() => diagnose()}
        />
      </div>
  );
}
