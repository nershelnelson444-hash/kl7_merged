import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, Search, User, Settings, LogOut, ShoppingCart, MessageSquare, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { initials, formatRelativeTime } from "@/lib/utils";
import { useSellEnquiries } from "@/hooks/useSellEnquiry";
import { useCustomerEnquiries } from "@/hooks/useCustomerEnquiry";
import { cn } from "@/lib/utils";

export function Topbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem("kl7_notif_read");
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  });

  const { data: sellEnquiries } = useSellEnquiries();
  const { data: customerEnquiries } = useCustomerEnquiries();

  // Build notifications from real enquiry data — newest first, max 10
  const notifications = useMemo(() => {
    const items: { id: string; type: "sell" | "customer"; text: string; time: Date; href: string }[] = [];

    (sellEnquiries ?? []).forEach((e) => {
      items.push({
        id: `sell-${e.id}`,
        type: "sell",
        text: `Sell enquiry from ${e.fullName} — ${e.brand} ${e.model} (${e.year})`,
        time: new Date(e.createdAt),
        href: "/sell-enquiry",
      });
    });

    (customerEnquiries ?? []).forEach((e) => {
      items.push({
        id: `customer-${e.id}`,
        type: "customer",
        text: `Customer message from ${e.fullName} — "${e.subject}"`,
        time: new Date(e.createdAt),
        href: "/customer-enquiry",
      });
    });

    return items.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 10);
  }, [sellEnquiries, customerEnquiries]);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  function markAllRead() {
    const newSet = new Set(notifications.map((n) => n.id));
    setReadIds(newSet);
    try {
      localStorage.setItem("kl7_notif_read", JSON.stringify([...newSet]));
    } catch {}
  }

  function markRead(id: string) {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem("kl7_notif_read", JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }

  // Search: filter across both enquiry lists
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();

    const sellHits = (sellEnquiries ?? [])
      .filter((e) =>
        [e.fullName, e.email, e.phone, e.brand, e.model].some((v) => v.toLowerCase().includes(q))
      )
      .slice(0, 4)
      .map((e) => ({
        id: `sell-${e.id}`,
        label: `${e.fullName} — ${e.brand} ${e.model}`,
        sub: "Sell Enquiry",
        href: "/sell-enquiry",
        icon: ShoppingCart,
      }));

    const custHits = (customerEnquiries ?? [])
      .filter((e) =>
        [e.fullName, e.email, e.phone, e.subject].some((v) => v.toLowerCase().includes(q))
      )
      .slice(0, 4)
      .map((e) => ({
        id: `customer-${e.id}`,
        label: `${e.fullName} — ${e.subject}`,
        sub: "Customer Enquiry",
        href: "/customer-enquiry",
        icon: MessageSquare,
      }));

    return [...sellHits, ...custHits];
  }, [search, sellEnquiries, customerEnquiries]);

  function handleSearchSelect(href: string) {
    navigate(href);
    setSearch("");
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-canvas/85 px-4 py-3 backdrop-blur sm:px-6">
      <button
        onClick={onOpenMobile}
        className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-canvas-dim lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search bar — desktop */}
      <div className="relative hidden flex-1 max-w-sm sm:block">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setSearchOpen(true); }}
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
          placeholder="Search bikes, leads, VIN..."
          className="rounded-full bg-surface pl-10"
        />
        {searchOpen && search.trim() && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-line bg-canvas shadow-lg">
            {searchResults.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted">No results for "{search}"</div>
            ) : (
              searchResults.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    onMouseDown={() => handleSearchSelect(r.href)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-canvas-dim"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted" />
                    <div>
                      <div className="font-medium text-ink">{r.label}</div>
                      <div className="text-xs text-muted">{r.sub}</div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface shadow-soft transition-colors hover:bg-canvas-dim">
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ember text-[10px] font-bold text-white ring-2 ring-surface">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96">
            <div className="flex items-center justify-between px-2 py-1.5">
              <DropdownMenuLabel className="p-0 text-sm font-semibold">
                Notifications {unreadCount > 0 && <span className="ml-1 text-xs text-muted">({unreadCount} new)</span>}
              </DropdownMenuLabel>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs font-medium text-muted hover:text-ink"
                >
                  Mark all read
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-muted">No notifications yet</div>
            ) : (
              notifications.map((n) => {
                const isUnread = !readIds.has(n.id);
                const Icon = n.type === "sell" ? ShoppingCart : MessageSquare;
                return (
                  <DropdownMenuItem
                    key={n.id}
                    className={cn(
                      "flex items-start gap-3 whitespace-normal px-3 py-2.5 cursor-pointer",
                      isUnread && "bg-lime/5"
                    )}
                    onClick={() => { markRead(n.id); navigate(n.href); }}
                  >
                    <div className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      n.type === "sell" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                    )}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn("text-sm leading-snug", isUnread ? "font-medium text-ink" : "text-ink/70")}>
                        {n.text}
                      </div>
                      <div className="mt-0.5 text-xs text-muted">{formatRelativeTime(n.time)}</div>
                    </div>
                    {isUnread && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ember" />
                    )}
                  </DropdownMenuItem>
                );
              })
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full ring-offset-2 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink">
              <Avatar className="h-10 w-10 border border-line">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>{user ? initials(user.name) : "?"}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="normal-case font-medium text-ink text-sm">
              {user?.name}
              <div className="text-xs font-normal text-muted">{user?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="flex items-center gap-2 text-danger focus:text-danger">
              <LogOut className="h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}