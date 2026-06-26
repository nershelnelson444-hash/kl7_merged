import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import supabase from '../config/supabaseclient';
import CarsCard from '../components/CarsCard';
import FadeIn from '../components/FadeIn';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';
import Button from '../components/Button';
import FilterSidebar, { type FilterState, defaultFilters } from '../components/FilterSidebar';

const categories = ["All", "Cruiser", "Sports", "Adventure", "Naked", "Scooter"];

function toCamelCase(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] = v;
  }
  return out;
}

export default function Inventory() {
  const [searchParams] = useSearchParams();
  const [bikes, setBikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(defaultFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    fetchBikes();
  }, []);

  async function fetchBikes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("bikes")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to fetch bikes:", error);
    } else {
      setBikes((data ?? []).map((d) => toCamelCase(d as unknown as Record<string, unknown>)));
    }
    setLoading(false);
  }

  const filteredBikes = useMemo(() => {
    return bikes.filter((bike) => {
      const name = `${bike.brand} ${bike.model}`.toLowerCase();
      const model = bike.model?.toLowerCase() ?? "";
      const make = bike.brand ?? "";
      const price = Number(bike.price) || 0;
      const year = Number(bike.year) || 0;
      const mileage = Number(bike.odometer) || 0;
      const color = bike.color ?? "";
      const bodyType = bike.bodyType ?? "";

      const matchSearch = name.includes(searchQuery.toLowerCase()) || model.includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === "All" || bodyType.toLowerCase() === activeCategory.toLowerCase();
      const matchBrand = appliedFilters.brands.length === 0 || appliedFilters.brands.includes(make);
      const matchPrice = price >= appliedFilters.priceRange[0] && price <= appliedFilters.priceRange[1];
      const matchYear = year >= appliedFilters.yearRange[0] && year <= appliedFilters.yearRange[1];
      const matchBodyType =
        appliedFilters.bodyTypes.length === 0 ||
        appliedFilters.bodyTypes.some((t) => bodyType.toLowerCase() === t.toLowerCase());
      const matchColor =
        appliedFilters.colors.length === 0 ||
        appliedFilters.colors.some((c) => color.toLowerCase().includes(c.toLowerCase()));
      const matchKm = mileage >= appliedFilters.kmRange[0] && mileage <= appliedFilters.kmRange[1];
      const segment = price >= 150000 ? "Luxury" : "Normal";
      const matchSegment = appliedFilters.segments.length === 0 || appliedFilters.segments.includes(segment);

      return (
        matchSearch && matchCategory && matchBrand && matchPrice && matchYear &&
        matchBodyType && matchColor && matchKm && matchSegment
      );
    });
  }, [searchQuery, activeCategory, appliedFilters, bikes]);

  const applyFilters = () => {
    setAppliedFilters(filters);
    setMobileFiltersOpen(false);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const activeFilterCount =
    appliedFilters.brands.length +
    appliedFilters.bodyTypes.length +
    appliedFilters.colors.length +
    appliedFilters.segments.length +
    (appliedFilters.priceRange[0] !== defaultFilters.priceRange[0] || appliedFilters.priceRange[1] !== defaultFilters.priceRange[1] ? 1 : 0) +
    (appliedFilters.yearRange[0] !== defaultFilters.yearRange[0] || appliedFilters.yearRange[1] !== defaultFilters.yearRange[1] ? 1 : 0) +
    (appliedFilters.kmRange[0] !== defaultFilters.kmRange[0] || appliedFilters.kmRange[1] !== defaultFilters.kmRange[1] ? 1 : 0);

  return (
    <div className="w-full min-h-screen bg-background-main flex flex-col">

      {/* ─── PAGE HERO ───────────────────────────────── */}
      <section className="w-full bg-background-main pt-[104px] pb-0 flex flex-col items-center">
        <div className="max-w-[1480px] w-full px-8 flex flex-col gap-6 py-10">
          <FadeIn direction="up">
            <div className="flex flex-col lg:flex-row justify-between items-end w-full gap-8">
              <div className="flex flex-col gap-4">
                <span className="text-sm font-bold uppercase tracking-wider text-text-extra-muted">Our Collection</span>
                <h1 className="text-[56px] font-bold leading-none tracking-[-0.03em]">Browse Bikes</h1>
              </div>
              <div className="flex flex-col items-end gap-6 max-w-[480px]">
                <p className="text-text-black-muted font-medium text-base text-right">
                  Curated pre-owned motorcycles, rigorously inspected and ready for immediate delivery.
                </p>
                <div className="flex flex-row gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-[32px] font-bold leading-none">25+</span>
                    <span className="text-sm font-medium text-text-extra-muted uppercase tracking-wider mt-1">Brands</span>
                  </div>
                  <div className="w-px bg-grey-main" />
                  <div className="flex flex-col items-center">
                    <span className="text-[32px] font-bold leading-none">100+</span>
                    <span className="text-sm font-medium text-text-extra-muted uppercase tracking-wider mt-1">Bikes in Stock</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── SEARCH + FILTER TRIGGER ─────────────────── */}
      <section className="w-full bg-background-main border-t border-grey-main sticky top-[78px] z-30">
        <div className="max-w-[1480px] w-full px-8 mx-auto py-3 flex flex-col gap-3">

          {/* ── Search bar ── */}
          <div
            className={[
              // layout
              "w-full flex items-center gap-2.5",
              // sizing — 48px desktop, 44px mobile via min-h
              "h-[48px] sm:h-[52px]",
              // shape
              "rounded-2xl",
              // colours
              "bg-white",
              // border: default subtle, blue ring on focus
              "border",
              searchFocused
                ? "border-black/30 shadow-[0_0_0_3px_rgba(0,0,0,0.06)]"
                : "border-[#e5e5e5]",
              // padding: horizontal only — vertical centering comes from flex
              "px-4",
              // smooth transition
              "transition-all duration-200",
            ].join(" ")}
          >
            {/* Icon — fixed size, no extra wrapper padding */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#9ca3af] shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            {/* Input — no extra height, no padding top/bottom, all centering from parent flex */}
            <input
              type="text"
              placeholder="Search brands, models..."
              className={[
                "flex-1 min-w-0",
                "bg-transparent outline-none border-none",
                "text-[14px] sm:text-[15px] font-medium leading-none",
                "text-[#111]",
                "placeholder:text-[#9ca3af] placeholder:font-normal",
                // remove browser default padding/height quirks
                "py-0 h-auto",
              ].join(" ")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />

            {/* Clear button — only visible when there's a query */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[#e5e5e5] hover:bg-[#d4d4d4] transition-colors"
                aria-label="Clear search"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="2" y1="2" x2="8" y2="8" />
                  <line x1="8" y1="2" x2="2" y2="8" />
                </svg>
              </button>
            )}
          </div>

          {/* ── Category pills + mobile filter button ── */}
          <div className="flex flex-row items-center gap-2 min-w-0">
            <div className="flex flex-row gap-2 overflow-x-auto hide-scrollbar min-w-0 flex-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={[
                    "whitespace-nowrap shrink-0 px-4 h-[34px] rounded-full text-[13px] font-semibold tracking-wide transition-all duration-150 border",
                    activeCategory === cat
                      ? "bg-black text-white border-black"
                      : "bg-white text-[#444] border-[#e5e5e5] hover:border-black/20 hover:bg-[#fafafa]",
                  ].join(" ")}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mobile filter trigger */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden shrink-0 ml-1 flex items-center gap-1.5 h-[34px] px-3 rounded-full border border-[#e5e5e5] bg-white text-[13px] font-semibold text-[#444] hover:border-black/20 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-[10px] font-bold leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </section>

      {/* ─── CONTENT: SIDEBAR + GRID ─────────────────── */}
      <section className="w-full bg-background-main py-12 pb-16 flex flex-col items-center">
        <div className="max-w-[1480px] w-full px-4 md:px-8 flex flex-col lg:flex-row gap-10">

          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-[160px] bg-white border border-grey-main rounded-2xl p-6 max-h-[calc(100vh-180px)] overflow-y-auto">
              <FilterSidebar filters={filters} onChange={setFilters} onApply={applyFilters} onReset={resetFilters} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="w-full py-32 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-black-main border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredBikes.length > 0 ? (
              <StaggerContainer delayChildren={0.1} staggerChildren={0.08} className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
                {filteredBikes.map((bike) => (
                  <StaggerItem key={bike.id}>
                    <Link to={`/inventory/${bike.id}`} className="block">
                      <CarsCard item={{
                        id: bike.id,
                        slug: bike.id,
                        draft: false,
                        fieldData: {
                          i251F_cLI: { value: `${bike.brand} ${bike.model}` },
                          yhmUaSJgn: { value: bike.images?.[0] || '' },
                          AsGqvZIRE: { value: String(bike.year) },
                          ieALPznS3: { value: String(bike.price) },
                          FixYCUMxe: { value: bike.odometer },
                          XKcYqdDj3: { value: bike.fuelType },
                          DUdYPJIP0: { value: bike.specs?.transmission || '' },
                          oBzwmlvOK: { value: bike.condition },
                        }
                      } as any} />
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="w-full py-32 flex flex-col items-center justify-center gap-4 text-center">
                <h3 className="text-[24px] font-bold text-text-black">No bikes found</h3>
                <p className="text-text-black-muted">Try adjusting your search or filter criteria.</p>
                <Button
                  variant="primary"
                  onClick={() => { setSearchQuery(""); setActiveCategory("All"); resetFilters(); }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── MOBILE FILTER DRAWER ─────────────────────── */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background-main flex flex-col">
          <div className="flex items-center gap-4 px-6 py-5 border-b border-grey-main shrink-0">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Back"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-grey-main"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-bold text-text-black">Filters</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <FilterSidebar filters={filters} onChange={setFilters} onApply={applyFilters} onReset={resetFilters} />
          </div>
        </div>
      )}

    </div>
  );
}