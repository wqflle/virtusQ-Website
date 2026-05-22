import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import Purchases, { Package } from "react-native-purchases";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppColors } from "../lib/useAppColors";
import { useEntitlements } from "../lib/useEntitlements";
import { Linking } from "react-native";

type Tier = "free" | "pro" | "elite";
type Billing = "monthly" | "yearly";

export default function UpgradeScreen() {
  const colors = useAppColors();
  const ent = useEntitlements();

  // Default to "pro" — users anchor to whatever is pre-selected
  const [selectedTier, setSelectedTier] = useState<Tier>("pro");
  // Default to yearly — 2 months free feels like a win
  const [billing, setBilling] = useState<Billing>("yearly");
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);

  // Fade-in animation for the whole screen
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  const currentTier: Tier = ent.isElite ? "elite" : ent.isPro ? "pro" : "free";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    const load = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        const current = offerings.current;
        const pkgs = current?.availablePackages ?? [];
        setPackages(pkgs);
      } catch (e) {
        console.log("OFFERINGS ERROR:", e);
      }
    };
    load();
  }, []);

  const proMonthly = packages.find(
    (p) => p.product.identifier === "virtusq_pro_monthly_v4"
  );
  const proYearly = packages.find(
    (p) => p.product.identifier === "virtusq_pro_yearly_v4"
  );
  const eliteMonthly = packages.find(
    (p) => p.product.identifier === "virtusq_elite_monthly_v4"
  );
  const eliteYearly = packages.find(
    (p) => p.product.identifier === "virtusq_elite_yearly_v4"
  );

  const formatPrice = (price: string, billing: Billing) =>
    `${price} / ${billing === "monthly" ? "mo" : "yr"}`;

  async function handlePurchase() {
    if (selectedTier === "free") {
      router.back();
      return;
    }
    if (selectedTier === currentTier) {
      Alert.alert("You're already on this plan");
      return;
    }

    try {
      setLoading(true);
      const offerings = await Purchases.getOfferings();
      if (!offerings.current) throw new Error("No offerings available");

      let pkg: Package | undefined;

      if (selectedTier === "pro") {
        pkg =
          billing === "yearly"
            ? offerings.current.availablePackages.find(
                (p) => p.identifier === "pro_yearly"
              )
            : offerings.current.availablePackages.find(
                (p) => p.identifier === "pro_monthly"
              );
      }

      if (selectedTier === "elite") {
        pkg =
          billing === "yearly"
            ? offerings.current.availablePackages.find(
                (p) => p.identifier === "elite_yearly"
              )
            : offerings.current.availablePackages.find(
                (p) => p.identifier === "elite_monthly"
              );
      }

      if (!pkg) {
        console.log(
          "AVAILABLE PACKAGES:",
          offerings.current.availablePackages.map((p) => ({
            packageId: p.identifier,
            productId: p.product.identifier,
          }))
        );
        throw new Error("Subscription package not found");
      }

      const { customerInfo } = await Purchases.purchasePackage(pkg);
      console.log("ENTITLEMENTS:", customerInfo.entitlements.active);

      setTimeout(() => {
        router.replace("/profile");
      }, 300);
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert(
          "Purchase failed",
          "Unable to complete purchase. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const proPrice =
    billing === "monthly"
      ? formatPrice(proMonthly?.product.priceString ?? "...", "monthly")
      : formatPrice(proYearly?.product.priceString ?? "...", "yearly");

  const elitePrice =
    billing === "monthly"
      ? formatPrice(eliteMonthly?.product.priceString ?? "...", "monthly")
      : formatPrice(eliteYearly?.product.priceString ?? "...", "yearly");

  return (
    <>
      <Stack.Screen options={{ title: "Upgrade" }} />

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 24, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          {/* ── HERO ── */}
          <View style={{ marginBottom: 24 }}>
            <Text style={[styles.eyebrow, { color: colors.primary }]}>
              🏐 VirtusQ
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              Your competitors{"\n"}are already using this.
            </Text>
            <Text
              style={{ color: colors.muted, marginTop: 10, lineHeight: 23 }}
            >
              Elite players don't guess what's wrong with their technique. They
              get AI feedback after every single rep — and you can too.
            </Text>
          </View>

          {/* ── SOCIAL PROOF BAR ── */}
          <View
            style={[
              styles.socialProofBar,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.socialProofLeft}>
              <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
              <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>
                4.8 · 2,400+ athletes training smarter
              </Text>
            </View>
            <View
              style={[styles.proofDivider, { backgroundColor: colors.border }]}
            />
            <View style={styles.socialProofRight}>
              <Text
                style={{ color: colors.primary, fontWeight: "900", fontSize: 18 }}
              >
                2.4×
              </Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>
                faster improvement
              </Text>
            </View>
          </View>

          {/* ── WHY UPGRADE — conviction BEFORE price ── */}
          <View
            style={[
              styles.whyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text
              style={{ color: colors.text, fontWeight: "900", fontSize: 16 }}
            >
              Why serious athletes upgrade
            </Text>
            {[
              {
                icon: "trending-up",
                text: "See measurable progress — not guesswork",
              },
              {
                icon: "flash",
                text: "Identify plateaus before they stall improvement",
              },
              {
                icon: "eye",
                text: "Coach-level feedback on every single rep",
              },
              {
                icon: "lock-open",
                text: "The unfair advantage private coaching gives — for free",
              },
            ].map((item) => (
              <View key={item.text} style={styles.whyRow}>
                <View
                  style={[
                    styles.whyIconWrap,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={15}
                    color={colors.primary}
                  />
                </View>
                <Text
                  style={{
                    color: colors.text,
                    marginLeft: 12,
                    flex: 1,
                    lineHeight: 20,
                  }}
                >
                  {item.text}
                </Text>
              </View>
            ))}
          </View>

          {/* ── CURRENTLY ELITE NOTICE ── */}
          {ent.isElite && (
            <View
              style={[
                styles.currentPlanBanner,
                { backgroundColor: colors.card, borderColor: colors.primary },
              ]}
            >
              <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
              <View style={{ marginLeft: 10 }}>
                <Text style={{ color: colors.primary, fontWeight: "900" }}>
                  You're on Elite
                </Text>
                <Text style={{ color: colors.muted, marginTop: 2, fontSize: 13 }}>
                  Manage or cancel in your account settings
                </Text>
              </View>
            </View>
          )}

          {/* ── BILLING TOGGLE ── */}
          <View style={{ marginTop: 28, marginBottom: 6 }}>
            <Text
              style={{
                color: colors.muted,
                textAlign: "center",
                fontSize: 13,
                marginBottom: 12,
              }}
            >
              Less than one private lesson per month
            </Text>
            <View
              style={[
                styles.toggleWrap,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <ToggleOption
                label="Monthly"
                active={billing === "monthly"}
                onPress={() => setBilling("monthly")}
                colors={colors}
              />
              <ToggleOption
                label="Yearly"
                sub="2 months free"
                active={billing === "yearly"}
                onPress={() => setBilling("yearly")}
                colors={colors}
              />
            </View>
          </View>

          {/* ── TIER CARDS ── */}
          {/* PRO — pre-selected */}
          <TierCard
            title="Pro"
            subtitle="Train with intelligence"
            price={proPrice}
            selected={selectedTier === "pro"}
            onPress={() => setSelectedTier("pro")}
            colors={colors}
            trialLabel="7-day free trial · no charge today"
            features={[
              "Skill graphs & progression trends",
              "Streak & consistency tracking",
              "AI-generated training plans",
              "Weekly performance insights",
              "Expanded analysis history",
            ]}
          />

          {/* ELITE */}
          <TierCard
            title="Elite"
            subtitle="Unlock your full performance identity"
            price={elitePrice}
            selected={selectedTier === "elite"}
            onPress={() => setSelectedTier("elite")}
            colors={colors}
            highlight
            highlightLabel="USED BY D1 ATHLETES"
            features={[
              "Everything in Pro",
              "Elite micro-insights per session",
              "Failure & momentum analysis",
              "Advanced biomechanical breakdown",
              "Elite performance tier tracking",
              "Predictive performance signals",
              "Premium themes & visuals",
              "Priority AI coaching logic",
            ]}
          />

          {/* ── FEATURE COMPARISON TABLE ── */}
          <View
            style={[
              styles.tableWrap,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text
              style={{
                color: colors.text,
                fontWeight: "900",
                marginBottom: 14,
                fontSize: 15,
              }}
            >
              Compare plans
            </Text>
            <CompareRow
              feature="AI Video Analysis"
              free="Basic"
              pro="Full"
              elite="Full"
              colors={colors}
              header
            />
            {[
              { feature: "Skill Graphs", free: false, pro: true, elite: true },
              {
                feature: "Training Plans",
                free: false,
                pro: true,
                elite: true,
              },
              {
                feature: "Streak Tracking",
                free: false,
                pro: true,
                elite: true,
              },
              {
                feature: "Biomechanics",
                free: false,
                pro: false,
                elite: true,
              },
              {
                feature: "Predictive Signals",
                free: false,
                pro: false,
                elite: true,
              },
              {
                feature: "Priority AI Logic",
                free: false,
                pro: false,
                elite: true,
              },
            ].map((row) => (
              <CompareRow key={row.feature} {...row} colors={colors} />
            ))}
          </View>

          {/* ── CTA BUTTON ── */}
          <TouchableOpacity
            activeOpacity={0.88}
            disabled={loading}
            style={[
              styles.cta,
              {
                backgroundColor: colors.primary,
                opacity: loading ? 0.7 : 1,
              },
            ]}
            onPress={handlePurchase}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Text style={styles.ctaText}>
                  {selectedTier === "elite"
                    ? "Unlock My Full Potential"
                    : selectedTier === "pro"
                    ? "Start Training Smarter"
                    : "Continue"}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#000" />
              </>
            )}
          </TouchableOpacity>

          {/* Continue free link — soft, not a card */}
          {selectedTier !== "free" && (
            <TouchableOpacity onPress={() => router.back()}>
              <Text
                style={{
                  textAlign: "center",
                  color: colors.muted,
                  marginTop: 14,
                  fontSize: 13,
                  opacity: 0.7,
                }}
              >
                Continue with free →
              </Text>
            </TouchableOpacity>
          )}

          {/* ── TRUST FOOTER ── */}
          <View style={styles.trustRow}>
            {[
              { icon: "lock-closed", label: "Secure" },
              { icon: "refresh", label: "Cancel anytime" },
              { icon: "shield-checkmark", label: "No commitment" },
            ].map((item) => (
              <View key={item.label} style={styles.trustItem}>
                <Ionicons
                  name={item.icon as any}
                  size={13}
                  color={colors.muted}
                />
                <Text
                  style={{
                    color: colors.muted,
                    fontSize: 12,
                    marginLeft: 4,
                    opacity: 0.8,
                  }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>

          {/* ── LEGAL FOOTER ── */}
          <Text
            style={[styles.legalText, { color: colors.muted }]}
          >
            Payment charged to your Apple ID at confirmation. Subscription
            renews automatically unless cancelled at least 24 hours before the
            end of the period.
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 24,
              marginTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
                )
              }
            >
              <Text style={[styles.legalLink, { color: colors.muted }]}>
                Terms of Use
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://virtusq.com/terms")}
            >
              <Text style={[styles.legalLink, { color: colors.muted }]}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                try {
                  await Purchases.restorePurchases();
                  Alert.alert("Restored", "Your purchases have been restored.");
                } catch {
                  Alert.alert("Error", "Could not restore purchases.");
                }
              }}
            >
              <Text style={[styles.legalLink, { color: colors.muted }]}>
                Restore
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://apps.apple.com/account/subscriptions")
            }
          >
            <Text
              style={{
                textAlign: "center",
                marginTop: 10,
                marginBottom: 32,
                fontSize: 12,
                color: colors.muted,
                opacity: 0.6,
              }}
            >
              Manage Subscription
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </>
  );
}

/* ───────────────────────────────────────── */
/* COMPONENTS */
/* ───────────────────────────────────────── */

function ToggleOption({
  label,
  sub,
  active,
  onPress,
  colors,
}: {
  label: string;
  sub?: string;
  active: boolean;
  onPress: () => void;
  colors: any;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.toggleOption,
        {
          backgroundColor: active ? colors.primary : "transparent",
          borderColor: active ? colors.primary : colors.border,
        },
      ]}
    >
      <Text style={{ color: active ? "#000" : colors.text, fontWeight: "900" }}>
        {label}
      </Text>
      {sub && (
        <Text
          style={{
            fontSize: 11,
            marginTop: 2,
            color: active ? "#000" : colors.muted,
            fontWeight: "800",
          }}
        >
          {sub}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function TierCard({
  title,
  subtitle,
  price,
  features,
  selected,
  onPress,
  colors,
  highlight,
  highlightLabel,
  trialLabel,
}: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: selected ? colors.primary : colors.border,
          borderWidth: selected ? 2 : 1,
        },
      ]}
    >
      {/* Badge */}
      {(highlight || trialLabel) && (
        <View style={styles.badgeRow}>
          {highlight && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={{ fontWeight: "900", color: "#000", fontSize: 11 }}>
                {highlightLabel ?? "MOST POPULAR"}
              </Text>
            </View>
          )}
          {trialLabel && selected && (
            <View
              style={[
                styles.trialBadge,
                {
                  backgroundColor: colors.primary + "20",
                  borderColor: colors.primary + "50",
                },
              ]}
            >
              <Ionicons name="gift-outline" size={12} color={colors.primary} />
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "800",
                  fontSize: 11,
                  marginLeft: 4,
                }}
              >
                {trialLabel}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Header */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
          <Text style={{ color: colors.muted, marginTop: 3, fontSize: 13 }}>
            {subtitle}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{ color: colors.primary, fontWeight: "900", fontSize: 18 }}
          >
            {price.split(" /")[0]}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12 }}>
            /{price.split("/ ")[1]}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View
        style={[
          styles.cardDivider,
          { backgroundColor: selected ? colors.primary + "30" : colors.border },
        ]}
      />

      {/* Features */}
      {features.map((f: string) => (
        <View key={f} style={styles.featureRow}>
          <Ionicons
            name="checkmark-circle"
            size={16}
            color={colors.primary}
          />
          <Text style={{ color: colors.text, marginLeft: 8, fontSize: 14 }}>
            {f}
          </Text>
        </View>
      ))}

      {/* Selection indicator */}
      {selected && (
        <View
          style={[
            styles.selectedIndicator,
            { backgroundColor: colors.primary },
          ]}
        >
          <Ionicons name="checkmark" size={14} color="#000" />
          <Text
            style={{
              color: "#000",
              fontWeight: "900",
              fontSize: 12,
              marginLeft: 4,
            }}
          >
            Selected
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function CompareRow({
  feature,
  free,
  pro,
  elite,
  colors,
  header,
}: {
  feature: string;
  free: boolean | string;
  pro: boolean | string;
  elite: boolean | string;
  colors: any;
  header?: boolean;
}) {
  const renderCell = (val: boolean | string) => {
    if (typeof val === "string") {
      return (
        <Text
          style={{
            color: colors.muted,
            fontSize: 12,
            textAlign: "center",
            width: 52,
          }}
        >
          {val}
        </Text>
      );
    }
    return (
      <View style={{ width: 52, alignItems: "center" }}>
        <Ionicons
          name={val ? "checkmark-circle" : "close-circle"}
          size={17}
          color={val ? colors.primary : colors.border}
        />
      </View>
    );
  };

  return (
    <View
      style={[
        styles.tableRow,
        header && {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          paddingBottom: 8,
          marginBottom: 4,
        },
      ]}
    >
      <Text
        style={{
          flex: 1,
          color: header ? colors.muted : colors.text,
          fontSize: header ? 12 : 13,
          fontWeight: header ? "600" : "400",
        }}
      >
        {feature}
      </Text>
      {header ? (
        <>
          <Text
            style={{
              width: 52,
              textAlign: "center",
              color: colors.muted,
              fontSize: 12,
            }}
          >
            Free
          </Text>
          <Text
            style={{
              width: 52,
              textAlign: "center",
              color: colors.muted,
              fontSize: 12,
            }}
          >
            Pro
          </Text>
          <Text
            style={{
              width: 52,
              textAlign: "center",
              color: colors.muted,
              fontSize: 12,
            }}
          >
            Elite
          </Text>
        </>
      ) : (
        <>
          {renderCell(free)}
          {renderCell(pro)}
          {renderCell(elite)}
        </>
      )}
    </View>
  );
}

/* ───────────────────────────────────────── */
/* STYLES */
/* ───────────────────────────────────────── */

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: "uppercase",
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
  },

  /* Social proof */
  socialProofBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 20,
  },
  socialProofLeft: { flex: 1 },
  socialProofRight: { alignItems: "center", paddingLeft: 16 },
  proofDivider: { width: 1, height: 36, marginHorizontal: 14 },
  stars: { fontSize: 14 },

  /* Why card */
  whyCard: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 6,
  },
  whyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  whyIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Current plan banner */
  currentPlanBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 4,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },

  /* Billing toggle */
  toggleWrap: {
    flexDirection: "row",
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 22,
    overflow: "hidden",
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
  },

  /* Tier card */
  card: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  trialBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
  },
  cardDivider: {
    height: 1,
    marginVertical: 14,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  selectedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  /* Comparison table */
  tableWrap: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },

  /* CTA */
  cta: {
    marginTop: 28,
    paddingVertical: 18,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
  },

  /* Trust row */
  trustRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 16,
    marginBottom: 6,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* Legal */
  legalText: {
    textAlign: "center",
    fontSize: 11,
    lineHeight: 16,
    opacity: 0.5,
    marginTop: 16,
    paddingHorizontal: 8,
  },
  legalLink: {
    fontSize: 12,
    opacity: 0.6,
    textDecorationLine: "underline",
  },
});