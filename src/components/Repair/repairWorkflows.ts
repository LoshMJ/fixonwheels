// src/components/repair/repairWorkflows.ts
export type Platform = "ios" | "android";

export type Device = {
  id: string;
  brand: "Apple" | "Samsung";
  model: string;        // what we store in selectedModel
  displayName: string;  // what we show in UI (can be same as model)
  platform: Platform;
};

export type IssueDefinition = {
  id: string;   // used as key in workflows
  label: string; // what user sees in dropdown
};

export type WorkflowStep = {
  id: string;
  label: string;
  estMinutes: number;
};

export type WorkflowVariant = {
  default: WorkflowStep[];
  ios?: WorkflowStep[];
  android?: WorkflowStep[];
};

/* ----------------------------------------
   DEVICES (IPHONE + SAMSUNG)
----------------------------------------- */

export const DEVICES: Device[] = [
  // --- iPhone line-up (existing) ---
  { id: "iphone-x", brand: "Apple", model: "iPhone X", displayName: "iPhone X", platform: "ios" },
  { id: "iphone-xr", brand: "Apple", model: "iPhone XR", displayName: "iPhone XR", platform: "ios" },
  { id: "iphone-xs", brand: "Apple", model: "iPhone XS", displayName: "iPhone XS", platform: "ios" },
  { id: "iphone-11", brand: "Apple", model: "iPhone 11", displayName: "iPhone 11", platform: "ios" },
  { id: "iphone-11-pro", brand: "Apple", model: "iPhone 11 Pro", displayName: "iPhone 11 Pro", platform: "ios" },
  { id: "iphone-11-pro-max", brand: "Apple", model: "iPhone 11 Pro Max", displayName: "iPhone 11 Pro Max", platform: "ios" },
  { id: "iphone-12", brand: "Apple", model: "iPhone 12", displayName: "iPhone 12", platform: "ios" },
  { id: "iphone-12-pro", brand: "Apple", model: "iPhone 12 Pro", displayName: "iPhone 12 Pro", platform: "ios" },
  { id: "iphone-12-pro-max", brand: "Apple", model: "iPhone 12 Pro Max", displayName: "iPhone 12 Pro Max", platform: "ios" },
  { id: "iphone-13", brand: "Apple", model: "iPhone 13", displayName: "iPhone 13", platform: "ios" },
  { id: "iphone-13-pro", brand: "Apple", model: "iPhone 13 Pro", displayName: "iPhone 13 Pro", platform: "ios" },
  { id: "iphone-13-pro-max", brand: "Apple", model: "iPhone 13 Pro Max", displayName: "iPhone 13 Pro Max", platform: "ios" },
  { id: "iphone-14", brand: "Apple", model: "iPhone 14", displayName: "iPhone 14", platform: "ios" },
  { id: "iphone-14-plus", brand: "Apple", model: "iPhone 14 plus", displayName: "iPhone 14 plus", platform: "ios" },
  { id: "iphone-14-pro", brand: "Apple", model: "iPhone 14 Pro", displayName: "iPhone 14 Pro", platform: "ios" },
  { id: "iphone-14-pro-max", brand: "Apple", model: "iPhone 14 Pro Max", displayName: "iPhone 14 Pro Max", platform: "ios" },
  { id: "iphone-15", brand: "Apple", model: "iPhone 15", displayName: "iPhone 15", platform: "ios" },
  { id: "iphone-15-plus", brand: "Apple", model: "iPhone 15 plus", displayName: "iPhone 15 plus", platform: "ios" },
  { id: "iphone-15-pro", brand: "Apple", model: "iPhone 15 Pro", displayName: "iPhone 15 Pro", platform: "ios" },
  { id: "iphone-15-pro-max", brand: "Apple", model: "iPhone 15 Pro Max", displayName: "iPhone 15 Pro Max", platform: "ios" },
  { id: "iphone-16", brand: "Apple", model: "iPhone 16", displayName: "iPhone 16", platform: "ios" },
  { id: "iphone-16-plus", brand: "Apple", model: "iPhone 16 plus", displayName: "iPhone 16 plus", platform: "ios" },
  { id: "iphone-16-pro", brand: "Apple", model: "iPhone 16 Pro", displayName: "iPhone 16 Pro", platform: "ios" },
  { id: "iphone-16-pro-max", brand: "Apple", model: "iPhone 16 Pro Max", displayName: "iPhone 16 Pro Max", platform: "ios" },
  { id: "iphone-17", brand: "Apple", model: "iPhone 17", displayName: "iPhone 17", platform: "ios" },
  { id: "iphone-17-Air", brand: "Apple", model: "iPhone 17 Air", displayName: "iPhone 17 Air", platform: "ios" },
  { id: "iphone-17-pro", brand: "Apple", model: "iPhone 17 Pro ", displayName: "iPhone 17 Pro ", platform: "ios" },
  { id: "iphone-17-pro-max", brand: "Apple", model: "iPhone 17 Pro Max", displayName: "iPhone 17 Pro Max", platform: "ios" },

  // --- Samsung line-up (20+ models) ---
  { id: "s20", brand: "Samsung", model: "Galaxy S20", displayName: "Galaxy S20", platform: "android" },
  { id: "s20-plus", brand: "Samsung", model: "Galaxy S20+", displayName: "Galaxy S20+", platform: "android" },
  { id: "s20-ultra", brand: "Samsung", model: "Galaxy S20 Ultra", displayName: "Galaxy S20 Ultra", platform: "android" },

  { id: "s21", brand: "Samsung", model: "Galaxy S21", displayName: "Galaxy S21", platform: "android" },
  { id: "s21-plus", brand: "Samsung", model: "Galaxy S21+", displayName: "Galaxy S21+", platform: "android" },
  { id: "s21-ultra", brand: "Samsung", model: "Galaxy S21 Ultra", displayName: "Galaxy S21 Ultra", platform: "android" },

  { id: "s22", brand: "Samsung", model: "Galaxy S22", displayName: "Galaxy S22", platform: "android" },
  { id: "s22-plus", brand: "Samsung", model: "Galaxy S22+", displayName: "Galaxy S22+", platform: "android" },
  { id: "s22-ultra", brand: "Samsung", model: "Galaxy S22 Ultra", displayName: "Galaxy S22 Ultra", platform: "android" },

  { id: "s23", brand: "Samsung", model: "Galaxy S23", displayName: "Galaxy S23", platform: "android" },
  { id: "s23-plus", brand: "Samsung", model: "Galaxy S23+", displayName: "Galaxy S23+", platform: "android" },
  { id: "s23-ultra", brand: "Samsung", model: "Galaxy S23 Ultra", displayName: "Galaxy S23 Ultra", platform: "android" },

  { id: "a52", brand: "Samsung", model: "Galaxy A52", displayName: "Galaxy A52", platform: "android" },
  { id: "a53", brand: "Samsung", model: "Galaxy A53", displayName: "Galaxy A53", platform: "android" },
  { id: "a54", brand: "Samsung", model: "Galaxy A54", displayName: "Galaxy A54", platform: "android" },
  { id: "a34", brand: "Samsung", model: "Galaxy A34", displayName: "Galaxy A34", platform: "android" },
  { id: "a35", brand: "Samsung", model: "Galaxy A35", displayName: "Galaxy A35", platform: "android" },
  { id: "a14", brand: "Samsung", model: "Galaxy A14", displayName: "Galaxy A14", platform: "android" },
  { id: "a15", brand: "Samsung", model: "Galaxy A15", displayName: "Galaxy A15", platform: "android" },

  { id: "m32", brand: "Samsung", model: "Galaxy M32", displayName: "Galaxy M32", platform: "android" },
  { id: "m33", brand: "Samsung", model: "Galaxy M33", displayName: "Galaxy M33", platform: "android" },
];

/* ----------------------------------------
   ISSUE DEFINITIONS (base + 15 extra)
----------------------------------------- */

export const ISSUES: IssueDefinition[] = [
  { id: "cracked_screen", label: "Cracked screen" },
  { id: "battery_issue", label: "Battery issue" },
  { id: "charging_port", label: "Charging port" },
  { id: "camera_issue", label: "Camera issue" },
  { id: "water_damage", label: "Water damage" },
  { id: "speaker_mic_issue", label: "Speaker / mic issue" },
  { id: "software_issue", label: "Software issue" },
  { id: "other_generic", label: "Other" },

  // extra 15
  { id: "earpiece_clean", label: "Earpiece cleaning" },
  { id: "back_glass", label: "Back glass replacement" },
  { id: "frame_damage", label: "Frame / housing damage" },
  { id: "power_button", label: "Power button issue" },
  { id: "volume_buttons", label: "Volume button issue" },
  { id: "vibration_motor", label: "Vibration motor issue" },
  { id: "face_id", label: "Face ID / front sensor issue" },
  { id: "touch_id", label: "Touch ID / home button issue" },
  { id: "wifi_issue", label: "Wi-Fi / network issue" },
  { id: "bluetooth_issue", label: "Bluetooth issue" },
  { id: "microphone_replacement", label: "Microphone replacement" },
  { id: "earpiece_replacement", label: "Earpiece speaker replacement" },
  { id: "sim_tray", label: "SIM tray / network detection" },
  { id: "no_power", label: "No power / dead phone" },
  { id: "overheating", label: "Overheating / thermal issue" },
];

/* ----------------------------------------
   WORKFLOWS PER ISSUE (IOS / ANDROID)
   – This is what Step 4 reads.
----------------------------------------- */

export const WORKFLOWS: Record<string, WorkflowVariant> = {
  cracked_screen: {
    ios: [
      { id: "checkin", label: "Check-in photos & visual inspection", estMinutes: 5 },
      { id: "poweroff", label: "Power down & discharge device", estMinutes: 5 },
      { id: "open", label: "Remove pentalobe screws & lift display", estMinutes: 10 },
      { id: "disconnect", label: "Disconnect battery & display flex cables", estMinutes: 10 },
      { id: "transfer", label: "Transfer sensors, ear speaker & brackets", estMinutes: 15 },
      { id: "reassemble", label: "Re-assemble housing & torque screws", estMinutes: 10 },
      { id: "qc", label: "Touch, colour, True Tone / Face ID checks", estMinutes: 10 },
    ],
    android: [
      { id: "checkin", label: "Check-in photos & external inspection", estMinutes: 5 },
      { id: "heat", label: "Heat back glass / display separation area", estMinutes: 10 },
      { id: "separate", label: "Separate screen from frame with tools", estMinutes: 15 },
      { id: "disconnect", label: "Disconnect display, battery & sub-flex cables", estMinutes: 10 },
      { id: "mount_new", label: "Mount new AMOLED / LCD panel", estMinutes: 15 },
      { id: "seal", label: "Re-seat frame, apply new adhesive & clamps", estMinutes: 10 },
      { id: "qc", label: "Touch, colour, burn-in & ghost touch checks", estMinutes: 10 },
    ],
    default: [],
  },

  battery_issue: {
    default: [
      { id: "diag", label: "Run battery health & cycle diagnostics", estMinutes: 8 },
      { id: "poweroff", label: "Shut down & discharge device", estMinutes: 5 },
      { id: "open", label: "Open device & expose battery", estMinutes: 10 },
      { id: "remove", label: "Remove old battery / adhesive strips", estMinutes: 10 },
      { id: "install", label: "Install new OEM-grade battery", estMinutes: 10 },
      { id: "calibrate", label: "Boot & run charge / drain calibration", estMinutes: 12 },
    ],
  },

  charging_port: {
    default: [
      { id: "inspect_port", label: "Inspect port & clean debris", estMinutes: 5 },
      { id: "board_access", label: "Open device & expose dock flex", estMinutes: 10 },
      { id: "swap_flex", label: "Replace charging flex assembly", estMinutes: 15 },
      { id: "reassemble", label: "Re-assemble & seal device", estMinutes: 10 },
      { id: "charge_test", label: "Test wired charging & data sync", estMinutes: 10 },
    ],
  },

  camera_issue: {
    default: [
      { id: "camera_diag", label: "Test all lenses & focus modes", estMinutes: 8 },
      { id: "open_phone", label: "Open device & expose camera modules", estMinutes: 10 },
      { id: "swap_module", label: "Replace faulty camera module(s)", estMinutes: 15 },
      { id: "dust_check", label: "Clean lenses & check for dust / glare", estMinutes: 7 },
      { id: "final_test", label: "Test photo, video & stabilization", estMinutes: 10 },
    ],
  },

  water_damage: {
    default: [
      { id: "power_isolation", label: "Isolate power & disconnect battery", estMinutes: 5 },
      { id: "stripdown", label: "Full strip-down of boards & flex cables", estMinutes: 20 },
      { id: "ultrasonic", label: "Ultrasonic bath / board cleaning", estMinutes: 20 },
      { id: "drying", label: "Controlled drying & inspection", estMinutes: 20 },
      { id: "rebuild", label: "Rebuild & test all major functions", estMinutes: 25 },
    ],
  },

  speaker_mic_issue: {
    default: [
      { id: "test", label: "Mic & speaker diagnostics", estMinutes: 5 },
      { id: "clean", label: "Clean grills & ports", estMinutes: 7 },
      { id: "swap_part", label: "Replace earpiece / loudspeaker module", estMinutes: 12 },
      { id: "call_test", label: "Test calls, media & mic pickup", estMinutes: 8 },
    ],
  },

  software_issue: {
    default: [
      { id: "backup_check", label: "Check / confirm customer backup", estMinutes: 5 },
      { id: "scan", label: "Run malware / performance scan", estMinutes: 10 },
      { id: "cleanup", label: "Remove bloat, reset settings, free storage", estMinutes: 15 },
      { id: "updates", label: "Apply OS & security updates", estMinutes: 15 },
      { id: "final_verify", label: "Final app & stability check", estMinutes: 10 },
    ],
  },

  earpiece_clean: {
    default: [
      { id: "mask", label: "Mask screen & open ports with tape", estMinutes: 2 },
      { id: "brush", label: "Soft-brush earpiece grill to loosen dust", estMinutes: 4 },
      { id: "air", label: "Use compressed air / putty to clear debris", estMinutes: 3 },
      { id: "sound_test", label: "Test earpiece with call audio", estMinutes: 3 },
    ],
  },

  back_glass: {
    ios: [
      { id: "pre_check", label: "Check cameras & frame alignment", estMinutes: 5 },
      { id: "heat_back", label: "Heat back glass to soften adhesive", estMinutes: 15 },
      { id: "separate_glass", label: "Carefully separate cracked glass", estMinutes: 20 },
      { id: "prep_frame", label: "Clean frame & remove sharp shards", estMinutes: 15 },
      { id: "apply_new", label: "Fit new back glass & adhesive", estMinutes: 15 },
      { id: "press", label: "Clamp & cure adhesive under pressure", estMinutes: 20 },
    ],
    android: [
      { id: "heat_back", label: "Heat rear glass & camera surrounds", estMinutes: 15 },
      { id: "remove_glass", label: "Lift rear glass avoiding camera damage", estMinutes: 20 },
      { id: "prep", label: "Scrape old glue & clean surfaces", estMinutes: 15 },
      { id: "fit_new", label: "Align & bond new rear housing glass", estMinutes: 15 },
    ],
    default: [],
  },

  frame_damage: {
    default: [
      { id: "inspect", label: "Inspect bends & alignment", estMinutes: 8 },
      { id: "strip", label: "Strip device from frame / chassis", estMinutes: 20 },
      { id: "reshape", label: "Careful frame straighten / refit", estMinutes: 20 },
      { id: "rebuild", label: "Rebuild components into frame", estMinutes: 20 },
      { id: "seal", label: "Check button click & port alignment", estMinutes: 10 },
    ],
  },

  power_button: {
    default: [
      { id: "test", label: "Test click feel & software response", estMinutes: 5 },
      { id: "open", label: "Open device & expose button flex", estMinutes: 10 },
      { id: "swap", label: "Replace power button flex / mechanism", estMinutes: 15 },
      { id: "retest", label: "Re-test wake, lock & screenshot", estMinutes: 5 },
    ],
  },

  volume_buttons: {
    default: [
      { id: "test", label: "Check volume rocker & mute switch", estMinutes: 5 },
      { id: "access", label: "Access side button flex cable", estMinutes: 10 },
      { id: "replace", label: "Replace volume / mute flex assembly", estMinutes: 15 },
      { id: "qa", label: "Re-test media & call volume control", estMinutes: 5 },
    ],
  },

  vibration_motor: {
    default: [
      { id: "diag", label: "Test haptics & vibration patterns", estMinutes: 5 },
      { id: "access", label: "Open device & expose Taptic / vibration motor", estMinutes: 10 },
      { id: "replace", label: "Replace vibration motor unit", estMinutes: 12 },
      { id: "test", label: "Re-test vibration in system & apps", estMinutes: 6 },
    ],
  },

  face_id: {
    ios: [
      { id: "scan", label: "Run Face ID diagnostics & logs", estMinutes: 8 },
      { id: "inspect", label: "Inspect dot projector / IR / camera flex", estMinutes: 10 },
      { id: "clean", label: "Clean notch & sensor windows", estMinutes: 5 },
      { id: "re-seat", label: "Re-seat or replace sensor flex where possible", estMinutes: 15 },
      { id: "enroll", label: "Re-enroll Face ID with customer", estMinutes: 8 },
    ],
    default: [],
  },

  touch_id: {
    default: [
      { id: "test", label: "Test fingerprint registration & unlock", estMinutes: 5 },
      { id: "clean", label: "Clean home button / sensor ring", estMinutes: 4 },
      { id: "flex_check", label: "Inspect home button flex & seating", estMinutes: 10 },
      { id: "reassemble", label: "Re-seat connectors & secure", estMinutes: 8 },
    ],
  },

  wifi_issue: {
    default: [
      { id: "soft_diag", label: "Check router / network & software", estMinutes: 8 },
      { id: "antenna_check", label: "Inspect Wi-Fi antenna paths", estMinutes: 12 },
      { id: "re-seat", label: "Re-seat antenna / board connectors", estMinutes: 10 },
      { id: "final_test", label: "Speed & stability tests", estMinutes: 10 },
    ],
  },

  bluetooth_issue: {
    default: [
      { id: "soft_reset", label: "Forget & re-pair test devices", estMinutes: 8 },
      { id: "rf_inspect", label: "Inspect BT antenna region", estMinutes: 10 },
      { id: "re-seat", label: "Re-seat RF & BT connectors", estMinutes: 8 },
      { id: "qa", label: "Re-test calls, audio & range", estMinutes: 10 },
    ],
  },

  microphone_replacement: {
    default: [
      { id: "diag", label: "Mic test in calls, video & voice memos", estMinutes: 8 },
      { id: "access", label: "Access bottom or top mic assembly", estMinutes: 12 },
      { id: "replace", label: "Replace microphone / flex module", estMinutes: 15 },
      { id: "qa", label: "Re-test across all input modes", estMinutes: 10 },
    ],
  },

  earpiece_replacement: {
    default: [
      { id: "test", label: "Run earpiece audio tests", estMinutes: 5 },
      { id: "open", label: "Open device / remove display", estMinutes: 10 },
      { id: "replace", label: "Replace earpiece speaker assembly", estMinutes: 12 },
      { id: "seal", label: "Re-seat dust mesh & sealing foam", estMinutes: 6 },
      { id: "call_test", label: "Final call & VoIP quality checks", estMinutes: 7 },
    ],
  },

  sim_tray: {
    default: [
      { id: "check_sim", label: "Check SIM, tray & pins", estMinutes: 5 },
      { id: "tray_swap", label: "Replace SIM tray if damaged", estMinutes: 5 },
      { id: "antenna_check", label: "Check network antenna & signal path", estMinutes: 10 },
      { id: "network_test", label: "Run signal strength & call tests", estMinutes: 10 },
    ],
  },

  no_power: {
    default: [
      { id: "intake", label: "Intake & visual inspection", estMinutes: 5 },
      { id: "power_diag", label: "Run power rail & basic board checks", estMinutes: 15 },
      { id: "battery_swap", label: "Test with known-good battery", estMinutes: 10 },
      { id: "port_check", label: "Inspect charging port & cable", estMinutes: 8 },
      { id: "board_level", label: "Escalate to board-level diagnostics", estMinutes: 20 },
    ],
  },

  overheating: {
    default: [
      { id: "history", label: "Check usage pattern & apps", estMinutes: 8 },
      { id: "thermal_diag", label: "Measure temps under controlled load", estMinutes: 12 },
      { id: "cleanup", label: "Clean vents / remove dust / reseat shields", estMinutes: 12 },
      { id: "paste", label: "Refresh thermal paste / pads if applicable", estMinutes: 18 },
      { id: "retest", label: "Stress test & monitor thermals", estMinutes: 15 },
    ],
  },

  other_generic: {
    default: [
      { id: "intake", label: "General diagnostics & notes review", estMinutes: 10 },
      { id: "focus", label: "Identify affected modules / symptoms", estMinutes: 15 },
      { id: "fix", label: "Apply targeted fix or escalate", estMinutes: 20 },
      { id: "qa", label: "Quick functional test before return", estMinutes: 10 },
    ],
  },
};

/* ----------------------------------------
   HELPERS for RepairSteps.tsx
----------------------------------------- */

export function findDeviceByModel(model: string | null) {
  if (!model) return undefined;
  return DEVICES.find((d) => d.model === model || d.displayName === model);
}

export function findIssueByLabel(label: string | null) {
  if (!label) return undefined;
  return ISSUES.find((i) => i.label === label);
}

export function getRepairWorkflow(
  model: string | null,
  issueLabel: string | null
) {
  const device = findDeviceByModel(model);
  const issue = findIssueByLabel(issueLabel);
  if (!issue) return null;

  const variant = WORKFLOWS[issue.id];
  if (!variant) return null;

  const platformKey = device?.platform;
  const steps: WorkflowStep[] =
    (platformKey && (variant as any)[platformKey]) || variant.default || [];

  if (!steps || steps.length === 0) return null;

  const totalMinutes = steps.reduce((sum, s) => sum + s.estMinutes, 0);

  return { device, issue, steps, totalMinutes };
}
