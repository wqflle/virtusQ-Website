export type Drill = {
  id: string;
  name: string;
  description: string;
  reps: string;
  focus: string;
  category:
    | "platform_stability"
    | "posture"
    | "timing"
    | "footwork"
    | "hand_shape"
    | "release_speed"
    | "consistency"
    | "movement"
    | "serve_receive"
    | "setting_precision";
  skill: "passing" | "setting";
  difficulty: 1 | 2 | 3 | 4 | 5;
  solo: boolean;
};

export const DRILL_LIBRARY: Drill[] = [

  /* ===========================
     PASSING – PLATFORM CONTROL
  ============================ */

  {
    id: "pass_wall_basic",
    name: "Wall Forearm Rebounds",
    description:
      "Stand 2–3m from wall. Toss ball and forearm pass repeatedly against wall without spin.",
    reps: "5 x 25 clean contacts",
    focus: "Platform angle consistency",
    category: "platform_stability",
    skill: "passing",
    difficulty: 1,
    solo: true,
  },
  {
    id: "pass_wall_no_spin",
    name: "No-Spin Platform Control",
    description:
      "Forearm pass to wall. Ball must return without side spin.",
    reps: "4 x 20 perfect reps",
    focus: "Flat platform discipline",
    category: "platform_stability",
    skill: "passing",
    difficulty: 2,
    solo: true,
  },
  {
    id: "pass_hold_contact",
    name: "Platform Freeze Drill",
    description:
      "Hold platform still for 2 seconds after contact before resetting.",
    reps: "4 x 15 controlled passes",
    focus: "Post-contact stability",
    category: "platform_stability",
    skill: "passing",
    difficulty: 2,
    solo: true,
  },

  /* ===========================
     PASSING – MOVEMENT
  ============================ */

  {
    id: "pass_shuffle_lr",
    name: "Lateral Shuffle Pass",
    description:
      "Partner tosses left and right. Shuffle before passing.",
    reps: "5 x 20 reps",
    focus: "Movement into platform",
    category: "movement",
    skill: "passing",
    difficulty: 3,
    solo: false,
  },
  {
    id: "pass_drop_step",
    name: "Drop Step Transition Pass",
    description:
      "Start square. Drop step to angled toss before passing.",
    reps: "4 x 15 reps each side",
    focus: "Footwork efficiency",
    category: "footwork",
    skill: "passing",
    difficulty: 3,
    solo: false,
  },

  /* ===========================
     SERVE RECEIVE
  ============================ */

  {
    id: "sr_float_read",
    name: "Float Serve Read",
    description:
      "Partner float serves. Focus on early read and stable contact.",
    reps: "30 live serves",
    focus: "Reading float trajectory",
    category: "serve_receive",
    skill: "passing",
    difficulty: 4,
    solo: false,
  },
  {
    id: "sr_zone_target",
    name: "Zone Target Passing",
    description:
      "Pass serves to a marked setter zone target.",
    reps: "4 x 15 accurate passes",
    focus: "Directional control",
    category: "serve_receive",
    skill: "passing",
    difficulty: 4,
    solo: false,
  },

  /* ===========================
     POSTURE / BASE
  ============================ */

  {
    id: "posture_hold_low",
    name: "Low Base Hold",
    description:
      "Hold athletic defensive base while partner tosses light balls.",
    reps: "4 x 45 seconds",
    focus: "Base discipline",
    category: "posture",
    skill: "passing",
    difficulty: 2,
    solo: false,
  },
  {
    id: "posture_reset",
    name: "Reset Between Reps",
    description:
      "After each pass, fully reset posture before next toss.",
    reps: "4 x 20 reps",
    focus: "Pre-contact preparation",
    category: "posture",
    skill: "passing",
    difficulty: 2,
    solo: false,
  },

  /* ===========================
     SETTING – WALL
  ============================ */

  {
    id: "set_wall_basic",
    name: "Wall Setting Rhythm",
    description:
      "Continuous setting against wall without double contact.",
    reps: "5 x 45 seconds",
    focus: "Hand consistency",
    category: "hand_shape",
    skill: "setting",
    difficulty: 1,
    solo: true,
  },
  {
    id: "set_release_speed",
    name: "Quick Release Wall Set",
    description:
      "Minimize ball hold time while maintaining clean contact.",
    reps: "4 x 30 reps",
    focus: "Release speed",
    category: "release_speed",
    skill: "setting",
    difficulty: 3,
    solo: true,
  },
  {
    id: "set_one_hand_control",
    name: "One-Hand Control Sets",
    description:
      "Alternate single-hand contact to improve hand awareness.",
    reps: "4 x 15 each hand",
    focus: "Fine motor control",
    category: "hand_shape",
    skill: "setting",
    difficulty: 4,
    solo: true,
  },

  /* ===========================
     SETTING – FOOTWORK
  ============================ */

  {
    id: "set_move_left_right",
    name: "Move & Set",
    description:
      "Partner tosses off-target. Move feet before setting.",
    reps: "4 x 20 reps",
    focus: "Footwork into set",
    category: "footwork",
    skill: "setting",
    difficulty: 3,
    solo: false,
  },
  {
    id: "set_jump_balance",
    name: "Jump Set Stability",
    description:
      "Jump set while maintaining square shoulders.",
    reps: "4 x 15 clean reps",
    focus: "Mid-air stability",
    category: "platform_stability",
    skill: "setting",
    difficulty: 4,
    solo: false,
  },

  /* ===========================
     CONSISTENCY
  ============================ */

  {
    id: "pass_50_in_row",
    name: "50 Perfect Contacts",
    description:
      "Must complete 50 perfect passes without technical error.",
    reps: "1 x 50 perfect reps",
    focus: "Repeatability under fatigue",
    category: "consistency",
    skill: "passing",
    difficulty: 5,
    solo: true,
  },
  {
    id: "set_40_clean",
    name: "40 Clean Sets",
    description:
      "40 consecutive clean wall sets without double or spin.",
    reps: "1 x 40 perfect reps",
    focus: "Technical consistency",
    category: "consistency",
    skill: "setting",
    difficulty: 4,
    solo: true,
  },

  /* ===========================
     ELITE REACTION
  ============================ */

  {
    id: "reaction_random_toss",
    name: "Random Reaction Pass",
    description:
      "Partner randomly tosses high/short/left/right. React immediately.",
    reps: "5 x 20 reps",
    focus: "Reaction speed",
    category: "timing",
    skill: "passing",
    difficulty: 4,
    solo: false,
  },
  {
    id: "reaction_set_decision",
    name: "Decision Setting Drill",
    description:
      "Coach calls target mid-air. Adjust set direction instantly.",
    reps: "4 x 20 reps",
    focus: "Decision speed",
    category: "timing",
    skill: "setting",
    difficulty: 5,
    solo: false,
  },

];
