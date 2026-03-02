export type WorkflowStep = {
  id: string;
  label: string;
  estMinutes: number;
};

export const WORKFLOWS: Record<string, WorkflowStep[]> = {

  cracked_screen: [
    { id: "checkin", label: "Check-in inspection", estMinutes: 5 },
    { id: "remove_display", label: "Remove display", estMinutes: 15 },
    { id: "install_display", label: "Install new display", estMinutes: 15 },
    { id: "qc", label: "Quality check", estMinutes: 10 },
  ],

  speaker_mic_issue: [
    { id: "diagnostics", label: "Audio diagnostics", estMinutes: 5 },
    { id: "open", label: "Open device", estMinutes: 10 },
    { id: "inspect", label: "Inspect speaker & mic module", estMinutes: 10 },
    { id: "replace", label: "Replace faulty component", estMinutes: 15 },
    { id: "test", label: "Final audio testing", estMinutes: 5 },
  ],

  battery_issue: [
    { id: "diagnostics", label: "Battery diagnostics", estMinutes: 8 },
    { id: "poweroff", label: "Power down device", estMinutes: 5 },
    { id: "open", label: "Open housing", estMinutes: 10 },
    { id: "remove", label: "Remove old battery", estMinutes: 10 },
    { id: "install", label: "Install new battery", estMinutes: 10 },
    { id: "calibrate", label: "Calibrate battery", estMinutes: 10 },
    { id: "qc", label: "Final quality test", estMinutes: 5 },
  ],

  charging_port: [
    { id: "inspect", label: "Inspect & clean port", estMinutes: 5 },
    { id: "open", label: "Open device", estMinutes: 10 },
    { id: "replace", label: "Replace charging port module", estMinutes: 15 },
    { id: "test", label: "Test charging & data sync", estMinutes: 10 },
  ],

  camera_issue: [
    { id: "diagnose", label: "Camera diagnostics", estMinutes: 8 },
    { id: "remove", label: "Remove camera module", estMinutes: 15 },
    { id: "install", label: "Install new module", estMinutes: 15 },
    { id: "calibrate", label: "Calibrate & test", estMinutes: 10 },
  ],

  water_damage: [
    { id: "isolate", label: "Power isolation", estMinutes: 5 },
    { id: "stripdown", label: "Full disassembly", estMinutes: 20 },
    { id: "clean", label: "Board cleaning", estMinutes: 20 },
    { id: "dry", label: "Drying & inspection", estMinutes: 20 },
    { id: "rebuild", label: "Rebuild & test", estMinutes: 25 },
  ],

  software_issue: [
    { id: "backup", label: "Backup check", estMinutes: 5 },
    { id: "scan", label: "System scan", estMinutes: 10 },
    { id: "cleanup", label: "Optimize system", estMinutes: 15 },
    { id: "update", label: "Apply updates", estMinutes: 15 },
    { id: "verify", label: "Final stability test", estMinutes: 10 },
  ],

  earpiece_clean: [
    { id: "clean", label: "Clean earpiece grill", estMinutes: 5 },
    { id: "test", label: "Audio test", estMinutes: 5 },
  ],

  back_glass: [
    { id: "heat", label: "Heat back glass", estMinutes: 15 },
    { id: "remove", label: "Remove cracked glass", estMinutes: 20 },
    { id: "install", label: "Install new glass", estMinutes: 15 },
    { id: "seal", label: "Seal & cure adhesive", estMinutes: 15 },
  ],

  frame_damage: [
    { id: "inspect", label: "Inspect frame", estMinutes: 10 },
    { id: "reshape", label: "Reshape / replace frame", estMinutes: 25 },
    { id: "reassemble", label: "Reassemble device", estMinutes: 20 },
  ],

  power_button: [
    { id: "test", label: "Test power button", estMinutes: 5 },
    { id: "replace", label: "Replace button flex", estMinutes: 15 },
    { id: "retest", label: "Retest wake/lock", estMinutes: 5 },
  ],

  volume_buttons: [
    { id: "test", label: "Test volume buttons", estMinutes: 5 },
    { id: "replace", label: "Replace flex assembly", estMinutes: 15 },
    { id: "qa", label: "Re-test audio control", estMinutes: 5 },
  ],

  vibration_motor: [
    { id: "diagnose", label: "Test vibration motor", estMinutes: 5 },
    { id: "replace", label: "Replace motor unit", estMinutes: 12 },
    { id: "test", label: "Re-test vibration", estMinutes: 6 },
  ],

  face_id: [
    { id: "diagnose", label: "Run Face ID diagnostics", estMinutes: 8 },
    { id: "inspect", label: "Inspect sensor flex", estMinutes: 10 },
    { id: "repair", label: "Repair / reseat module", estMinutes: 15 },
    { id: "enroll", label: "Re-enroll Face ID", estMinutes: 8 },
  ],

  touch_id: [
    { id: "test", label: "Test fingerprint sensor", estMinutes: 5 },
    { id: "inspect", label: "Inspect home button flex", estMinutes: 10 },
    { id: "secure", label: "Secure & reassemble", estMinutes: 8 },
  ],

  wifi_issue: [
    { id: "software", label: "Check network settings", estMinutes: 8 },
    { id: "inspect", label: "Inspect antenna path", estMinutes: 10 },
    { id: "test", label: "Speed & stability test", estMinutes: 10 },
  ],

  bluetooth_issue: [
    { id: "reset", label: "Reset pairing & test", estMinutes: 8 },
    { id: "inspect", label: "Inspect antenna path", estMinutes: 10 },
    { id: "qa", label: "Range & stability test", estMinutes: 10 },
  ],

  microphone_replacement: [
    { id: "diagnose", label: "Mic diagnostics", estMinutes: 8 },
    { id: "replace", label: "Replace mic module", estMinutes: 15 },
    { id: "qa", label: "Voice input testing", estMinutes: 10 },
  ],

  earpiece_replacement: [
    { id: "diagnose", label: "Earpiece test", estMinutes: 5 },
    { id: "replace", label: "Replace earpiece module", estMinutes: 12 },
    { id: "qa", label: "Call audio test", estMinutes: 7 },
  ],

  sim_tray: [
    { id: "inspect", label: "Inspect SIM tray & pins", estMinutes: 5 },
    { id: "replace", label: "Replace tray", estMinutes: 5 },
    { id: "network_test", label: "Signal test", estMinutes: 10 },
  ],

  no_power: [
    { id: "inspect", label: "Visual inspection", estMinutes: 5 },
    { id: "battery_test", label: "Test known-good battery", estMinutes: 10 },
    { id: "board_diag", label: "Board-level diagnostics", estMinutes: 20 },
  ],

  overheating: [
    { id: "diagnose", label: "Thermal diagnostics", estMinutes: 12 },
    { id: "clean", label: "Clean internals", estMinutes: 12 },
    { id: "stress_test", label: "Stress test & monitor", estMinutes: 15 },
  ],

  other_generic: [
    { id: "diagnostics", label: "General diagnostics", estMinutes: 15 },
    { id: "repair", label: "Targeted fix", estMinutes: 20 },
    { id: "qa", label: "Final test", estMinutes: 10 },
  ],
};