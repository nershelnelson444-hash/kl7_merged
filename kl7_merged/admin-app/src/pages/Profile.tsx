import { useState, useRef, useCallback, useEffect } from "react";
import { Save, Camera, ZoomIn, ZoomOut, RotateCw, Check, X } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { initials } from "@/lib/utils";

const PROFILE_KEY = "kl7_profile_v1";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  role: string;
}

function loadProfile(defaults: ProfileData): ProfileData {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

// ─── Circular crop canvas ────────────────────────────────────────────────────
interface CropState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

function CropModal({
  src,
  onDone,
  onCancel,
}: {
  src: string;
  onDone: (dataUrl: string) => void;
  onCancel: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const SIZE = 280; // canvas size (circle diameter)

  const [crop, setCrop] = useState<CropState>({ x: 0, y: 0, scale: 1, rotation: 0 });
  const [loaded, setLoaded] = useState(false);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      // auto-fit: scale so the shorter side fills the circle
      const fit = SIZE / Math.min(img.naturalWidth, img.naturalHeight);
      setCrop({ x: 0, y: 0, scale: fit, rotation: 0 });
      setLoaded(true);
    };
    img.src = src;
  }, [src]);

  // Draw every time crop changes
  useEffect(() => {
    if (!loaded || !imgRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imgRef.current;
    ctx.clearRect(0, 0, SIZE, SIZE);

    // clip to circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();

    // translate/rotate/scale around centre
    ctx.translate(SIZE / 2 + crop.x, SIZE / 2 + crop.y);
    ctx.rotate((crop.rotation * Math.PI) / 180);
    ctx.scale(crop.scale, crop.scale);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

    ctx.restore();

    // draw circular border
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 1, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [crop, loaded]);

  // Drag handlers
  function onMouseDown(e: React.MouseEvent) {
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: crop.x, origY: crop.y };
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setCrop((c) => ({ ...c, x: dragRef.current!.origX + dx, y: dragRef.current!.origY + dy }));
  }
  function onMouseUp() { dragRef.current = null; }

  // Touch handlers
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    dragRef.current = { startX: t.clientX, startY: t.clientY, origX: crop.x, origY: crop.y };
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!dragRef.current) return;
    const t = e.touches[0];
    const dx = t.clientX - dragRef.current.startX;
    const dy = t.clientY - dragRef.current.startY;
    setCrop((c) => ({ ...c, x: dragRef.current!.origX + dx, y: dragRef.current!.origY + dy }));
  }

  function handleApply() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // export as circular PNG
    const out = document.createElement("canvas");
    out.width = SIZE;
    out.height = SIZE;
    const ctx = out.getContext("2d")!;
    ctx.drawImage(canvas, 0, 0);
    onDone(out.toDataURL("image/png"));
  }

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Crop Profile Photo</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 py-2">
          {/* Canvas crop area */}
          <div
            className="relative overflow-hidden rounded-full shadow-lg cursor-grab active:cursor-grabbing"
            style={{ width: SIZE, height: SIZE, background: "#111" }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onMouseUp}
          >
            <canvas ref={canvasRef} width={SIZE} height={SIZE} className="block" />
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center text-white/60 text-sm">
                Loading…
              </div>
            )}
            {/* guide ring */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.25)" }}
            />
          </div>

          <p className="text-xs text-muted">Drag to reposition · Use slider to zoom</p>

          {/* Zoom */}
          <div className="flex w-full items-center gap-3">
            <ZoomOut className="h-4 w-4 shrink-0 text-muted" />
            <input
              type="range"
              min={0.3}
              max={3}
              step={0.01}
              value={crop.scale}
              onChange={(e) => setCrop((c) => ({ ...c, scale: Number(e.target.value) }))}
              className="flex-1 accent-lime"
            />
            <ZoomIn className="h-4 w-4 shrink-0 text-muted" />
          </div>

          {/* Rotate */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2 w-full"
            onClick={() => setCrop((c) => ({ ...c, rotation: (c.rotation + 90) % 360 }))}
          >
            <RotateCw className="h-4 w-4" /> Rotate 90°
          </Button>

          {/* Actions */}
          <div className="flex w-full gap-3">
            <Button variant="outline" className="flex-1 gap-2" onClick={onCancel}>
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button variant="accent" className="flex-1 gap-2" onClick={handleApply} disabled={!loaded}>
              <Check className="h-4 w-4" /> Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Profile page ────────────────────────────────────────────────────────
export default function Profile() {
  const { user, updateUser } = useAuth();

  const defaults: ProfileData = {
    name: user?.name ?? "Admin User",
    email: user?.email ?? "admin@kl7garage.in",
    phone: "+91 98470 11122",
    role: user?.role ?? "Owner",
  };

  const [profile, setProfile] = useState<ProfileData>(() => loadProfile(defaults));
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);



  function setField(field: keyof ProfileData, value: string) {
    setProfile((p) => ({ ...p, [field]: value }));
  }

  function saveProfile() {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      // update the auth user so topbar name + avatar reflect immediately
      updateUser({ name: profile.name, email: profile.email, avatar });
      toast.success("Profile updated");
    } catch {
      toast.error("Couldn't save — storage unavailable");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setCropSrc(ev.target.result as string);
    };
    reader.readAsDataURL(file);
    // reset input so same file can be re-selected
    e.target.value = "";
  }

  function handleCropDone(dataUrl: string) {
    setAvatar(dataUrl);
    setCropSrc(null);
    // immediately persist avatar to auth user
    updateUser({ avatar: dataUrl });
    toast.success("Profile photo updated");
  }

  return (
    <>
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onDone={handleCropDone}
          onCancel={() => setCropSrc(null)}
        />
      )}

      <div className="space-y-6">
        <PageHeader title="Profile" description="Manage your personal account details" />

        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          {/* Avatar card */}
          <Card className="flex flex-col items-center gap-4 p-6 lg:w-56">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-line text-2xl">
                <AvatarImage src={avatar} alt={profile.name} />
                <AvatarFallback className="text-xl font-semibold">
                  {initials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white shadow-md transition-colors hover:bg-ink/80"
                title="Upload photo"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="text-center">
              <div className="font-semibold text-ink">{profile.name}</div>
              <div className="text-xs text-muted">{profile.role}</div>
            </div>
          </Card>

          {/* Info + password */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setField("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input
                      value={profile.role}
                      onChange={(e) => setField("role", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setField("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="accent" onClick={saveProfile} className="gap-2">
              <Save className="h-4 w-4" /> Save Profile
            </Button>

          </div>
        </div>
      </div>
    </>
  );
}