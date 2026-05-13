import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAppColors } from "../../lib/useAppColors";

/* =====================================================
   TYPES
===================================================== */
type Drill = {
  title:       string;
  description: string;
  reps:        string;
  focus:       string; // one-line coaching cue for this drill
};

/* =====================================================
   DRILL LIBRARY
   Drills are selected based on skill + quality.
   The primary_fix from the AI is surfaced as the
   main coaching card — drills support it rather than
   replacing it.
===================================================== */
const DRILLS: Record<string, Record<string, Drill[]>> = {
  passing: {
    bad: [
      {
        title:       "Freeze Platform",
        description: "Build your platform before the toss arrives. Hold it locked for 1 full second after contact. No swing, no follow-through.",
        reps:        "3 × 15 reps",
        focus:       "Platform stability before speed",
      },
      {
        title:       "Two-Step Rule",
        description: "You must take at least 2 shuffle steps before every pass. No reaching — feet to the ball first, then platform.",
        reps:        "3 × 12 reps",
        focus:       "Feet before arms",
      },
      {
        title:       "Wall Platform Hold",
        description: "Stand 1 metre from a wall. Build your platform, press it lightly against the wall, and hold for 5 seconds. Feel the lock.",
        reps:        "3 × 10 holds",
        focus:       "Arm lock awareness",
      },
    ],
    situational: [
      {
        title:       "Target Zone Passing",
        description: "Place a target on the court. Pass 10 in a row to the same spot. Focus on identical posture and angle — not power.",
        reps:        "5 × 10 passes",
        focus:       "Angle consistency",
      },
      {
        title:       "Split-Step → Pass",
        description: "Mini hop to load your weight forward, then shuffle and pass. Every rep starts with the split-step.",
        reps:        "3 × 12 reps",
        focus:       "Weight transfer and balance",
      },
      {
        title:       "Slow Toss Reps",
        description: "Have a partner toss at half speed. Use the extra time to exaggerate your early prep — platform set before the ball crosses the net.",
        reps:        "3 × 15 reps",
        focus:       "Early preparation habit",
      },
    ],
    good: [
      {
        title:       "Identical Rep Challenge",
        description: "10 passes in a row. Every single one must feel and look identical — same stance, same contact point, same finish. Count resets.",
        reps:        "3 × 10 clean reps",
        focus:       "Repeatability under pressure",
      },
      {
        title:       "Pressure Passing",
        description: "Pass while fatigued — after 10 burpees or a 30-second run. Elite technique holds under stress. Track if your score drops.",
        reps:        "3 rounds",
        focus:       "Consistency under fatigue",
      },
      {
        title:       "Varied Serve Receive",
        description: "Have a partner vary pace, angle, and spin. Maintain your base and let the platform do the work regardless of what comes at you.",
        reps:        "10 minutes",
        focus:       "Adaptability with clean mechanics",
      },
    ],
  },

  setting: {
    bad: [
      {
        title:       "Hands-Up Hold",
        description: "Raise both hands to your setting window and hold for 3 seconds before every toss. Never let them drop below forehead height.",
        reps:        "3 × 15 reps",
        focus:       "Window height and early prep",
      },
      {
        title:       "Kneeling Sets",
        description: "Set from your knees. Removes leg compensation and forces a clean, high contact window every rep.",
        reps:        "3 × 20 reps",
        focus:       "Clean contact without compensation",
      },
      {
        title:       "Wall Set → Freeze",
        description: "Set to the wall and hold your finish position for 2 seconds after every rep. Check wrist height and arm extension.",
        reps:        "3 × 15 reps",
        focus:       "Release consistency",
      },
    ],
    situational: [
      {
        title:       "Dip-Extend Sets",
        description: "Small knee dip before every set. Feel the leg contribution. Count 'dip-two-set' out loud until it's automatic.",
        reps:        "3 × 15 reps",
        focus:       "Leg drive habit",
      },
      {
        title:       "Mirror Check",
        description: "Set in front of a mirror or camera. Freeze at contact and check wrist levels — both hands must be identical.",
        reps:        "3 × 12 reps",
        focus:       "Symmetrical release",
      },
      {
        title:       "Catch-Set Drill",
        description: "Catch the toss with both hands, freeze completely, then set. Eliminates rushed contact and forces a clean start position.",
        reps:        "3 × 10 reps",
        focus:       "Patience at contact",
      },
    ],
    good: [
      {
        title:       "Eyes-Neutral Sets",
        description: "Set to different hitters without looking at them until the last possible moment. Train deception through eye discipline.",
        reps:        "10 minutes",
        focus:       "Deception and decision making",
      },
      {
        title:       "Tempo Variation",
        description: "Alternate between slow sets (back row) and quick sets (tight). Same hand shape, different timing. The shape should never change.",
        reps:        "3 × 12 reps each",
        focus:       "Shape under varied tempo",
      },
      {
        title:       "Fatigue Sets",
        description: "Set 30 in a row without stopping. Track when your window starts to drop. Elite consistency means the last 10 look like the first 10.",
        reps:        "3 rounds of 30",
        focus:       "Consistency under fatigue",
      },
    ],
  },

  attacking: {
    bad: [
      {
        title:       "Approach Walkthrough",
        description: "Walk through your full approach at 30% speed. Focus entirely on footwork timing and last-step loading — not the swing.",
        reps:        "10 minutes",
        focus:       "Footwork timing",
      },
      {
        title:       "Arm Swing Isolation",
        description: "No jump. Stand in place and swing your arm through full extension with a clean wrist snap. Film from the side.",
        reps:        "3 × 15 reps",
        focus:       "Full extension and snap",
      },
      {
        title:       "Toss and Contact",
        description: "Self-toss and contact the ball at full reach. No approach. Focus on the contact point being high and in front.",
        reps:        "3 × 12 reps",
        focus:       "Contact height and position",
      },
    ],
    situational: [
      {
        title:       "Targeted Roll Shots",
        description: "Control over power. Hit specific zones with intent — back corner, line, angle. Accuracy before velocity.",
        reps:        "3 × 10 each zone",
        focus:       "Direction control",
      },
      {
        title:       "Approach Rhythm Drill",
        description: "Approach without attacking. Focus on the last two steps being explosive and your arm loading naturally on the penultimate.",
        reps:        "3 × 10 approaches",
        focus:       "Explosive last step",
      },
      {
        title:       "Block-Out Reps",
        description: "Attack with the intention of hitting off a blocker's hands. Changes your angle awareness and contact precision.",
        reps:        "10 minutes",
        focus:       "Angle awareness",
      },
    ],
    good: [
      {
        title:       "Off-Speed Variation",
        description: "Alternate between full power and 60% power rolls. The approach and swing should look identical — only contact changes.",
        reps:        "3 × 10 reps each",
        focus:       "Deceptive off-speed",
      },
      {
        title:       "Cut Shot Precision",
        description: "Attack cross-court with a late wrist cut. Aim for the back third. This is about timing, not strength.",
        reps:        "3 × 12 reps",
        focus:       "Late wrist adjustment",
      },
      {
        title:       "Pipe Attacks",
        description: "Back-row attacks from the middle. Focus on a higher contact point and a steeper angle.",
        reps:        "3 × 10 reps",
        focus:       "Back-row mechanics",
      },
    ],
  },
};

/* Fallback drills when skill is unknown */
const FALLBACK_DRILLS: Drill[] = [
  {
    title:       "Slow Motion Reps",
    description: "Perform the movement at 30% speed. Focus on each phase. Make it perfect before adding pace.",
    reps:        "3 × 10 reps",
    focus:       "Mechanics over speed",
  },
  {
    title:       "Freeze and Check",
    description: "Hold your finish position for 2 seconds after every rep. Check your posture, balance, and arm position.",
    reps:        "3 × 12 reps",
    focus:       "Body awareness",
  },
];

/* =====================================================
   HELPERS
===================================================== */
function getCoachTone(quality: string): { headline: string; body: string } {
  if (quality === "good") {
    return {
      headline: "Strong rep — now make it repeatable.",
      body:     "The technique is there. The next step is owning it under fatigue and pressure. Chase identical execution, not perfect execution.",
    };
  }
  if (quality === "situational") {
    return {
      headline: "You're close — stabilize before you push harder.",
      body:     "The foundation is there but inconsistency is costing you. Slow down, lock one thing at a time, and build from a clean base.",
    };
  }
  return {
    headline: "Strip it back and rebuild.",
    body:     "Don't add speed or reps yet. Focus entirely on the mechanics below. Ten clean slow reps beats a hundred rushed ones every time.",
  };
}

function getQualityColor(quality: string, primary: string): string {
  if (quality === "good")        return "#22c55e";
  if (quality === "situational") return "#facc15";
  return "#ef4444";
}

function getQualityIcon(quality: string): keyof typeof Ionicons.glyphMap {
  if (quality === "good")        return "checkmark-circle";
  if (quality === "situational") return "ellipse-outline";
  return "alert-circle";
}

/* =====================================================
   SCREEN
===================================================== */
export default function NextActionScreen() {
  const colors = useAppColors();

  const { skill, quality, primary_fix, skill_confidence } =
    useLocalSearchParams<any>();

  const skillStr   = String(skill   || "").toLowerCase();
  const qualityStr = String(quality || "bad").toLowerCase();
  const fixStr     = String(primary_fix || "").trim();

  /* ─── Select drills based on skill + quality ─── */
  const drills: Drill[] = useMemo(() => {
    const skillDrills = DRILLS[skillStr];
    if (!skillDrills) return FALLBACK_DRILLS;

    const qualityDrills =
      skillDrills[qualityStr] ??
      skillDrills["situational"] ??
      FALLBACK_DRILLS;

    return qualityDrills;
  }, [skillStr, qualityStr]);

  const tone         = getCoachTone(qualityStr);
  const qualityColor = getQualityColor(qualityStr, colors.primary);
  const qualityIcon  = getQualityIcon(qualityStr);

  const confNum = Number(skill_confidence);
  const confPct = Number.isFinite(confNum)
    ? Math.round((confNum <= 1 ? confNum * 100 : confNum))
    : null;

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── HEADER ─── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.85}
            style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="arrow-back" size={18} color={colors.text} />
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.title, { color: colors.text }]}>
              Training Focus
            </Text>
            <Text style={{ color: colors.muted, marginTop: 2 }}>
              Turn this rep into progress
            </Text>
          </View>
        </View>

        {/* ─── REP SUMMARY PILL ─── */}
        <View style={styles.pillRow}>
          <View
            style={[
              styles.pill,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons name={qualityIcon} size={15} color={qualityColor} />
            <Text style={{ color: colors.text, fontWeight: "900", fontSize: 13 }}>
              {qualityStr.toUpperCase()}
            </Text>
          </View>

          {skillStr.length > 0 && (
            <View
              style={[
                styles.pill,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Ionicons name="body-outline" size={15} color={colors.muted} />
              <Text style={{ color: colors.text, fontWeight: "900", fontSize: 13 }}>
                {skillStr.toUpperCase()}
              </Text>
            </View>
          )}

          {confPct !== null && (
            <View
              style={[
                styles.pill,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Ionicons name="analytics-outline" size={15} color={colors.muted} />
              <Text style={{ color: colors.text, fontWeight: "900", fontSize: 13 }}>
                {confPct}% confidence
              </Text>
            </View>
          )}
        </View>

        {/* ─── AI PRIMARY FIX ─── */}
        {fixStr.length > 0 && (
          <View
            style={[
              styles.card,
              {
                backgroundColor:  colors.card,
                borderColor:      colors.border,
                borderLeftWidth:  4,
                borderLeftColor:  colors.primary,
              },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Ionicons name="sparkles" size={16} color={colors.primary} />
              </View>
              <Text
                style={{
                  color:         colors.primary,
                  fontWeight:    "900",
                  fontSize:      11,
                  letterSpacing: 0.8,
                  textTransform: "uppercase",
                }}
              >
                AI Coaching Fix
              </Text>
            </View>

            <Text
              style={{
                color:      colors.text,
                fontSize:   15,
                fontWeight: "800",
                lineHeight: 22,
              }}
            >
              {fixStr}
            </Text>
          </View>
        )}

        {/* ─── COACH TONE CARD ─── */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}>
            {tone.headline}
          </Text>
          <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 20 }}>
            {tone.body}
          </Text>
        </View>

        {/* ─── DRILLS ─── */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text
            style={[styles.sectionLabel, { color: colors.muted }]}
          >
            Today's Drills
          </Text>

          {drills.map((d, i) => (
            <View
              key={i}
              style={[
                styles.drillRow,
                {
                  borderBottomWidth: i < drills.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              {/* Drill number */}
              <View
                style={[
                  styles.drillNumber,
                  { backgroundColor: colors.background, borderColor: colors.border },
                ]}
              >
                <Text style={{ color: colors.text, fontWeight: "900", fontSize: 13 }}>
                  {i + 1}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontWeight: "900", fontSize: 15 }}>
                  {d.title}
                </Text>

                <Text style={{ color: colors.muted, marginTop: 4, lineHeight: 19 }}>
                  {d.description}
                </Text>

                <View style={styles.drillMeta}>
                  <View
                    style={[
                      styles.repsPill,
                      { backgroundColor: colors.background, borderColor: colors.border },
                    ]}
                  >
                    <Ionicons name="time-outline" size={13} color={colors.muted} />
                    <Text style={{ color: colors.text, fontWeight: "900", fontSize: 12 }}>
                      {d.reps}
                    </Text>
                  </View>

                  <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 12 }}>
                    {d.focus}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ─── REMINDER ─── */}
        <View
          style={[
            styles.reminder,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="bulb-outline" size={16} color={colors.muted} />
          <Text style={{ color: colors.muted, flex: 1, lineHeight: 18 }}>
            Aim for 10–15 clean reps before adding speed. Record another clip after to track your improvement.
          </Text>
        </View>

        {/* ─── ACTIONS ─── */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => router.replace("/")}
            activeOpacity={0.9}
          >
            <Text style={styles.primaryText}>Analyse Another Rep</Text>
            <Ionicons name="repeat" size={18} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.border, backgroundColor: colors.background }]}
            onPress={() => router.push("/progress")}
            activeOpacity={0.9}
          >
            <Text style={{ color: colors.text, fontWeight: "900" }}>View Progress</Text>
            <Ionicons name="stats-chart-outline" size={18} color={colors.muted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

/* =====================================================
   STYLES
===================================================== */
const styles = StyleSheet.create({
  container: {
    flex:    1,
    padding: 22,
  },

  header: {
    marginTop:     Platform.select({ ios: 6, android: 10, default: 10 }),
    flexDirection: "row",
    alignItems:    "center",
    marginBottom:  18,
  },

  backBtn: {
    width:          44,
    height:         44,
    borderRadius:   16,
    borderWidth:    1,
    alignItems:     "center",
    justifyContent: "center",
  },

  title: {
    fontSize:   26,
    fontWeight: "900",
  },

  pillRow: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           8,
    marginBottom:  14,
  },

  pill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               6,
    borderRadius:      999,
    borderWidth:       1,
    paddingVertical:   7,
    paddingHorizontal: 11,
  },

  card: {
    borderRadius: 20,
    padding:      18,
    marginBottom: 14,
    borderWidth:  1,
  },

  iconWrap: {
    width:          34,
    height:         34,
    borderRadius:   12,
    borderWidth:    1,
    alignItems:     "center",
    justifyContent: "center",
  },

  sectionLabel: {
    fontSize:      12,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    fontWeight:    "900",
    marginBottom:  14,
  },

  drillRow: {
    flexDirection:  "row",
    gap:            14,
    paddingVertical: 14,
    alignItems:     "flex-start",
  },

  drillNumber: {
    width:          30,
    height:         30,
    borderRadius:   10,
    borderWidth:    1,
    alignItems:     "center",
    justifyContent: "center",
    marginTop:      2,
  },

  drillMeta: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           10,
    marginTop:     8,
    flexWrap:      "wrap",
  },

  repsPill: {
    flexDirection:     "row",
    alignItems:        "center",
    gap:               5,
    borderRadius:      999,
    borderWidth:       1,
    paddingVertical:   5,
    paddingHorizontal: 9,
  },

  reminder: {
    flexDirection:  "row",
    alignItems:     "flex-start",
    gap:            10,
    borderRadius:   16,
    borderWidth:    1,
    padding:        14,
    marginBottom:   14,
  },

  primaryButton: {
    paddingVertical:   14,
    borderRadius:      16,
    alignItems:        "center",
    flexDirection:     "row",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
  },

  primaryText: {
    color:      "#000",
    fontSize:   16,
    fontWeight: "900",
  },

  secondaryButton: {
    marginTop:         12,
    paddingVertical:   14,
    borderRadius:      16,
    alignItems:        "center",
    borderWidth:       1,
    flexDirection:     "row",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
  },
});