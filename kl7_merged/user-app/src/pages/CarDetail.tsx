import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../config/supabaseclient';
import BikeImageViewer from '../components/BikeImageViewer';
import Accordion from '../components/Accordion';
import Button from '../components/Button';

// ─── TYPE ─────────────────────────────────────────────────────────────────────
interface Bike {
  id: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  price: number;
  original_price?: number;
  odometer: number;
  condition: string;
  fuel_type: string;
  status: string;
  showroom: string;
  color: string;
  owners: number;
  registration_state: string;
  insurance_valid_till?: string;
  featured: boolean;
  description: string;
  vehicle_overview?: string;
  images?: string[];           // JSONB array of public URLs
  specs?: Record<string, string>;  // JSONB e.g. { engine, power, torque, transmission }
  drivetrain?: string;
  exterior?: string;
  interior?: string;
  body_type?: string;
  reference_number?: string;
  vin?: string;
  key_features?: string[];
  views?: number;
  enquiries?: number;
  created_at?: string;
  updated_at?: string;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function CarDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [bike, setBike]       = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchBike(slug);
  }, [slug]);

  async function fetchBike(id: string) {
    setLoading(true);
    setNotFound(false);

    const { data, error } = await supabase
      .from('bikes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setBike(data as Bike);

      // Increment views (fire-and-forget)
      supabase
        .from('bikes')
        .update({ views: (data.views ?? 0) + 1 })
        .eq('id', id)
        .then(() => {});
    }

    setLoading(false);
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background-main flex items-center justify-center pt-24">
        <div className="w-10 h-10 border-2 border-black-main border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (notFound || !bike) {
    return (
      <div className="w-full min-h-screen bg-background-main flex items-center justify-center pt-24 pb-16 text-center flex-col gap-4">
        <h1 className="text-4xl font-bold">Vehicle Not Found</h1>
        <p className="text-text-black-muted">The vehicle you are looking for does not exist or has been removed.</p>
        <Button asLink to="/inventory" variant="primary" className="mt-4">Back to Inventory</Button>
      </div>
    );
  }

  // ── Build image list from the images[] array ──────────────────────────────
  const imageList = Array.isArray(bike.images) ? bike.images : [];

  const title = `${bike.brand} ${bike.model}${bike.variant ? ` ${bike.variant}` : ''}`;
  const specs = bike.specs ?? {};

  return (
    <div className="w-full min-h-screen bg-background-main flex flex-col pt-32 pb-36 px-4 md:px-8">
      <div className="max-w-[1480px] w-full mx-auto flex flex-col gap-12">

        {/* ── Breadcrumb & Title ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-2 text-text-black-muted font-medium text-sm">
            <Link to="/inventory" className="hover:text-black">Inventory</Link>
            <span>/</span>
            <span className="text-black">{bike.brand}</span>
            <span>/</span>
            <span className="text-black">{title}</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <h1 className="text-[56px] font-bold leading-none tracking-[-0.03em] text-text-black">
              {title}
            </h1>
            <h2 className="text-[48px] font-bold leading-none tracking-[-0.03em] text-text-black">
              ₹{Number(bike.price).toLocaleString('en-IN')}
            </h2>
          </div>
        </div>

        {/* ── Hero Gallery ───────────────────────────────────────────────── */}
        <BikeImageViewer images={imageList} bikeName={title} />

        {/* ── Content Layout ─────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-12 mt-8">

          {/* Main Info */}
          <div className="flex-1 flex flex-col gap-12">

            {/* Highlights Bar */}
            <div className="flex flex-row flex-wrap gap-4 bg-white p-6 rounded-2xl border border-grey-main">
              <div className="flex flex-col pr-8 border-r border-grey-main gap-1">
                <span className="text-text-extra-muted text-sm font-bold uppercase">Year</span>
                <span className="font-bold text-xl">{bike.year}</span>
              </div>
              <div className="flex flex-col pr-8 border-r border-grey-main gap-1">
                <span className="text-text-extra-muted text-sm font-bold uppercase">Odometer</span>
                <span className="font-bold text-xl">{bike.odometer.toLocaleString()} km</span>
              </div>
              {specs.engine && (
                <div className="flex flex-col pr-8 border-r border-grey-main gap-1">
                  <span className="text-text-extra-muted text-sm font-bold uppercase">Engine</span>
                  <span className="font-bold text-xl">{specs.engine}</span>
                </div>
              )}
              {specs.transmission && (
                <div className="flex flex-col gap-1">
                  <span className="text-text-extra-muted text-sm font-bold uppercase">Transmission</span>
                  <span className="font-bold text-xl">{specs.transmission}</span>
                </div>
              )}
            </div>

            {/* Vehicle Overview */}
            {bike.vehicle_overview && (
              <Accordion title="Vehicle Overview" defaultOpen={true}>
                <div className="text-[18px] leading-relaxed text-text-black-muted">
                  {bike.vehicle_overview}
                </div>
              </Accordion>
            )}

            {/* Description */}
            {bike.description && (
              <Accordion title="Description" defaultOpen={!bike.vehicle_overview}>
                <div className="text-[18px] leading-relaxed text-text-black-muted">
                  {bike.description}
                </div>
              </Accordion>
            )}

            {/* Specifications */}
            <Accordion title="Specifications" defaultOpen={true}>
              <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl border border-grey-main overflow-hidden">
                {[
                  { label: 'Drivetrain',    value: bike.drivetrain   },
                  { label: 'Power',         value: specs.power       },
                  { label: 'Torque',        value: specs.torque      },
                  { label: 'Exterior',      value: bike.exterior ?? bike.color },
                  { label: 'Interior',      value: bike.interior     },
                  { label: 'Body Type',     value: bike.body_type    },
                  { label: 'Fuel Type',     value: bike.fuel_type    },
                  { label: 'Mileage',       value: specs.mileage     },
                ].filter(r => r.value).map((row, idx, arr) => (
                  <div
                    key={row.label}
                    className={`p-6 flex justify-between
                      ${idx < arr.length - 1 ? 'border-b' : ''}
                      ${idx % 2 === 0 ? 'md:border-r' : ''}
                      border-grey-main`}
                  >
                    <span className="text-text-black-muted">{row.label}</span>
                    <span className="font-bold">{row.value}</span>
                  </div>
                ))}
              </div>
            </Accordion>

            {/* Key Features */}
            {Array.isArray(bike.key_features) && bike.key_features.length > 0 && (
              <Accordion title="Key Features" defaultOpen={false}>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bike.key_features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-[17px] text-text-black-muted">
                      <span className="w-2 h-2 rounded-full bg-black-main shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Accordion>
            )}

          </div>

          {/* ── Sticky Sidebar ──────────────────────────────────────────── */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-[120px] bg-white rounded-2xl border border-grey-main p-8 flex flex-col gap-8 shadow-sm">
              <div className="flex flex-col gap-2">
                <span className="text-text-black-muted uppercase tracking-wider text-sm font-bold">Interested?</span>
                <h3 className="text-[32px] font-bold leading-none tracking-[-0.03em]">Contact Sales</h3>
              </div>

              <div className="flex flex-col gap-4">
                <Button asLink to="/contact" variant="primary" className="w-full">Enquire Now</Button>
              </div>

              <div className="border-t border-grey-main pt-6 flex flex-col gap-4 text-sm text-text-black-muted">
                {bike.reference_number && (
                  <div className="flex justify-between">
                    <span>Reference</span>
                    <span className="font-medium text-black">{bike.reference_number}</span>
                  </div>
                )}
                {bike.vin && (
                  <div className="flex justify-between">
                    <span>VIN</span>
                    <span className="font-medium text-black">{bike.vin}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Condition</span>
                  <span className="font-medium text-black">{bike.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span>Owners</span>
                  <span className="font-medium text-black">{bike.owners}</span>
                </div>
                <div className="flex justify-between">
                  <span>Showroom</span>
                  <span className="font-medium text-black">{bike.showroom}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reg. State</span>
                  <span className="font-medium text-black">{bike.registration_state}</span>
                </div>
                {bike.insurance_valid_till && (
                  <div className="flex justify-between">
                    <span>Insurance Till</span>
                    <span className="font-medium text-black">{bike.insurance_valid_till}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}