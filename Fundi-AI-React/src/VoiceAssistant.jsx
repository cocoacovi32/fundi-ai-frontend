
import React, { useEffect, useRef, useState } from "react";
import "./voice.css";

export default function VoiceAssistant({
                                           language,
                                           onNavigate,
                                           onSelectDevice,
                                           onSetSymptoms,
                                           onStartDiagnosis
                                       }) {
    const [listening, setListening] = useState(false);
    const [message, setMessage] = useState("");
    const recognitionRef = useRef(null);

    const isSwahili = language === "sw";

    function speak(text) {
        if (!("speechSynthesis" in window)) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = isSwahili ? "sw-KE" : "en-KE";
        utterance.rate = 1;

        window.speechSynthesis.speak(utterance);
    }

    function reply(english, swahili) {
        const text = isSwahili ? swahili : english;
        setMessage(text);
        speak(text);
    }

    function processCommand(rawText) {
        const text = rawText.toLowerCase().trim();

        if (!text) return;

        setMessage(`You said: ${rawText}`);

        // Page navigation commands
        if (/home|mwanzo|go back home|open home/.test(text)) {
            onNavigate("home");
            reply("Opening Home.", "Ninafungua ukurasa wa mwanzo.");
            return;
        }

        if (/repair shops|shops|fundi wa karibu|mafundi|open shops/.test(text)) {
            onNavigate("shops");
            reply("Opening Repair Shops.", "Ninafungua ukurasa wa mafundi.");
            return;
        }

        if (/history|historia|my previous diagnoses/.test(text)) {
            onNavigate("history");
            reply("Opening your history.", "Ninafungua historia yako.");
            return;
        }

        if (/results|result|matokeo|open results/.test(text)) {
            onNavigate("result");
            reply("Opening your diagnosis results.", "Ninafungua matokeo ya utambuzi.");
            return;
        }

        if (/premium|subscription|usajili/.test(text)) {
            onNavigate("premium");
            reply("Opening Premium.", "Ninafungua Premium.");
            return;
        }

        if (/diagnosis|utambuzi|open diagnosis/.test(text) &&
            !/diagnose|tambua/.test(text)) {
            onNavigate("diagnosis");
            reply("Opening Diagnosis.", "Ninafungua ukurasa wa utambuzi.");
            return;
        }

        // Start diagnosis only after confirmation
        if (/diagnose|start diagnosis|tambua tatizo|anza utambuzi/.test(text)) {
            const confirmed = window.confirm(
                isSwahili
                    ? "Ungependa kuanza utambuzi sasa?"
                    : "Would you like to start the diagnosis now?"
            );

            if (confirmed) {
                onNavigate("diagnosis");
                onStartDiagnosis();
            } else {
                reply("Okay, diagnosis cancelled.", "Sawa, utambuzi umeghairiwa.");
            }
            return;
        }

        // Device selection
        let selectedDevice = "";

        if (/phone|mobile|simu/.test(text)) {
            selectedDevice = "phone";
        } else if (/laptop|computer|kompyuta/.test(text)) {
            selectedDevice = "laptop";
        } else if (/router|wifi|wi-fi|ruta/.test(text)) {
            selectedDevice = "router";
        }

        if (selectedDevice) {
            onSelectDevice(selectedDevice);
            onNavigate("diagnosis");

            // If the user also described a fault, fill the symptoms field.
            const hasProblem =
                /overheat|hot|heating|battery|charging|charge|screen|broken|slow|not working|won't|cannot|can't|haifanyi|joto|chaji|imeharibika|imevunjika|haiwaki|mtandao/.test(text);

            if (hasProblem) {
                onSetSymptoms(rawText);
                reply(
                    "I selected your device and entered the problem. You can now review it.",
                    "Nimechagua kifaa na kuingiza tatizo. Unaweza kukagua maelezo sasa."
                );
            } else {
                reply(
                    `I selected ${selectedDevice}. Please describe the problem.`,
                    "Nimechagua kifaa chako. Tafadhali eleza tatizo."
                );
            }
            return;
        }

        // Treat other spoken sentences as symptom descriptions.
        onNavigate("diagnosis");
        onSetSymptoms(rawText);

        reply(
            "I entered your description in the symptoms box. Please review it.",
            "Nimeingiza maelezo yako kwenye sehemu ya tatizo. Tafadhali yakague."
        );
    }

    function startListening() {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setMessage(
                "Speech recognition is not supported in this browser. Try Google Chrome."
            );
            return;
        }

        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }

        const recognition = new SpeechRecognition();

        recognition.lang = isSwahili ? "sw-KE" : (navigator.language || "en-US");
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setListening(true);
            setMessage(isSwahili ? "Ninasikiliza... Ongea sasa." : "Listening... Speak now.");
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            processCommand(transcript);
        };

        recognition.onerror = (event) => {
            console.warn("VoiceAssistant error:", event.error);
            if (event.error === "not-allowed") {
                setMessage(isSwahili ? "Ruhusa ya maikrofoni imezimwa." : "Microphone permission blocked in browser.");
            } else if (event.error === "no-speech") {
                setMessage(isSwahili ? "Hakuna sauti iliyosikika." : "No speech detected. Please speak closer.");
            } else {
                setMessage(`Voice error: ${event.error}. Please try again.`);
            }
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
            recognitionRef.current = null;
        };

        recognitionRef.current = recognition;
        recognition.start();
    }

    function stopListening() {
        recognitionRef.current?.stop();
        setListening(false);
    }

    useEffect(() => {
        return () => {
            recognitionRef.current?.stop();
            window.speechSynthesis?.cancel();
        };
    }, []);

    return (
        <div className="voice-assistant">
            <div className="voice-assistant-message" aria-live="polite">
                {message || (isSwahili
                    ? "Bonyeza maikrofoni na utoe amri."
                    : "Press the microphone and give a command.")}
            </div>

            <button
                type="button"
                className={`voice-assistant-button ${listening ? "is-listening" : ""}`}
                onClick={listening ? stopListening : startListening}
                aria-label={listening ? "Stop listening" : "Start voice assistant"}
            >
                <span className="voice-mic-icon">{listening ? "■" : "🎙️"}</span>
                <span>{listening ? "Stop" : "Hey Fundi"}</span>
            </button>
        </div>
    );
}
