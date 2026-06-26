import { useState, useEffect } from "react";
import { Save, MapPin, Building2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "general", label: "General", icon: Building2 },
  { id: "showrooms", label: "Showrooms", icon: MapPin },
] as const;

type TabId = (typeof TABS)[number]["id"];

const SETTINGS_KEY = "kl7_settings_v1";

interface SettingsData {
  general: {
    name: string;
    legalName: string;
    phone: string;
    email: string;
    website: string;
    gst: string;
  };
  ernakulam: {
    displayName: string;
    phone: string;
    address: string;
    openTime: string;
    closeTime: string;
  };
  aluva: {
    displayName: string;
    phone: string;
    address: string;
    openTime: string;
    closeTime: string;
  };
}

const DEFAULT_SETTINGS: SettingsData = {
  general: {
    name: "KL7 Garage",
    legalName: "KL7 Garage Pvt Ltd",
    phone: "+91 98470 11122",
    email: "contact@kl7garage.in",
    website: "https://kl7garage.in",
    gst: "32AABCX1234Y1Z1",
  },
  ernakulam: {
    displayName: "KL7 Garage — Ernakulam",
    phone: "+91 98460 11111",
    address: "NH 66, Vytilla Junction, Ernakulam, Kerala 682019",
    openTime: "09:00",
    closeTime: "19:00",
  },
  aluva: {
    displayName: "KL7 Garage — Aluva",
    phone: "+91 95440 22222",
    address: "MG Road, Aluva, Ernakulam, Kerala 683101",
    openTime: "09:00",
    closeTime: "19:00",
  },
};

function loadSettings(): SettingsData {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [settings, setSettings] = useState<SettingsData>(loadSettings);

  // helpers to update nested fields
  function setGeneral(field: keyof SettingsData["general"], value: string) {
    setSettings((s) => ({ ...s, general: { ...s.general, [field]: value } }));
  }
  function setShowroom(
    room: "ernakulam" | "aluva",
    field: keyof SettingsData["ernakulam"],
    value: string
  ) {
    setSettings((s) => ({ ...s, [room]: { ...s[room], [field]: value } }));
  }

  function saveGeneral() {
    try {
      const current = loadSettings();
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, general: settings.general }));
      toast.success("General settings saved");
    } catch {
      toast.error("Couldn't save — storage unavailable");
    }
  }

  function saveShowrooms() {
    try {
      const current = loadSettings();
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ ...current, ernakulam: settings.ernakulam, aluva: settings.aluva })
      );
      toast.success("Showroom settings saved");
    } catch {
      toast.error("Couldn't save — storage unavailable");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Configure your dealership and console preferences" />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Tab nav */}
        <div className="shrink-0 lg:w-52">
          <nav className="flex gap-1 lg:flex-col">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  activeTab === id
                    ? "bg-ink text-white"
                    : "text-muted hover:bg-canvas-dim hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="min-w-0 flex-1 space-y-4">
          {activeTab === "general" && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Dealership Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>Dealership Name</Label>
                      <Input
                        value={settings.general.name}
                        onChange={(e) => setGeneral("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Legal Name</Label>
                      <Input
                        value={settings.general.legalName}
                        onChange={(e) => setGeneral("legalName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Primary Phone</Label>
                      <Input
                        value={settings.general.phone}
                        onChange={(e) => setGeneral("phone", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={settings.general.email}
                        onChange={(e) => setGeneral("email", e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Website</Label>
                      <Input
                        value={settings.general.website}
                        onChange={(e) => setGeneral("website", e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>GST Number</Label>
                      <Input
                        value={settings.general.gst}
                        onChange={(e) => setGeneral("gst", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button variant="accent" onClick={saveGeneral} className="gap-2">
                <Save className="h-4 w-4" /> Save General Settings
              </Button>
            </>
          )}

          {activeTab === "showrooms" && (
            <>
              {(["ernakulam", "aluva"] as const).map((room) => {
                const data = settings[room];
                const label = room === "ernakulam" ? "Ernakulam" : "Aluva";
                return (
                  <Card key={room}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted" /> {label} Showroom
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label>Display Name</Label>
                          <Input
                            value={data.displayName}
                            onChange={(e) => setShowroom(room, "displayName", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input
                            value={data.phone}
                            onChange={(e) => setShowroom(room, "phone", e.target.value)}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label>Address</Label>
                          <Input
                            value={data.address}
                            onChange={(e) => setShowroom(room, "address", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Opening Time</Label>
                          <Input
                            type="time"
                            value={data.openTime}
                            onChange={(e) => setShowroom(room, "openTime", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Closing Time</Label>
                          <Input
                            type="time"
                            value={data.closeTime}
                            onChange={(e) => setShowroom(room, "closeTime", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              <Button variant="accent" onClick={saveShowrooms} className="gap-2">
                <Save className="h-4 w-4" /> Save Showroom Settings
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}